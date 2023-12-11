// execute bin/po2json on tests/test.po
// and compare the result with tests/test.json
var exec = require("child_process").exec;

exec('node ' + __dirname + '/../bin/po2json ' + __dirname + '/test.po ' + __dirname + '/test.json', function (error, stdout, stderr) {
    var fs = require('fs');
    var dumped = JSON.parse(fs.readFileSync(__dirname + '/test.json', 'utf8'));

    // validate that the dumped json is correct
    if (dumped[''] && dumped['']['plural-forms'] && dumped['foo'] && !dumped['%1 foo']) {
        console.log('dumped json is correct!');
    } else {
        console.log('dumped json is incorrect :(');
    }
});


exec('node ' + __dirname + '/../bin/po2json ' + __dirname + '/another.po ' + __dirname + '/another.json', function (error, stdout, stderr) {
    var fs = require('fs');
    var dumped = JSON.parse(fs.readFileSync(__dirname + '/another.json', 'utf8'));

    // validate that the dumped json is correct
    if (dumped[''] && dumped['']['plural-forms'] && dumped['foo'] && !dumped['%1 foo']) {
        console.log('dumped json is correct!');
    } else {
        console.log('dumped json is incorrect :(');
    }
});