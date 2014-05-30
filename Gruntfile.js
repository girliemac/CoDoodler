module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
	  	options: {
			banner: '/* Modified: <%= grunt.template.today("yyyy-mm-dd, hh:MM:ss") %> */\n'
		},
		build: {
	        src: 'app/js/*.js',
	        dest: 'app/js/script.min.js'
	    }
    },
    
    jshint: {
    	options: {
        	jshintrc: '.jshintrc'
		},
		all: [
        	'Gruntfile.js',
		      'app/js/*.js',
	        '!app/js/scripts.min.js'
		]
    },
    
    'http-server': {
        'dev': {
            root: 'app',
            port: 4343,
            host: '127.0.0.1',
            showDir : true,
            autoIndex: true,
            defaultExt: 'html',
            runInBackground: false
        }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-http-server'); 

  grunt.registerTask('default', ['uglify', 'jshint']);

};