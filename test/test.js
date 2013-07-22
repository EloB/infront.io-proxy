var fs = require('fs')
  , path = require('path')
  , http = require('http')
  , example = require('../examples/simple-http');

exports.content = fs.readFileSync(path.join(__dirname, '../examples/simple-http/public/index.html'), 'utf8');

exports.request = function(options, callback) {
	var request;

	request = http.request(options, function(response) {
		var buffers = [];

		response.on('error', callback);

		response.on('data', function(buffer) {
			buffers.push(buffer);
		});

		response.on('end', function() {
			try {
				var body = Buffer.concat(buffers).toString();

				callback(null, request, response, body);
			} catch(e) {
				callback(e);
			}
		});
	});

	request.on('error', callback);

	return request;
};

exports.exampleRequest = function(callback) {
	return exports.request(exports.requestConfig, callback).end();
};

exports.exampleWebserver = function(port, callback) {
	return example.listen.apply(example, arguments);
};

exports.requestConfig = {
	host: 'localhost',
	port: 8181,
	path: 'http://localhost:8180/'
};

exports.noop = function() {};