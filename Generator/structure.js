module.exports.structure = function structure(data, meta) {
    var field_meta = meta || multi(data),
        fieldDescLength = (32 * field_meta.length) + 1,
        bytesPerRecord = bytesPer(field_meta), // deleted flag
        buffer = new ArrayBuffer(fieldDescLength +32 +(bytesPerRecord * data.length) +1),
        now = new Date(),view = new DataView(buffer);
    view.setUint8(0, 0x03);view.setUint8(1, now.getFullYear() - 1900);
    view.setUint8(2, now.getMonth());view.setUint8(3, now.getDate());
    view.setUint32(4, data.length, true);
    var headerLength = fieldDescLength + 32;
    view.setUint16(8, headerLength, true);view.setUint16(10, bytesPerRecord, true);
    view.setInt8(32 + fieldDescLength - 1, 0x0D);
    field_meta.forEach(function(f, i) {
        f.name.split('').forEach(function(c, x) {
            view.setInt8(32 + i * 32 + x, c.charCodeAt(0));
        });
        view.setInt8(32 + i * 32 + 11, f.type.charCodeAt(0));
        view.setInt8(32 + i * 32 + 16, f.size);
        if (f.type == 'N') view.setInt8(32 + i * 32 + 17, 0);
    });
    offset = fieldDescLength + 32;
    data.forEach(function(row, num) {
        view.setUint8(offset, 32);
        offset++;
        field_meta.forEach(function(f) {
            var val = row[f.name];
            if (val === null || typeof val === 'undefined') val = '';
            switch (f.type) {
                case 'L':                // boolean
                    view.setUint8(offset, val ? 84 : 70);offset++;
                    break;
                case 'D':                // date
                    offset = writeField(view, 8,lpad(val.toString(), 8, ' '), offset);
                    break;
                case 'N':                // number
                    offset = writeField(view, f.size,lpad(val.toString(), f.size, ' ').substr(0, 18),offset);
                    break;
                case 'C':                // string
                    offset = writeField(view, f.size,rpad(val.toString(), f.size, ' '), offset);
                    break;
                default:
                    throw new Error('Unknown field type');
            }
        });
    });
    view.setUint8(offset, 0x1A);
    return view;
};

module.exports.toBuffer = function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
};

function lpad(str, len, char) {
    while (str.length < len) { str = char + str; } return str;
};

function rpad(str, len, char) {
    while (str.length < len) { str = str + char; } return str;
};

function writeField(view, fieldLength, str, offset) {
    for (var i = 0; i < fieldLength; i++) {
        view.setUint8(offset, str.charCodeAt(i)); offset++;
    }
    return offset;
};

var fieldSize = {C: 254,L: 1,D: 8,N: 18,M: 18,F: 18,B: 8},types = {string: 'C',number: 'N',boolean: 'L'};

function multi(features) {
    var fields = {};
    features.forEach(collect);
    function collect(f) { inherit(fields, f); }
    return obj(fields);
}

function inherit(a, b) {
    for (var i in b) { a[i] = b[i]; }
    return a;
}

function obj(list) {
    var fields = {}, o = [];
    for (var p in list) fields[p] = typeof list[p];
    for (var n in fields) {
        var t = types[fields[n]];
        o.push({name: n,type: t,size: fieldSize[t]});
    }
    return o;
}

function bytesPer(fields) {
    return fields.reduce(function(memo, f) { return memo + f.size; }, 1);
}