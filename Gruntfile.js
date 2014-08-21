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
		  },
  		all: [
          'Gruntfile.js',
  		    'app/js/app.js'
  		]
    },

    cssmin: {
        add_banner: {
            options: {
              banner: '/* Modified: <%= grunt.template.today("yyyy-mm-dd, hh:MM:ss") %> */\n'
            },
            files: {
              'app/css/style.min.css': ['app/css/style.css']
            }
        }
    },
    
    'http-server': {
        'dev': {
            root: 'app',
            port: 4343,
            host: '10.96.66.252',
            showDir : true,
            autoIndex: true,
            defaultExt: 'html',
            runInBackground: false
        }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-http-server'); 

  grunt.registerTask('default', ['uglify', 'cssmin']);

};