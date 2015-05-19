# json-dbf
Generates a dbf File from set of JSON Input.

# example
in node:

var dbf = require('../'),
    fs = require('fs');
 
var buf = dbf.structure([
    {foo:'bar',noo:10},
    {foo:'louie'}
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
