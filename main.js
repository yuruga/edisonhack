/**
 * Config
 */
var Settings = {
	
}


/**
 * require
 */
var http = require('http');
var mraa = require('mraa');
var Voice = require("./libs/VoiceService.js");
var Player = require("./libs/WavPlayer.js");
var CarService = require('./libs/CarService');
var WavSocket = require('./libs/WavSocket.js');

/**
 * WavSocket
 */
var ws = new WavSocket(8100);


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
					/*var player = new Player(path);
					player.play();*/
				});
			}
			res.end('/Read\n');
			break;
		default:
			res.end('empty\n');
	}
}).listen(8080);




var pin6 = new mraa.Gpio(6);
var car = new CarService(80);

var led = new mraa.Gpio(8);
var led_val = 0;
var led_bool = false;
led.dir(mraa.DIR_OUT);
led.write(led_val);


//pinモード設定
pin6.dir(mraa.DIR_IN);
//送信フラグ
var is_press = false;
var n = 0;
//入力監視
function loop() {
	if(led_bool){
		led_val ^= 1;
		led.write(led_val);
	}else{
		led.write(0);
	}
	
	
 if(pin6.read()){
      if(!is_press){
          console.log("hhhhh");
          n++;
          //car.setCarId(n);
          m = car.getCarData();
      }
      is_press = true;
      
 }else{
  is_press = false;
 }
if(car.event){
	//car.event.excute();
	console.log("EVENT!");
	led_bool = true;
	car.event.voice.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
		console.log(path);
		ws.emmitPlay(path);
		led_bool = false;
	});
	car.event = null;
}
 //遅延実行
 setTimeout(loop, 500);
}
//初回実行
loop();


/*
//pin指定
var pin6 = new mraa.Gpio(6);
//pinモード設定
pin6.dir(mraa.DIR_IN);
//送信フラグ
var is_press = false;
//入力監視
function loop() {
	if(pin6.read()){
		if(!is_press){
			var v = new Voice();
			v.setText("こんにちはああああああああ、きたー");
			v.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
				console.log(path);
				ws.emmitPlay(path);
			});
		}
		is_press = true;
	}else{
		is_press = false;
	}
	//遅延実行
	setTimeout(loop, 100);
}
//初回実行
loop();
*/
