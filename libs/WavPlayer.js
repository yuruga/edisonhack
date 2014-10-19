//require
var fs = require('fs');
var wav = require('wav');

//コンストラクタ
var WavPlayer = function(path){
	//インスタンスプロパティ
	this.filePath = path;
}
//クラスプロパティ
WavPlayer.sample_class_prop = "value";
//クラスメソッド
WavPlayer.sampleClassFunc = function(){
	
};
//インスタンスメソッド
WavPlayer.prototype = {
	play: function(){
		console.log(this.filePath);
		var file = fs.createReadStream(this.filePath);
		var reader = new wav.Reader();
		reader.on('format', function (format) {
			console.log(format);
			// the WAVE header is stripped from the output of the reader
			//reader.pipe(new Speaker(format));
		});
		file.pipe(reader);
	}
};

//export
module.exports = WavPlayer;
