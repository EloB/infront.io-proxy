var events = require('events')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , proxy = require('../lib/proxy')
  , test = require('./test');

describe('proxy.http', function () {
	describe('.Server', function () {
		var proxyServer
		  , webServer;

		beforeEach(function(done) {
			proxyServer = new proxy.http.Server(function(req, res) {
				res.writeHead(res.proxy.statusCode, res.proxy.headers);
				res.proxy.pipe(res);
			});

			webServer = test.exampleWebserver(8180, done);
		});

		afterEach(function(done) {
			try {
				proxyServer.close(done);
			} catch(e) {
				done();
			}
		});

		afterEach(function(done) {
			try {
				webServer.close(done);
			} catch(e) {
				done();
			}
		});

		it('should be an instance of EventEmitter', function (done) {
			proxyServer.should.be.an.instanceof(events.EventEmitter);

			done();
		});

		it('should forward incoming request to it\'s destination', function(done) {
			proxyServer.listen(8181, function(err) {
				if(err) return done(err);

				test.exampleRequest(function(err, req, res, body) {
					if(err) return done(err);

					res.should.have.status(200);
					res.should.have.header('Content-Type', 'text/html; charset=UTF-8');

					body.should.eql(test.content);

					done();
				});
			});
		});

		it.skip('should be minimalistic and fast (benchmark)', function(done) {
			var requests = 500;

			proxyServer.listen(8181, function() {
				(function dummy() {
					if(requests-- <= 0) return done();

					test.exampleRequest(function(err, req, res, body) {
						if(err) return done(err);

						res.should.have.status(200);
						res.should.have.header('Content-Type', 'text/html; charset=UTF-8');

						body.should.eql(test.content);

						dummy();
					});
				})();
			});
		});

		it('should trigger a "request" when proxy makes an request', function(done) {
			proxyServer.on('request', function() {
				done();
			});

			proxyServer.listen(8181, function() {
				test.exampleRequest(function() {});
			});
		});

		describe('.listen()', function () {
			it('should be chainable', function(done) {
				proxyServer.listen(8181, test.noop).should.equal(proxyServer);

				done();
			});

			it('should start the proxy server and listen on the specified port', function (done) {
				proxyServer.listen(8181, done);
			});
		});

		describe('.close()', function () {
			it('should be chainable', function(done) {
				proxyServer.listen(8181, function() {
					proxyServer.close().should.equal(proxyServer);

					done();
				});
			});

			it('should stop listening to incoming request', function(done) {
				test.exampleRequest(function (err, req, res, body) {
					err.should.be.ok;

					proxyServer.listen(8181, function(err) {
						if(err) return done(err);

						test.exampleRequest(function(err, req, res, body) {
							res.should.have.status(200);

							proxyServer.close(function() {
								test.exampleRequest(function(err, req, res, body) {
									err.should.be.ok;

									done();
								});
							});
						});
					});
				});
			});
		});
	});

	describe('.createServer()', function () {
		it('should return a Server instance', function (done) {
			http.createServer().should.be.an.instanceOf(http.Server);

			done();
		});
	});
});