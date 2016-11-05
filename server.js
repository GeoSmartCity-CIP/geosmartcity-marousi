var express = require('express');
var app     = express();


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://hub.geosmartcity.eu');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(express.static(__dirname ));
app.use(allowCrossDomain);
app.get('/', function(req, res) {
	res.sendfile('index.html');
});

app.listen(3000);