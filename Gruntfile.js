'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'assets/js/*.js',
        '!assets/js/plugins/*.js',
        '!static/assets/js/scripts.min.js'
      ]
    },
    recess: {
      dist: {
        options: {
          compile: true,
          compress: true
        },
        files: {
          'static/assets/css/main.min.css': [
            'assets/less/main.less'
          ],
          'static/assets/css/ie.min.css': [
            'assets/less/ie.less'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'static/assets/js/scripts.min.js': [
            'assets/js/plugins/*.js',
            'assets/js/_*.js'
          ],
          'static/assets/js/vendor/modernizr-2.6.2.custom.min.js': [
            'assets/js/vendor/modernizr-2.6.2.custom.min.js'
          ],
          'static/assets/js/vendor/jquery-1.9.1.min.js': [
            'assets/js/vendor/jquery-1.9.1.min.js'
          ]
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'static/images/',
          src: ['**/*.{png,jpg,jpeg,gif}'],
          dest: 'static/images/'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'static/images/',
          src: '{,*/}*.svg',
          dest: 'static/images/'
        }]
      }
    },
    watch: {
      less: {
        files: [
          'static/assets/less/*.less',
          'static/assets/less/bootstrap/*.less'
        ],
        tasks: ['recess']
      },
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['jshint','uglify']
      }
    },
    clean: {
      dist: [
        'static/assets/css/main.min.css',
        'static/assets/css/ie.min.css',
        'static/assets/js/scripts.min.js',
        'static/assets/js/vendor/modernizr-2.6.2.custom.min.js'
        'static/assets/js/vendor/jquery-1.9.1.min.js'
      ]
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-svgmin');

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'recess',
    'uglify',
    'imagemin',
    'svgmin'
  ]);
  grunt.registerTask('dev', [
    'watch'
  ]);

};
