/**
 * Config
 */
var Settings = {
	
}


/**
 * require
 */
var http = require('http');
var Voice = require("./libs/VoiceService.js");
var Player = require("./libs/WavPlayer.js");

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
				var v = new Voice();
				v.setText(urlinfo.query.w);
				v.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
					console.log(path);
					//TODO: Read
					var player = new Player(path);
					player.play();
				});
			}
			res.end('/Read\n');
			break;
		default:
			res.end('empty\n');
	}
}).listen(8080);