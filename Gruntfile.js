module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-release');

	grunt.initConfig({
		release: {
			options: {}
		},
		mochaTest: {
			test: {
				src: [
					'test/**/*.js'
				],
				options: {
					reporter: 'spec',
					require: 'should'
				}
			}
		},
		jshint: {
			test: {
				src: [
					'lib/**/*.js'
				],
				options: {
					laxcomma: true,
					globals: {
						describe: true,
						it: true,
						should: true
					}
				}
			}
		},
		watch: {
			test: {
				files: [
					'lib/**/*.js',
					'test/**/*.js'
				],
				tasks: ['test']
			}
		}
	});

	grunt.registerTask('test', ['mochaTest:test']);
	grunt.registerTask('test:watch', ['test', 'watch:test']);
};