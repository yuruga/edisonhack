//コンストラクタ
var CarEvent = function(text, interactionUrl){
	//インスタンスプロパティ
	this.text = text || "ほげ";
    this.interactionUrl = interactionUrl || null;
}
//クラスプロパティ
CarEvent.sample_class_prop = "value";
//クラスメソッド
CarEvent.sampleClassFunc = function(){
	
};
//インスタンスメソッド
CarEvent.prototype = {
	excute: function(){
	   //TODO call get Audio Servive with text.
       //TODO if interactionUrl is specified, call it.
	}
};

module.exports = CarEvent;
