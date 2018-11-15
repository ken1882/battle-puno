// Run this script if need to test on local machine
// type in command: 
// node server.js

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
});

// URL should be:
// http://localhost:8080/index.html