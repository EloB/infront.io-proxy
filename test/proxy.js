describe('proxy', function () {
	var proxy = require('../lib/proxy');

	it('should contain http proxy protocols', function (done) {
		proxy.should.have.property('http', require('../lib/http'));

		done();
	});
});