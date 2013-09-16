var express = require('express');

var app = express();

var port = 3000;

app.use(express.static(__dirname + '/../client'));

app.listen(port, function() {
	console.log("Listening to http://localhost:" + port + "/");
});
