//コンストラクタ
var CarModel = function(name, sex){
	//インスタンスプロパティ
	this.name = name || "no_name";
    this.sex = sex || 0;
    this.spec = null;
    this.friends = [];
}
//クラスプロパティ
CarModel.sample_class_prop = "value";
//クラスメソッド
CarModel.sampleClassFunc = function(){
	
};
//インスタンスメソッド
CarModel.prototype = {
	sampleFunc: function(){
	
	}
};

module.exports = CarModel;
