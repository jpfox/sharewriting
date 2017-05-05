/***************************************************
 * 
 * ShareWriting
 * 
 * https://sharewriting.net/
 * 
 * under License GNU/AFFERO GPL v3
 * 
 * Author : jpfox
 * 
 ***************************************************/

/**
 * To change port : npm config set sharewriting:port 3000
 * default is 4984
 */
var port = process.env.npm_package_config_port || 4984;

var express = require('express');

var app = express();

/* external libraries */
app.use('/sharewriting/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/sharewriting/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/sharewriting/jdenticon', express.static(__dirname + '/node_modules/jdenticon/dist'));
app.use('/sharewriting/markdown', express.static(__dirname + '/node_modules/markdown/lib'));
app.use('/sharewriting/tweetnacl', express.static(__dirname + '/node_modules/tweetnacl'));
app.use('/sharewriting/tweetnacl-util', express.static(__dirname + '/node_modules/tweetnacl-util'));

/* static files */
app.use('/sharewriting', express.static(__dirname + '/static'));

/* template engine */


/* listening */
app.listen(port, function () {
  console.log('sharewriting app listening on port ' + port);
});
