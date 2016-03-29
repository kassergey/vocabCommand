#!/usr/bin/env node
var http = require("http");
var querystring = require('querystring');

var outputFunc = function(data)
{
	console.log(data);
	process.exit();
}

var getJSON = function(options, onResult, appendixData)
{
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });
        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

	if(options.method == 'POST')
	{
		req.write(String(appendixData));
	}
    req.on('error', function(err) {
        outputFunc(err);
    });
    req.end();
};

if(process.argv.length == 2)
{
    console.log("Use --add word translation, if you want add new entry.\n" + 
                "Write simply word after this command for translation.\n" +
			   "Use --all to show all words.");
}
else if(process.argv[2] == '--add')
{
	var options = {
    	host: 'localhost',
    	port: 3000,
    	path: '/vocab',
    	method: 'POST',
    	headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
    	}
	}
	getJSON(options,
        function(statusCode, result)
        {
            if(statusCode != 200)
			{
				outputFunc("There is some problem with sever or internet connection.");
			}
			else
			{
				outputFunc(result);
			}
        },
		querystring.stringify({wordOrigin: process.argv[3], wordTranslation: process.argv[4]}));
}
else if(process.argv[2] == '--all')
{
	var options = {
    	host: 'localhost',
    	port: 3000,
    	path: '/vocab',
    	method: 'GET',
    	headers: {
    	    'Content-Type': 'application/json'
    	}
	}
	getJSON(options,
        function(statusCode, result)
        {
			outputFunc(result);
        });	
}
else{
	var options = {
    	host: 'localhost',
    	port: 3000,
    	path: '/vocab/' + process.argv[2],
    	method: 'GET',
    	headers: {
    	    'Content-Type': 'application/json'
    	}
	}
	getJSON(options,
        function(statusCode, result)
        {
			outputFunc(result);
        });	
}
