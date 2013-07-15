module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');	

	grunt.initConfig({
		mochaTest: {
			test: {
				src: ['test/**/*.js'],
				options: {
					reporter: 'spec',
					require: 'should'
				}
			}
		}
	});

	grunt.registerTask('test', 'mochaTest');
};