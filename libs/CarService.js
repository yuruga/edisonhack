//コンストラクタ
var request = require('request');
var os = require("os");
var CarEvent = require("./CarEvent");
var CarModel = require("./CarModel");
var TextProvider = require("./TextProvider");

var END_POINT = "https://api-jp-t-itc.com/";
var GET_USER_INFO = "GetUserInfo";
var GET_VEHCLE_INFO = "GetVehicleInfo";
var API_KEY = "b47103a63f4c";

//リクエスト対象のプロパティー
var REQ_VEHICLE_PROPS = "[VehBehvr,VehCdn]"

var FRIEND_IP = "http://192.168.50.37:8080"


var CarService = function(searchRadius, monitoringRate){
	//インスタンスプロパティ
    this.setCarId(1);
    this.startMonitor(monitoringRate || 3*1000);
    this.searchRadius = searchRadius || 300;
    
    
    //set dummy
    if(os.hostname() == "Edison-MAEDA")
    {
        dummyid = "ITCJP_VID_020";
    }
    //車プロフィール
    
    this.carModel = new CarModel(dummyid);
    this.textProvider = new TextProvider(this.carModel.name, this.carModel.sex);
    
    //イベントプール
    this.events = [];
}
//クラスプロパティ

CarService.SAERCH_RADIUS = 100;


//クラスメソッド
CarService.sampleClassFunc = function(){
	
};
//インスタンスメソッド
CarService.prototype = {
	
    //取得対象のカーIDを指定
    setCarId:function(idNum){
        this.carId = "ITCJP_VID_"+ToDigit(idNum, 3);
        //console.log(this.carId);
    },
    //カーデータフェッチ
    _fetchCarData:function()
    {
        //console.log("getCarDara", this.carId);
        opt = this._createRequesrtOptions();
        request.post(opt, (function(self)
            {
                return function(error, response, body)
                {          
                    if (!error && response.statusCode == 200) 
                    {
                        //eco = body["vehicleinfo"][0]["data"][0]["EcoDrvgSts"];
                        //console.log("success",body["vehicleinfo"]);
                        //console.log("ssss", self)
                       
                        myCarData = body["vehicleinfo"][0];
                        if(myCarData){
                            self._checkMyCarSituation(myCarData["data"][0]);
                        }
                        nearbyCars = body["vehicleinfo"].slice(1);
                        self._checkNearbyCarsSitualtion(nearbyCars);
                        
                       
                    } else {
                        console.log('error: '+ response.statusCode);
                    }
                }
        })(this));
    },
    //
    _createRequesrtOptions:function()
    {
       en = getDateString(0);
       st = getDateString(30);
       params = {developerkey: API_KEY, responseformat:"json",vid:this.carId,radius:this.searchRadius,infoids:REQ_VEHICLE_PROPS, searchstart:en,searchend:en};
       return {uri: END_POINT+GET_VEHCLE_INFO,form: params,json: true};
    },
    //監視開始
    startMonitor:function(duration)
    {
        var func = (function(self){
            return function()
            {
                self._fetchCarData();//.apply(self);
            }
        })(this);
        this.cancelId = setInterval(func, duration);
    },
    //監視停止
    stopMonitor:function()
    {
        if(this.cancelId)
        {
            clearInterval(this.cancelId);
        }
    },
    getCarData:function()
    {
        return this.carModel;
    },
    
    /*--
        check functions
    --*/
    //my car
    _checkMyCarSituation:function(newSituation)
    {
        if(!this.myCarSituation)
        {
            this.myCarSituation = newSituation;
            return;
        }
        //check ignition
        //console.log("igni   ",this.myCarSituation["SysPwrSts"], newSituation["SysPwrSts"])
        if(this.myCarSituation["SysPwrSts"] != 2 && newSituation["SysPwrSts"] == 2)//if(newSituation["SysPwrSts"] == 2)
        {
            t = this.textProvider.greeting().selfIntro().build();
            this.event=new CarEvent(t);
        }
        this.myCarSituation = newSituation;
    },
    
    //neaby cars
    _checkNearbyCarsSitualtion:function(nearbyCars)
    {
        s = "";
        newNearByCars = []
        for(var i in nearbyCars)
        {
            car = nearbyCars[i]
            isNew = true;
            for (var j in this.nearbyCars)
            {
                vid = this.nearbyCars[j]
                if(car.vid == vid )
                {
                    isNew = false;
                    break;
                }
            }
            if(isNew)
            {
                targetId = car.vid;
                targetName = new CarModel(targetId).name;//CarModel.createDummyModel(car.vid).name;
                metCount = this.carModel.getMetCount(targetId);
                t = this.textProvider.getGreeting(targetName, metCount).build();
                console.log( "entered : "+targetId + "count : "+metCount);
                this.event=new CarEvent(t,FRIEND_IP+"/read");
                this.carModel.addMetCount(targetId);
            }
            newNearByCars.push(car.vid);
            s+=car.vid+", ";
        }
        
        for (var k in this.nearbyCars)
        {
            
            leaved = true;
            oldVid = this.nearbyCars[k];
            for (var l in newNearByCars)
            {
                if(oldVid == newNearByCars[l])
                {
                    leaved = false;
                    break;
                }
            }
            if(leaved == true)
            {
                targetVid = oldVid;
                targetName = new CarModel(targetVid).name;//.createDummyModel(targetVid).name;
                t = this.textProvider.getTextWithName("TARGET_NAME", targetName).getText("GOOD_BYE").build();
                
                console.log( "leaved : "+oldVid);
                this.event = new CarEvent(t,FRIEND_IP+"/read");
            }
        }
        console.log(s);
        this.nearbyCars = newNearByCars;
        
    }
};







//utils
function ToDigit(input, digit)
{
    st = input.toString();
    while(st.length < digit)
    {
        st = "0"+st;
    }
    return st
}

function getDateString(offset)
{
    now = new Date()
    dd = new Date(now.getTime()-1000*offset);
    YYYY = dd.getYear();
    MM = dd.getMonth() + 1;
    DD = dd.getDate();
    hh = dd.getHours();
    mm = dd.getMinutes();
    ss = dd.getSeconds();
    if (YYYY < 2000) { YYYY += 1900; }
    if (MM < 10) { MM = "0" + MM; }
    if (DD < 10) { DD = "0" + DD; }
    if (hh < 10) { hh = "0" + hh; }
    if (mm < 10) { mm = "0" + mm; }
    if (ss < 10) { ss = "0" + ss; }
    return (YYYY + "-" + MM + "-" + DD + " "+hh+":"+mm+":"+ss);
}

module.exports = CarService;

