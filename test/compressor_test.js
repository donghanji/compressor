/*
 * compressor
 * http://github.com/donghanji/compressor/
 *
 * Copyright (c) 2013 donghanji, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports=function(grunt){
    var helper=require('grunt-lib-contrib').init(grunt),
        path=require('path'),
        util=require('util'),
        uglify = require('./uglify').init(grunt),//my uglify,change from grunt-contrib-uglify
        minify=require('html-minifier').minify;
    
    var REGX={
        COMMENT:/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/img,
        EMPTY:/>\s+</,
        SCRIPT:/<(\w+).*type=[\"\']text\/(\S+)[\"\'](?:\s+[^>]*)?>([\s\S]*?)(?:<\/\1>[^\"\']|<\/\1>$)/ig
    },
    TAG={
        STYLE:'style',
        SCRIPT:'script'
    },
    TAG_TYPE={
        CSS:'css',
        JAVASCRIPT:'javascript',
        TEMPLATE:'x-template'
    },
    FILE_TYPE={
        JAVASCRIPT:/:js$/i,
        CSS:/:css$/i,
        HTML:/:html$/i
    };    
    
    grunt.registerMultiTask('compressor','Compress files and folders.',function(){
        var options=this.options({
            report:false
        }),
        nameArgs=this.nameArgs;
        if(FILE_TYPE.JAVASCRIPT.test(nameArgs)){//js
            
            return compress.uglify.call(this,this.files,options);
        }
        if(FILE_TYPE.CSS.test(nameArgs)){//css
            
            return compress.cssmin.call(this,this.files,options);
        }
        
        return compress.htmlmin.call(this,this.files,options);//html, mixed documents, include js, css, html, html template
    });
    
    var compress={
        css:function(source,options){//css
            try{
                return require('clean-css').process(source,options);
            }catch(e){
                grunt.log.error(e);
                grunt.fail.warn('css minification failed.');
            }
        },
        minify:function(source,f,options){//js
            
            return uglify.minify(source,f.dest,options);
        },
        html:function(source,f,options){//html
            source=source.replace(REGX.SCRIPT,function(m,name,n,t){
                
                if(arguments.length < 5){
                   
                   return '';
                }
                
                var v0=arguments[0],//match content,include tag and attribute
                    v1=arguments[1],//tag
                    v2=arguments[2],//tag type
                    v3=arguments[3],//content,to be dealt
                    v=v0.split(v3);
                v3=v3.trim();
                if(v3 === ''){
                    v0=v0.replace(REGX.EMPTY,'><');
                    
                    return v0;
                }
                v1=v1.toLowerCase();
                v2=v2.toLowerCase();
                if(v1 === TAG.STYLE && v2 === TAG_TYPE.CSS){//style
                    
                    return v[0]+compress.css(v3,options)+v[1];
                }else if(v1 === TAG.SCRIPT){//script
                    if(v2 === TAG_TYPE.JAVASCRIPT){//javascript
                        var result=compress.minify(v3,f,options);
                        
                        return v[0]+result.min+v[1];
                    }else if(v2 === TAG_TYPE.TEMPLATE){//template
                        
                        return v[0]+minify(v3,options)+v[1];
                    }        
                }
                
                return v0;
            });
            
            return minify(source,options);
        },
        cssmin:function(files,options){//css min to file
            if(!util.isArray(files)){
                
                return compress.css(files,options);
            }
            files.forEach(function(f){
                var valid=f.src.filter(function(filepath){
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)){
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        
                        return false;
                    }else{
                        
                        return true;
                    }
                });
                var max=valid
                    .map(grunt.file.read)
                    .join(grunt.util.normalizelf(grunt.util.linefeed));
                var min=valid.map(function(f){
                    options.relativeTo = path.dirname(f);
                    
                    return compress.css(grunt.file.read(f),options);
                })
                .join('');

                if(min.length < 1){
                    grunt.log.warn('Destination not written because minified CSS was empty.');
                }else{
                    if(options.banner){
                        min = options.banner + grunt.util.linefeed + min;
                    }
                    grunt.file.write(f.dest, min);
                    grunt.log.writeln('File ' + f.dest + ' created.');
                    if(options.report){
                        helper.minMaxInfo(min, max, options.report);
                    }
                }
            });
        },
        htmlmin:function(files,options){//html to file
            options=this.options({
                banner: '',
                footer: '',
                compress: {
                    warnings: false
                },
                mangle: {},
                beautify: false,
                report: false
            });
            grunt.verbose.writeflags(options, 'Options');
            if(!util.isArray(files)){
                
                return compress.html(files,'',options);
            }
            files.forEach(function(file){
                var min;
                var max=file.src.filter(function(filepath){
                    // Warn on and remove invalid source files (if nonull was set).
                    if(!grunt.file.exists(filepath)){
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        
                        return false;
                    }else{
                        
                        return true;
                    }
                })
                .map(grunt.file.read)
                .join(grunt.util.normalizelf(grunt.util.linefeed));
                
                try{
                    min =compress.html(max,file,options);
                }catch(err){
                    grunt.warn(file.src + '\n' + err);
                }
                if(min.length < 1){
                    grunt.log.warn('Destination not written because minified HTML was empty.');
                }else{
                    grunt.file.write(file.dest,min);
                    grunt.log.writeln('File ' + file.dest + ' created.');
                    helper.minMaxInfo(min,max);
                }
            });
        },
        uglify:function(files,options){
            options=this.options({
                banner: '',
                footer: '',
                compress: {
                    warnings: false
                },
                mangle: {},
                beautify: false,
                report: false
            });
            // Process banner.
            var banner = grunt.template.process(options.banner);
            var footer = grunt.template.process(options.footer);
            var mapNameGenerator, mappingURLGenerator;
            if(!util.isArray(files)){
                
                return compress.minify(files,'',options);
            }
            if (options.sourceMap && banner) {
                grunt.log.warn(
                    "Grunt-contrib-uglify does not support adding a banner alongside sourcemaps. Add the banner to " +
                    "your unminified source and then uglify."
                );
            }
            
            files.forEach(function(f) {
                var src=f.src.filter(function(filepath){
                    // Warn on and remove invalid source files (if nonull was set).
                    if(!grunt.file.exists(filepath)){
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        
                        return false;
                    }else{
                        
                        return true;
                    }
                });

                if(src.length === 0){
                    grunt.log.warn('Destination (' + f.dest + ') not written because src files were empty.');
                    return;
                }

                // function to get the name of the sourceMap
                if(typeof options.sourceMap === "function"){
                    mapNameGenerator = options.sourceMap;
                }

                // function to get the sourceMappingURL
                if(typeof options.sourceMappingURL === "function"){
                    mappingURLGenerator = options.sourceMappingURL;
                }

                if(mapNameGenerator){
                    try{
                        options.sourceMap = mapNameGenerator(f.dest);
                    }catch(e){
                        var err = new Error('SourceMapName failed.');
                        err.origError = e;
                        grunt.fail.warn(err);
                    }
                }

                if(mappingURLGenerator){
                    try{
                        options.sourceMappingURL = mappingURLGenerator(f.dest);
                    }catch(e){
                        var err = new Error('SourceMappingURL failed.');
                        err.origError = e;
                        grunt.fail.warn(err);
                    }
                }

                // Minify files, warn and fail on error.
                var result;
                try{
                    result = compress.minify(src,f,options);
                }catch(e){
                    var err = new Error('Uglification failed.');
                    if (e.message) {
                        err.message += '\n' + e.message + '. \n';
                        if (e.line) {
                            err.message += 'Line ' + e.line + ' in ' + src + '\n';
                        }
                    }
                    err.origError = e;
                    grunt.log.warn('Uglifying source "' + src + '" failed.');
                    grunt.fail.warn(err);
                }

                // Concat banner + minified source.
                var output = banner + result.min + footer;

                // Write the destination file.
                grunt.file.write(f.dest, output);

                // Write source map
                if(options.sourceMap){
                    grunt.file.write(options.sourceMap, result.sourceMap);
                    grunt.log.writeln('Source Map "' + options.sourceMap + '" created.');
                }

                // Print a success message.
                grunt.log.writeln('File "' + f.dest + '" created.');

                // ...and report some size information.
                if(options.report){
                    helper.minMaxInfo(output, result.max, options.report);
                }
            });
        }
    };
};