/**
 * Config
 */
var Settings = {
	
}


/**
 * require
 */
var http = require('http');
var voice = require("./libs/VoiceService.js");

/**
 * main
 */


/**
 * 簡易WebAPI
 */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
	var urlinfo = require('url').parse( req.url , true );
	switch(urlinfo.pathname){
		case '/read':
			if("w" in urlinfo.query){
				var v = new voice();
				v.setText(urlinfo.query.w);
				v.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
					console.log(path);
					//TODO: Read
				});
			}
			res.end('/Read\n');
			break;
		default:
			res.end('empty\n');
	}
}).listen(8080);