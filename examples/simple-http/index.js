// Module dependencies
var connect = require('connect')
  , http = require('http')
  , path = require('path')
  , proxy = require('../../lib/proxy');

// Application
var app = module.exports = connect();

if(module.parent) {
	app.use(connect.static(path.join(__dirname, 'public')));
} else {
	app.use(connect.logger('dev'));
	app.use(connect.static(path.join(__dirname, 'public')));

	app.listen(8080, function(err) {
		if(err) throw err;

		console.log('Started a simple http webserver');

		proxy.http.createServer(function(req, res) {
			res.writeHead(res.proxy.statusCode, res.proxy.headers);
			res.proxy.pipe(res);
		}).listen(8081, function(err) {
			if(err) throw err;

			console.log('Started a http proxy server');

			// Send the request through the http proxy server
			http.request({
				host: 'localhost',
				port: 8081,
				path: 'http://localhost:8080/'
			}, function(response) {
				var buffers = [];

				response.on('data', function(buffer) {
					buffers.push(buffer);
				});

				response.on('end', function() {
					console.log(Buffer.concat(buffers).toString());
				});
			}).end();
		});
	});
}