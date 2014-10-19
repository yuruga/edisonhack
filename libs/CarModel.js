var VoiceService = require("./VoiceService");

//コンストラクタ
var CarModel = function(carId){
	//インスタンスプロパティ
    
    
    
	this.name = DUMMY_DATA_MAP[carId]["name"] || "no_name";
    //this.sex = DUMMY_DATA_MAP[carId]["sex"] || 0;
    this.model = DUMMY_DATA_MAP[carId]["vehicleModel"] || "AQUA";
    this.voice = new VoiceService();
    switch(this.model)
    {
        case "Prius":{
                this.sex=0;
                this.voice.setSpeaker(VoiceService.speaker.TAKERU);
            };break;
        case "Priusα":{
                this.sex=1;
                this.voice.setSpeaker(VoiceService.speaker.HARUKA);
            };break;
        case "AQUA":{
                this.sex=1;
                this.voice.setSpeaker(VoiceService.speaker.HIKARI);
            };break;
    }
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
    },
    //voiceセットアップ
    setUpVoice:function(){
        if(this.sex == 1)
        {
        }
    }
};

module.exports = CarModel;


var DUMMY_DATA_MAP = {
ITCJP_VID_001:{name:"ポチ",sex:0, vehicleModel:"Prius"},
ITCJP_VID_002:{name:"トーマス",sex:1, vehicleModel:"Prius"},
ITCJP_VID_003:{name:"まいける",sex:1, vehicleModel:"Prius"},
ITCJP_VID_004:{name:"ジョン",sex:1, vehicleModel:"Prius"},
ITCJP_VID_005:{name:"よしお",sex:1, vehicleModel:"Prius"},
ITCJP_VID_006:{name:"ロン",sex:1, vehicleModel:"Prius"},
ITCJP_VID_007:{name:"ケニー",sex:0, vehicleModel:"Prius"},
ITCJP_VID_008:{name:"フォンタ",sex:0, vehicleModel:"Prius"},
ITCJP_VID_009:{name:"たぬきい",sex:0, vehicleModel:"Prius"},
ITCJP_VID_010:{name:"ロバート",sex:1, vehicleModel:"Prius"},
ITCJP_VID_011:{name:"ジェニファー",sex:0, vehicleModel:"Priusα"},
ITCJP_VID_012:{name:"アン",sex:1, vehicleModel:"Priusα"},
ITCJP_VID_013:{name:"ちびこ",sex:0, vehicleModel:"Priusα"},
ITCJP_VID_014:{name:"りん",sex:0, vehicleModel:"Priusα"},
ITCJP_VID_015:{name:"ショーン",sex:1, vehicleModel:"Priusα"},
ITCJP_VID_016:{name:"ぽこ",sex:1, vehicleModel:"Priusα"},
ITCJP_VID_017:{name:"もこ",sex:0, vehicleModel:"Priusα"},
ITCJP_VID_018:{name:"アンジー",sex:1, vehicleModel:"Priusα"},
ITCJP_VID_019:{name:"イザベラ",sex:1, vehicleModel:"Priusα"},
ITCJP_VID_020:{name:"のん",sex:1, vehicleModel:"Priusα"},
ITCJP_VID_021:{name:"ロッキー",sex:1, vehicleModel:"AQUA"},
ITCJP_VID_022:{name:"ぼんちあげ",sex:0, vehicleModel:"AQUA"},
ITCJP_VID_023:{name:"ようかん",sex:0, vehicleModel:"AQUA"},
ITCJP_VID_024:{name:"ポテト",sex:1, vehicleModel:"AQUA"},
ITCJP_VID_025:{name:"トマト",sex:1, vehicleModel:"AQUA"},
ITCJP_VID_026:{name:"ルー",sex:1, vehicleModel:"AQUA"},
ITCJP_VID_027:{name:"カレー",sex:1, vehicleModel:"AQUA"},
ITCJP_VID_028:{name:"ガラムマサラ",sex:0, vehicleModel:"AQUA"},
ITCJP_VID_029:{name:"トッポ",sex:0, vehicleModel:"AQUA"},
ITCJP_VID_030:{name:"ジージョ",sex:0, vehicleModel:"AQUA"},
ITCJP_VID_031:{name:"ミッキー",sex:0, vehicleModel:"Prius"},
ITCJP_VID_032:{name:"サンデル",sex:1, vehicleModel:"Prius"},
ITCJP_VID_033:{name:"チョコ",sex:0, vehicleModel:"Prius"},
ITCJP_VID_034:{name:"キャンディー",sex:0, vehicleModel:"Prius"},
ITCJP_VID_035:{name:"ばーばぱぱ",sex:1, vehicleModel:"Prius"},
ITCJP_VID_036:{name:"まんじゅう",sex:0, vehicleModel:"Prius"},
ITCJP_VID_037:{name:"だいふく",sex:1, vehicleModel:"Prius"},
ITCJP_VID_038:{name:"もなか",sex:0, vehicleModel:"Prius"},
ITCJP_VID_039:{name:"アイス",sex:1, vehicleModel:"Prius"},
ITCJP_VID_040:{name:"チーズ",sex:1, vehicleModel:"Prius"},
ITCJP_VID_041:{name:"パスタ",sex:1, vehicleModel:"Prius"},
ITCJP_VID_042:{name:"チムニー",sex:0, vehicleModel:"Prius"},
ITCJP_VID_043:{name:"イギー",sex:1, vehicleModel:"Prius"},
ITCJP_VID_044:{name:"マリリン",sex:1, vehicleModel:"Prius"},
ITCJP_VID_045:{name:"すーざん",sex:1, vehicleModel:"Prius"},
ITCJP_VID_046:{name:"ミニー",sex:0, vehicleModel:"Prius"},
ITCJP_VID_047:{name:"みぎー",sex:0, vehicleModel:"Prius"},
ITCJP_VID_048:{name:"ひだりー",sex:0, vehicleModel:"Prius"},
ITCJP_VID_049:{name:"うしお",sex:0, vehicleModel:"Prius"},
ITCJP_VID_050:{name:"とら",sex:0, vehicleModel:"Prius"}
}