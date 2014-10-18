//コンストラクタ
var request = require('request');
var END_POINT = "https://api-jp-t-itc.com/";
var GET_USER_INFO = "GetUserInfo";
var GET_VEHCLE_INFO = "GetVehicleInfo";
var API_KEY = "b47103a63f4c";
var CarService = function(){
	//インスタンスプロパティ
	this.sample_instance_prop = "value";
}
//クラスプロパティ

CarService.sample_class_prop = "value";
CarService.options = {
  uri: 'https://api-jp-t-itc.com/'+GET_VEHCLE_INFO,
  form: { developerkey: API_KEY,responseformat:"json",vid:"ITCJP_VID_001",infoids:"[Posn,VehBehvr]"},
  json: true
};

//クラスメソッド
CarService.sampleClassFunc = function(){
	
};
//インスタンスメソッド
CarService.prototype = {
	sampleFunc: function(){
	   console.log("hoge");
	},
    
    getCarData:function(){
        console.log("getCarDara",CarService.options);
        request.post(CarService.options, function(error, response, body){          
            if (!error && response.statusCode == 200) {
                console.log("success",body["vehicleinfo"][0]["data"]);
            } else {ata
                console.log('error: '+ response.statusCode);
            }
        });
    }
};

module.exports = CarService;

