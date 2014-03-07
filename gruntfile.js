/*
 * compressor
 * http://github.com/donghanji/compressor/
 *
 * Copyright (c) 2013 donghanji, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        jshint:{
            all:[
                'Gruntfile.js',
                'tasks/*.js'
            ],
            options:{
                jshintrc:'.jshintrc'
            }
        },
        clean:{
            test:['tmp']
        },
        compressor:{
            css:{
				options:{
					banner: '/* My minified css file */'
				},
                files: {
                    'tmp/style.css': ['test/fixtures/input_one.css', 'test/fixtures/input_two.css']
                }
            },
            js:{
				options: {
                    mangle: true
                },
                files:grunt.file.expandMapping(['test/*.js','test/*/*.js','test/*/*/*.js'], '', {
                    rename: function(base,file) {
                        
                        return 'tmp/js'+'/'+file;
                    }
                })
            },
            html:{
                options:{
                    removeComments: true,
                    collapseWhitespace: true
                },
                files:{
                    'tmp/test1.html': ['test/test1.html']
                }
            }
        }
    });
    
    grunt.loadTasks('tasks');
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    
    grunt.registerTask('test',['clean']);
    
    grunt.registerTask('default',['jshint','test','compressor']);
};