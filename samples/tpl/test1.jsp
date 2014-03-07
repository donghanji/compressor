<html>
    <head>
        <title>Test</title>
        <style type="text/css" rel="stylesheet">
            html,body{margin:0;padding:0;width:100%;height:100%;}
            .red{color:red;}
            .green{color:green;}
        </style>
    </head>
        <body>
            <div>1</div>
            <div>2</div>
            <script type="text/javascript">
                (function(){
                    //
                    var text='1\n';
                    
                    console.log(text);
                })();
            </script>
            <script type="text/javascript">
                (function(){
                    //
                    var mytest='2\n';
                    
                    console.log(mytest);
                })();
            </script>
            <div>3</div>
            <script id="t2" type="text/x-template" data-vid="T">
                <div>4</div>
                <div>5</div>
            </script>
        </body>
        <script type="text/javascript" src="/module.js"></script>
</html>