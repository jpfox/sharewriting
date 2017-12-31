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

var ISO6391	= require('iso-639-1');
var express	= require('express');
var fs		= require('fs');
var dust	= require('dustjs-linkedin');
var db		= require('any-db');

/***
 * 
 *  copy config.json.sample to config.json to change settings
 * 
 */
var config;
try {
	config = require( __dirname + "/config.json");
} catch(ex) {
	console.log(ex.message);
	console.log("Copy config.json.sample to config.json and adapt it");
}

if(config.port*1<=0) {
	console.log("Port config value '" + config.port + "' is not a correct value !");
	return;
}

if(config.subfolder.slice(0,1)!='/' || config.subfolder.slice(-1)!='/') {
	console.log("Subfolder config value '" + config.subfolder + "' is not a correct value !");
	return;
}

var langLabels = ISO6391.getLanguages(config.languages.split(' '));

/***
 * 
 * Routing http requests
 * 
 */

var app = express();

// external libraries
app.use(config.subfolder + 'jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use(config.subfolder + 'bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(config.subfolder + 'jdenticon', express.static(__dirname + '/node_modules/jdenticon/dist'));
app.use(config.subfolder + 'markdown', express.static(__dirname + '/node_modules/markdown/lib'));
app.use(config.subfolder + 'tweetnacl', express.static(__dirname + '/node_modules/tweetnacl'));
app.use(config.subfolder + 'tweetnacl-util', express.static(__dirname + '/node_modules/tweetnacl-util'));

// static files
app.use(config.subfolder, express.static(__dirname + '/static'));

// load dust templates
fs.readdir(__dirname + '/views/', function(err, files) {
	for(var i=0; i<files.length; i++) {
		var src = fs.readFileSync(__dirname + '/views/' + files[0], 'utf8');
		var filenamechunk = files[0].split('.');
		var compiled = dust.compile(src, filenamechunk[0]);
		dust.loadSource(compiled);
	}
});


// / (edit by default)
app.get(config.subfolder, function (req, res) {
	// Edition
	dust.render('edit', {
			langLabels: langLabels,
			default_lang: config.default_lang
		 }, function(err, out) {
		res.send(out);
	});
});

app.post(config.subfolder + 'publish', function (req, res) {
	res.send('{result:"ok"}');
});

// listening
app.listen(config.port, function () {
  console.log('sharewriting app available on http://localhost:' + config.port + config.subfolder);
});

