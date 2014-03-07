/*
 * compressor
 * http://github.com/donghanji/compressor/
 *
 * Copyright (c) 2013 donghanji, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var _to_directory='../mixed_compressor_file',//Your file name
        _js=['module.js','js/*.js','js/*/*.js'],//to compress js file
        _css=['css/*.css'],//to compress css file
        _html=['*.html','html/*.html','tpl/*.jsp'],//to compress html file
        _jsp={//to compress test1.html and rename it as test1.jsp,but test2.html is no do that
            'test1.html':'test1.jsp'
        },
        _copy=[//to copy file
            {expand:true,src:['assets/images/*'],dest:_to_directory+'/'},
            {expand:true,src:['css/images/*'],dest:_to_directory+'/'}
        ];
    
    var path=require('path');
    
    grunt.initConfig({
        compressor:{
            css:{
                files:[{
                    expand:true,
                    flaten:false,
                    src:_css,
                    dest:_to_directory
                }]
            },
            js:{
                files:grunt.file.expandMapping(_js, '', {
                    rename: function(base,file) {
                        
                        //return _to_directory+'/'+file.replace('.js', '.min.js');
                        return _to_directory+'/'+file;
                    }
                }),
                options: {
                    mangle: true
                }
            },
            html:{
                options:{
                    removeComments:true,
                    collapseWhitespace:true,
                    removeRedundantAttributes:false
                },
                /*files:[{
                    expand:true,
                    flaten:false,
                    src:['*.html','html/*.html'],
                    dest:_to_directory 
                }]*/
                files:grunt.file.expandMapping(_html, '', {
                    rename: function(base,file) {
                        var dir=path.dirname(file),
                            base=path.basename(file),
                            jsp=_jsp[base];
                        file=jsp ? dir+'/'+jsp : file; 
                        
                        return _to_directory+'/'+file;
                    }
                })
            }
        },
        copy:{
            main:{
                files:_copy
            }
        }
    });
    
    grunt.loadNpmTasks('mixed-compressor');
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.registerTask('default',['compressor','copy']);
};