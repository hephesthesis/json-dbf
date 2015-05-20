# json-dbf
Generates a dbf File from set of JSON Input.

# example
in node:
```js

var dbf = require('../Generator/structure'),
    fs = require('fs');
 buf = dbf.structure([
    {TEST:'TEST_123',TEST_2:'TESTING 2',DATE:'31/3/15'}
]);

fs.writeFileSync('test.dbf', dbf.toBuffer(buf.buffer));
