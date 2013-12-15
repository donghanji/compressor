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
