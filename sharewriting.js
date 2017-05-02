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
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jdenticon', express.static(__dirname + '/node_modules/jdenticon/dist'));
app.use('/ckeditor', express.static(__dirname + '/node_modules/ckeditor'));
app.use('/tweetnacl', express.static(__dirname + '/node_modules/tweetnacl'));
app.use('/tweetnacl-util', express.static(__dirname + '/node_modules/tweetnacl-util'));
app.use('/ckeditor-extra-plugins', express.static(__dirname + '/ckeditor-extra-plugins'));

/* static files */
app.use('/static', express.static(__dirname + '/static'));

/* template engine */


/* listening */
app.listen(port, function () {
  console.log('sharewriting app listening on port ' + port);
});
