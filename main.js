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
var mraa = require('mraa');
var CarService = require('./libs/CarService')
/**
 * main
 */

/*var v = new voice();
v.setText("あいうえお");
v.getAndWriteData("/tmp/sample.wav", function(path){
	console.log("hoge", path);
});*/

//pin指定
var pin6 = new mraa.Gpio(6);
var car = new CarService(80);

//pinモード設定
pin6.dir(mraa.DIR_IN);
//送信フラグ
var is_press = false;
var n = 0;
//入力監視
function loop() {
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
      car.event.excute();
      car.event = null;
}
 //遅延実行
 setTimeout(loop, 1000);
}
//初回実行
loop();




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

