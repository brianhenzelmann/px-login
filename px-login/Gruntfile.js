'use strict';


module.exports = function (grunt) {

    var importOnce = require('node-sass-import-once');
    // Project configuration.
    grunt.initConfig({

        clean: {
            css: ['css'],
            bower: ['bower_components'],
            reports: ['reports']
        },

        sass: {
            options: {
                sourceMap: false, //no source maps b/c web-components inline css anyway...
                importer: importOnce,
                importOnce: {
                  index: true,
                  bower: true
                }
            },
            dist: {
                files: {
                    'css/noprefix/px-login-sketch.css': 'sass/px-login-sketch.scss',
                    'css/noprefix/px-login.css': 'sass/px-login-predix.scss'
                }
            }
        },

        autoprefixer: {
          options: {
            browsers: ['last 2 version']
          },
          multiple_files: {
            expand: true,
            flatten: true,
            src: 'css/noprefix/*.css',
            dest: 'css'
          }
        },

        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            bower: {
                command: 'bower install'
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'js/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    interrupt: true
                }
            }
        },

        depserve: {
            options: {
                open: '<%= depserveOpenUrl %>'
            }
        },

        webdriver: {
            options: {
                specFiles: ['test/*spec.js']
            },
            local: {
                webdrivers: ['chrome']
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dep-serve');
    grunt.loadNpmTasks('webdriver-support');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // Default task.
    grunt.registerTask('default', 'Basic build', [
        'sass',
        'autoprefixer'
    ]);

    // First run task.
    grunt.registerTask('firstrun', 'Basic first run', function() {
        grunt.config.set('depserveOpenUrl', '/index.html');
        grunt.task.run('default');
        grunt.task.run('depserve');
    });

    // Default task.
    grunt.registerTask('test', 'Test', [
        'jshint',
        'webdriver'
    ]);

    grunt.registerTask('release', 'Release', [
        'clean',
        'shell:bower',
        'default',
        'test'
    ]);

};
