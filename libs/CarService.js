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
var REQ_VEHICLE_PROPS = "[Posn,VehBehvr,VehCdn]"

var FRIEND_IP = "http://192.168.43.45:8080"

var ENABLED_CARS = ["ITCJP_VID_001","ITCJP_VID_003","ITCJP_VID_005","ITCJP_VID_006","ITCJP_VID_007","ITCJP_VID_010","ITCJP_VID_012","ITCJP_VID_015","ITCJP_VID_017","ITCJP_VID_020","ITCJP_VID_021","ITCJP_VID_025","ITCJP_VID_030","ITCJP_VID_031","ITCJP_VID_032"];


var CarService = function(searchRadius, monitoringRate){
	//インスタンスプロパティ
    //this.setCarId(1);
    //this.startMonitor(monitoringRate || 3*1000);
    this.searchRadius = searchRadius || 300;
    this.monitoringRate = monitoringRate || 3*1000;
    this.fetchCount = 0;
    
    
    //set dummy
    if(os.hostname() == "Edison-ICHIKAWA")
    {
        this.isHost = true;
        this.setCarId(7);
        //dummyid = "ITCJP_VID_017";
    }
    //this.setCarId(7);
    
    //イベントプール
    this.events = [];
    if(this.isHost)
    {
        this._fetchCarData();
    }
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
    _onReady:function(carspec)
    {
        //車プロフィール
        console.log();
        this.carModel = new CarModel(carspec["vid"]);
        this.textProvider = new TextProvider(this.carModel.name, this.carModel.sex);
        this.startMonitor(this.monitoringRate);
    },
    //カーデータフェッチ
    _fetchCarData:function()
    {
        //console.log("getCarDara", this.carId);
        opt = this._createRequesrtOptions();
		console.log(opt);
        request.post(opt, (function(self)
            {
                return function(error, response, body)
                {
					console.log(response.statusCode, body);
                    if (!error && response.statusCode == 200) 
                    {
                        self.fetchCount ++;
                        myCarData = body["vehicleinfo"][0];
                        if(self.fetchCount == 1)
                        {
                            self._onReady(myCarData);
                        }else
                        {
                            
                            if(myCarData){
                                self._checkMyCarSituation(myCarData["data"]);
                            }
                            nearbyCars = body["vehicleinfo"].slice(1);
                            self._checkNearbyCarsSitualtion(nearbyCars);
                        }
                    } else {
                        for(var e in response)
                        {
                            //console.log(e);
                        }
                        console.log('error: '+ error);
                    }
                }
        })(this));
    },
    //
    _createRequesrtOptions:function()
    {
       en = getDateString(0);
       st = getDateString(1);
       params = {developerkey: API_KEY, responseformat:"json",vid:this.carId,radius:this.searchRadius,infoids:REQ_VEHICLE_PROPS, searchstart:st,searchend:en};
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
        })(this)
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
    _checkMyCarSituation:function(data)
    {
        //console.log("datalength" ,data.length)
        newSituation = data[0];
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
            v = this.carModel.voice;
            v.setText(t);
            this.event=new CarEvent(v);
        }
        
        //check accelaration
        //console.log(newSituation["ALgt"]);
        if(newSituation["ALgt"] > 0.7)
        {
            t = this.textProvider.getText("HARD_ACCEL").build();
            v = this.carModel.voice;
            v.setText(t);
            this.event=new CarEvent(v);
        }
        if(newSituation["ALgt"] < -0.7)
        {
            t = t = this.textProvider.getText("HARD_BRAKE").build();
            v = this.carModel.voice;
            v.setText(t);
            this.event=new CarEvent(v);
        }
        if(data.length >1)
        {
            pos = newSituation["Posn"];
            p1 = [pos.lat, pos.lon];
            oldPos = data[1]["Posn"];
            p2 = [oldPos.lat,oldPos.lon];
            v = getVec(p1, p2);
            this.currentVec = v;
            //console.log("vector",v);
        }
        
        this.myCarSituation = newSituation;
    },
    
    //neaby cars
    _checkNearbyCarsSitualtion:function(nearbyCars)
    {
        s = "";
        newNearByCars = {}//[]
        for(var i in nearbyCars)
        {
            car = nearbyCars[i]
            isNew = true;
            for (var vid in this.nearbyCars)
            {
                //vid = this.nearbyCars[j]
                if(car.vid == vid )
                {
                    isNew = false;
                    break;
                }
            }
            if(isNew)
            {
                targetId = car.vid;
                console.log("aaaaaaaaaaaaaaaaaaa",targetId, "   :  ",ENABLED_CARS.indexOf(targetId));
                if(ENABLED_CARS.indexOf(targetId) != -1)
                {
                    targetName = new CarModel(targetId).name;//CarModel.createDummyModel(car.vid).name;
                    metCount = this.carModel.getMetCount(targetId);
                    t = this.textProvider.getGreeting(targetName, metCount).build();
                    //console.log( "entered : "+targetId + "count : "+metCount);
                    v = this.carModel.voice;
                    v.setText(t)
                    this.event=new CarEvent(v,FRIEND_IP+"/read");
                    this.carModel.addMetCount(targetId);
                }
                
                //対
                if(car.data.length >1)
                {
                    
                    pos = car.data[0]["Posn"];
                    
                    p1 = [pos.lat, pos.lon];
                    oldPos = car.data[1]["Posn"];
                    p2 = [oldPos.lat,oldPos.lon];
                    //console.log(p1,p2);
                    v = getVec(p1, p2)
                    //console.log("vec", v)
                }
                
                //if(car["Posn"])
                
                //天気が違う
                
                //ヘッドライト点きっぱなしだよ
                
                if(car["HdLampLtgIndcn"] != 0)
                {
                }
                //ライトついてる
                
            }
            newNearByCars[car.vid] = car.data[0];//.push(car.vid);
            s+=car.vid+", ";
        }
        
        for (var oldVid in this.nearbyCars)
        {
            
            leaved = true;
            //oldVid = this.nearbyCars[k];
            for (var l in newNearByCars)
            {
                if(oldVid == l)//newNearByCars[l])
                {
                    leaved = false;
                    break;
                }
            }
            if(leaved == true)
            {
                
                targetVid = oldVid;
                if(ENABLED_CARS.indexOf(targetId) != -1)
                {
                    targetName = new CarModel(targetVid).name;//.createDummyModel(targetVid).name;
                    t = this.textProvider.getTextWithName("TARGET_NAME", targetName).getText("GOOD_BYE").build();

                    //console.log( "leaved : "+oldVid);
                    v = this.carModel.voice;
                    v.setText(t);
                    this.event = new CarEvent(v,FRIEND_IP+"/read");
                }
            }
        }
        //console.log(s);
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

function normalizeVec(x, y)
{
    l = Math.sqrt(x*x+y*y);
    return [x/l, y/l]
}
function subtractLength(nv1,nv2)
{
    x = nv1[0]-nv2[0];
    y = nv1[1]-nv2[1];
    return Math.sqrt(x*x+y*y);
}
function getVec(p1,p2)
{
    
    return [p1[0]-p2[0],p1[1]-p2[1]];
}

module.exports = CarService;

