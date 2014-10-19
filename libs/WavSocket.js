//require
var app = require('http').createServer(function handler (req, res) {
	var path = "";
	var urlinfo = require('url').parse( req.url , true);
	if(urlinfo.pathname.match(/\/tmp\/[a-z0-9_]+\.wav$/)){
		path = urlinfo.pathname;
	}else if(urlinfo.pathname.match(/\.(html|js)$/)){
		path = __dirname + '/../www' + urlinfo.pathname;
	}else{
		path = __dirname + '/../www/index.html';
	}
	fs.readFile(
		path,
		function (err, data) {
			if (err) {
			  res.writeHead(500);
			  return res.end('Error loading file');
			}
			res.writeHead(200);
			res.end(data);
		}
	);
});
var io = require('socket.io')(app);
var fs = require('fs');

//コンストラクタ
var WavSocket = function(port){
	//インスタンスプロパティ
	this.socket = "value";
	
	app.listen(port);
	
	io.on('connection', function (socket) {
			this.socket = socket;
			socket.emit('news', { hello: 'world' });
			socket.on('my other event', function (data) {
			console.log(data);
		});
	});
}
//クラスプロパティ
WavSocket.sample_class_prop = "value";
//インスタンスメソッド
WavSocket.prototype = {
	emmitPlay: function(path){
		var obj = {
			path: path
		}
		io.emit("play", obj);
	}
};

//export
module.exports = WavSocket;

