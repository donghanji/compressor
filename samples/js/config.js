﻿(function(){
    module.config({
        'base':'/js/',
        'require':true,
        //'nocache':true,
        'dirs':{},
        'alias':{
            'jquery':'{libs}/jquery-2.0.0.js',//jquery-2.0.0.js/jquery-2.0.0.min.js
            'jquery.module':'{modules}/jquery.module'
        },
        'files':[],
        'globals':{
            '$':'jquery.module'
        }
    });
})();