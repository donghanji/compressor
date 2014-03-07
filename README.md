##### Compress file, including CSS, JS and HTML
##### Can also to compress a mixed files, which is including HTML, CSS and JS,like this,
	<html>
		<head>
			<title>Test</title>
			<style type="text/css" rel="stylesheet"><!--css-->
				html,body{margin:0;padding:0;width:100%;height:100%;}
				.red{color:red;}
				.green{color:green;}
			</style>
		</head>
			<body>
				<div>1</div>
				<div>2</div>
				<script type="text/javascript"><!--js-->
					(function(){
						//
						var text='1\n';
						
						console.log(text);
					})();
				</script>
				<script type="text/javascript"><!--js-->
					(function(){
						//
						var mytest='2\n';
						
						console.log(mytest);
					})();
				</script>
				<div>3</div>
				<script id="t2" type="text/x-template" data-vid="T"><!--html template-->
					<div>4</div>
					<div>5</div>
				</script>
			</body>
			<script type="text/javascript" src="/module.js"></script>
	</html>

	compressor:{
		css:{
			//compress css file, like cssmin, to https://github.com/gruntjs/grunt-contrib-cssmin
		},
		js:{
			//compress js file, like uglify, to https://github.com/gruntjs/grunt-contrib-uglify
		},
		html:{
			//compress html file, like htmlmin, to https://github.com/gruntjs/grunt-contrib-htmlmin
		}
	}

## Getting Started
This plugin requires Grunt ~0.4.1
If you haven't used <a href="http://gruntjs.com/">Grunt</a> before, be sure to check out the <a href="http://gruntjs.com/getting-started">Getting Started</a> guide, as it explains how to create a <a href="http://gruntjs.com/sample-gruntfile">Gruntfile</a> as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

    npm install mixed-compressor
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:
    grunt.loadNpmTasks('mixed-compressor');
##### Sample
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
	
#### Also you can learn it from samples file,it is a complete example contains the package.json and the gruntfile.js(take a good look at this file).
First:
    npm install
Second:
	grunt
