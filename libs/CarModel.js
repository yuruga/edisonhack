var DDD = {id:"hoe"};
//コンストラクタ
var CarModel = function(name, sex){
	//インスタンスプロパティ
    console.log(name)
	this.name = DUMMY_DATA_MAP[name]["name"] || "no_name";
    this.sex = DUMMY_DATA_MAP[name]["sex"] || 0;
    this.spec = null;
    this.friends = {};
}
//クラスプロパティ
CarModel.sample_class_prop = "value";
//クラスメソッド
CarModel.createDummyModel = function(id){
    return new CarModel(DUMMY_DATA_MAP[id]);
	
};
//インスタンスメソッド
CarModel.prototype = {
    //遭遇回数を加算
	addMetCount: function(vid){
        if(this.friends[vid])
        {
            this.friends[vid] ++;
        }else
        {
            this.friends[vid] = 1;
        }
        
	},
    //遭遇回数を取得
    getMetCount:function(vid)
    {
      return this.friends[vid] || 0;
    }
};

module.exports = CarModel;


var DUMMY_DATA_MAP = {
ITCJP_VID_001:{name:"名前001",sex:0},
ITCJP_VID_002:{name:"名前002",sex:1},
ITCJP_VID_003:{name:"名前003",sex:1},
ITCJP_VID_004:{name:"名前004",sex:1},
ITCJP_VID_005:{name:"名前005",sex:1},
ITCJP_VID_006:{name:"名前006",sex:1},
ITCJP_VID_007:{name:"名前007",sex:0},
ITCJP_VID_008:{name:"名前008",sex:0},
ITCJP_VID_009:{name:"名前009",sex:0},
ITCJP_VID_010:{name:"名前010",sex:1},
ITCJP_VID_011:{name:"名前011",sex:0},
ITCJP_VID_012:{name:"名前012",sex:1},
ITCJP_VID_013:{name:"名前013",sex:0},
ITCJP_VID_014:{name:"名前014",sex:0},
ITCJP_VID_015:{name:"名前015",sex:1},
ITCJP_VID_016:{name:"名前016",sex:1},
ITCJP_VID_017:{name:"名前0017",sex:0},
ITCJP_VID_018:{name:"名前0018",sex:1},
ITCJP_VID_019:{name:"名前0019",sex:1},
ITCJP_VID_020:{name:"名前0020",sex:1},
ITCJP_VID_021:{name:"名前0021",sex:1},
ITCJP_VID_022:{name:"名前0022",sex:0},
ITCJP_VID_023:{name:"名前23",sex:0},
ITCJP_VID_024:{name:"名前024",sex:1},
ITCJP_VID_025:{name:"名前25",sex:1},
ITCJP_VID_026:{name:"名前26",sex:1},
ITCJP_VID_027:{name:"名前27",sex:1},
ITCJP_VID_028:{name:"名前028",sex:0},
ITCJP_VID_029:{name:"名前029",sex:0},
ITCJP_VID_030:{name:"名前030",sex:0},
ITCJP_VID_031:{name:"名前031",sex:0},
ITCJP_VID_032:{name:"名前32",sex:1},
ITCJP_VID_033:{name:"名前33",sex:0},
ITCJP_VID_034:{name:"名前34",sex:0},
ITCJP_VID_035:{name:"名前35",sex:1},
ITCJP_VID_036:{name:"名前36",sex:0},
ITCJP_VID_037:{name:"名前037",sex:1},
ITCJP_VID_038:{name:"名前038",sex:0},
ITCJP_VID_039:{name:"名前039",sex:1},
ITCJP_VID_040:{name:"名前040",sex:1},
ITCJP_VID_041:{name:"名前041",sex:1},
ITCJP_VID_042:{name:"名前42",sex:0},
ITCJP_VID_043:{name:"名前43",sex:1},
ITCJP_VID_044:{name:"名前44",sex:1},
ITCJP_VID_045:{name:"名前045",sex:1},
ITCJP_VID_046:{name:"名前046",sex:0},
ITCJP_VID_047:{name:"名前047",sex:0},
ITCJP_VID_048:{name:"名前048",sex:0},
ITCJP_VID_049:{name:"名前49",sex:0},
ITCJP_VID_050:{name:"名前050",sex:0}
}