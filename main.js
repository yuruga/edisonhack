//Type Node.js Here :)//フレームワーク読み込み
var mraa = require('mraa');
var CarService = require('./libs/CarService')

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
      console.log(car.events[0]);
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