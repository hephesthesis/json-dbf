var dbf = require('../Generator/structure'),
    fs = require('fs');
var buf = dbf.structure([
    {AMC_CODE:'ABC',BROKE_CD:'ARN-99762',SBBR_CODE:1234,
        User_Code:'Testing',USR_TXN_NO:1234,Appl_No:'A1234',TRXN_DATE:'01/20/1993'
    },{
        AMC_CODE:'1234',BROKE_CD:'ARN-12348',SBBR_CODE:4321,
        User_Code:'code_1234',USR_TXN_NO:4321,Appl_No:'4321A',TRXN_DATE:'1992-20-01'
    }
]);

fs.writeFileSync('test.dbf', dbf.toBuffer(buf.buffer));
console.log('DBF File Generated');