describe('proxy', function () {
	var proxy = require('../lib/proxy');

	it('should contain http and https proxy protocols', function (done) {
		proxy.should.have.property('http', require('../lib/http'));
		proxy.should.have.property('https', require('../lib/https'));

		done();
	});
});