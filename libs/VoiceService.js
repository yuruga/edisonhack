//requre
var request = require('request');
var qs = require('querystring');
var fs = require('fs');
//コンストラクタ
var VoiceService = function(text){
	//インスタンスプロパティ
	this.text = "こんにちは";
	if(text){
		this.setText(text);
	}
	this.speaker = VoiceService.speaker.SHOW;
	this.emotion = VoiceService.emotion.HAPPINESS;
	this.emotionLevel = VoiceService.emotionLevel.LEVEL1;
	this.pitch = 100;
	this.speed = 100;
	this.volume = 100;
}
//クラスプロパティ
//エンドポイント
VoiceService.ENDPOINT = "https://api.voicetext.jp/v1/tts";
//APIキー
VoiceService.API_KEY = "gkhxl7gx56mnjyhl";
//話者名
VoiceService.speaker = {
	SHOW: "show",
	HARUKA: "haruka",
	HIKARI: "hikari",
	TAKERU: "takeru",
	SANTA: "santa",
	BEAR: "bear"
};
//感情カテゴリ
VoiceService.emotion = {
	HAPPINESS: "happiness",
	ANGER: "anger",
	SADNESS: "sadness"
};
//感情レベル
VoiceService.emotionLevel = {
	LEVEL1: 1,
	LEVEL2: 2
};
//インスタンスメソッド
VoiceService.prototype = {
	//テキスト設定
	setText: function(text){
		if(0 < text.length && text.length <= 200){
			this.text = text;
		}
	},
	//Speaker設定
	setSpeaker: function(val){
		if(this._inValue(val, VoiceService.speaker)){
			this.speaker = val;
		}
	},
	//Emotion設定
	setEmotion: function(val){
		if(this._inValue(val, VoiceService.emotion)){
			this.emotion = val;
		}
	},
	//EmotionLevel設定
	setEmotionLevel: function(val){
		if(this._inValue(val, VoiceService.emotionLevel)){
			this.emotionLevel = val;
		}
	},
	//Pitch設定
	setPitch: function(val){
		this.pitch = Math.max(Math.min(val, 200), 50);
	},
	//Speed設定
	setSpeed: function(val){
		this.speed = Math.max(Math.min(val, 400), 50);
	},
	//Volume設定
	setVolume: function(val){
		this.volume = Math.max(Math.min(val, 200), 50);
	},
	_inValue: function(val, obj){
		for(var i in obje){
			if(obj[i] === val){
				return true;
			}
		}
		return false;
	},
	//データ取得
	getAndWriteData: function(path, callBack){
		var params = {
			text: this.text,
			speaker: this.speaker,
			pitch: this.pitch,
			speed: this.speed,
			volume: this.volume
		};
		if(this.speaker !== VoiceService.speaker.SHOW){
			params.emotion = this.emotion;
			params.emotion_level = this.emotionLevel;
		}
		var options = {
			url: VoiceService.ENDPOINT,
			method: 'POST',
			auth: {
				user: VoiceService.API_KEY,
				pass: ''
			},
			form: params
		};
		request(options)
			.on('error', function(e){
				console.log(e);
			})
			.pipe(fs.createWriteStream(path))
			.on('error', function(e){
				console.log(e);
			})
			.on('close', function(){
				if(callBack){
					callBack(path);
				}
			});
	}
};

//export
module.exports = VoiceService;
