var express = require('express');
var fs = require('fs');

var app = express();

var port = 3000;
var rootDir = __dirname + '/../testfiles';

app.use(express.static(__dirname + '/../client'));
app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());

app.get('/files', function(req, res) {
	fs.readdir(rootDir, function(err, files) {
		if (err) {
			throw err;
		}
		result = files.map(function(filename) {
			return { name: filename, length: 123 };
		});
		res.end(JSON.stringify(result));
	});
});

app.post('/files', function(req, res) {
	console.log("POST, body", req.body);
});

app.listen(port, function() {
	console.log("Listening to http://localhost:" + port + "/");
});
