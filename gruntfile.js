module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['src/app/**/*.js']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
};