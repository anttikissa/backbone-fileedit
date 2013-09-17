var express = require('express');
var fs = require('fs');
var path = require('path');
var async = require('async');

var app = express();

var port = 3000;
var rootDir = path.join(__dirname, '../testfiles');

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());

function statFile(rootDir) {
	return function(filename, cb) {
		fs.stat(path.join(rootDir, filename), cb);
	}
}

function readFile(rootDir) {
	return function(filename, cb) {
		return fs.readFile(path.join(rootDir, filename), 'utf8', cb);
	}
}

app.get('/files', function(req, res) {
	fs.readdir(rootDir, function(err, filenames) {
		if (err) throw err;

		async.map(filenames, statFile(rootDir), function(err, stats) {
			if (err) throw err;

			async.map(filenames, readFile(rootDir), function(err, fileContents) {
				if (err) throw err;

				result = filenames.map(function(filename, idx) {
					var stat = stats[idx];
					var content = fileContents[idx];
					console.log("File content for " + filename + ": " + content);
					return { name: filename, length: stat.size, content: content };
				});
				res.end(JSON.stringify(result));
			});
		});
	});
});

app.post('/files', function(req, res) {
	console.log("POST, body", req.body);
});

app.listen(port, function() {
	console.log("Listening to http://localhost:" + port + "/");
});
