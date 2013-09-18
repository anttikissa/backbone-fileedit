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

app.put('/files/:id', function(req, res) {
	fs.writeFile(path.join(rootDir, req.params.id),
		req.body.content, function(err, result) {
			if (err) {
				res.status(403);
				console.log("Error was", err);
				res.end(err.message);
			} else {
				res.end(JSON.stringify({ result: 'ok' }));
			}
		});
});

app.get('/files/:id', function(req, res) {
	var filename = req.params.id;
	fs.readFile(path.join(rootDir, filename), 'utf8', function(err, result) {
		console.log("Returning " + typeof result + ": " + result);
		if (err) {
			res.status(404);
			res.end(err.message);
		} else {
			res.end(JSON.stringify({ name: filename, content: result }));
		}
	});
});

app.listen(port, function() {
	console.log("Listening to http://localhost:" + port + "/");
});
