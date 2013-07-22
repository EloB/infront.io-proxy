// Module dependencies
var events = require('events')
  , domain = require('domain')
  , util = require('util')
  , http = require('http')
  , url = require('url');

// Server
function Server(proxyRequestListener) {
	var scope;

	if(!(this instanceof Server)) return new Server(proxyRequestListener);

	if(proxyRequestListener) {
		this.on('request', proxyRequestListener);
	}

	scope = this;

	this.protocol = http.createServer(function(request, response) {
		var d = domain.create()
		  , proxyRequest
		  , config;

		d.on('error', function(err) {
			console.log(request.method, request.url);
			console.log(err.message);
			console.log(err.stack);

			if(proxyRequest) {
				proxyRequest.abort();
			}

			if(response.headersSent === false) {
				response.writeHead(503);
			}

			response.end();
		});

		d.add(request);
		d.add(response);

		config = url.parse(request.url);
		
		config.method = request.method;
		config.headers = request.headers;

		proxyRequest = http.request(config, d.bind(function(proxyResponse) {
			d.add(proxyResponse);

			request.proxy = proxyRequest;
			response.proxy = proxyResponse;

			scope.emit('request', request, response);
		}));

		d.add(proxyRequest);

		request.pipe(proxyRequest);
	});
}

util.inherits(Server, events.EventEmitter);

Server.prototype.listen = function() {
	this.protocol.listen.apply(this.protocol, arguments);

	return this;
};

Server.prototype.close = function() {
	this.protocol.close.apply(this.protocol, arguments);

	return this;
};

// Exports
exports.Server = Server;

exports.createServer = function(proxyRequestListener) {
	return new Server(proxyRequestListener);
};