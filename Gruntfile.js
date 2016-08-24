'use strict';

/* jshint node: true */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
        '<%= pkg.author.name %>; Licensed ' +
        ' <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                nonull: true,
                src: [
                    'src/<%= pkg.name %>.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            mrc: {
                nonull: true,
                src: [
                    'src/<%= pkg.name %>.js',
                    'src/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                preserveComments: false,
                mangle: {
                    except: ['jQuery']
                }
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: ['Gruntfile.js'],

        },
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    'node_modules/openlayers/css/ol.css',
                    'node_modules/bootstrap/dist/css/bootstrap.css',
                    'node_modules/bootstrap/dist/css/bootstrap-theme.css',
                    'css/*.css'
                ],
                dest: "dist/mrc.css"
            },
            mrc: {
                src: [
                    'css/*.css'
                ],
                dest: "dist/mrc.css"
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ['dist/mrc.css'],
                    dest: '',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:src', 'nodeunit']
            },
            css: {
                files: ['dist/mrc.css'],
                tasks: ['cssmin']
            },
            js: {
                files: ['src/*.js'],
                tasks: ['jshint', 'concat:mrc', 'uglify']
            }

        },
        express: {
            options: {
                // Override defaults here 
            },
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['express', 'watch']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-concurrent');

    // Default task.
    grunt.registerTask('default',
        ['jshint', 'build-js', 'build-css',  'concurrent']);

    grunt.registerTask('build-js', ['concat', 'uglify']);
    grunt.registerTask('build-css', ['concat_css', 'cssmin']);

    // Default task - only mrc custom code.
    grunt.registerTask('default-mrc', ['jshint', 'build-js-mrc', 'build-css-mrc']);
    grunt.registerTask('build-js-mrc', ['concat:mrc', 'uglify']);
    grunt.registerTask('build-css-mrc', ['concat_css:mrc', 'cssmin']);
};