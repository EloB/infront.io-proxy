module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
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
					'lib/**/*.js',
					'test/**/*.js'
				],
				options: {
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

	grunt.registerTask('test', ['jshint:test', 'mochaTest']);
	grunt.registerTask('test:watch', ['test', 'watch:test']);
};