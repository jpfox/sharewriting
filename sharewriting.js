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

var express = require('express')

var app = express();

/* external libraries */
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/jdenticon', express.static('node_modules/jdenticon/dist'));
app.use('/ckeditor', express.static('node_modules/ckeditor'));
app.use('/tweetnacl', express.static('node_modules/tweetnacl'));
app.use('/tweetnacl-util', express.static('node_modules/tweetnacl-util'));

/* static files */
app.use('/static', express.static('static'));

/* template engine */
