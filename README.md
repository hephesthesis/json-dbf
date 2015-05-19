# json-dbf
Generates a dbf File from set of JSON Input.

# example
in node:

var dbf = require('../'),
    fs = require('fs');

var buf = dbf.structure([
    {TEST:'TEST_123',TEST_2:'TESTING 2',DATE:'31/3/15'}
]);

fs.writeFileSync('foo.dbf', toBuffer(buf.buffer));

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

