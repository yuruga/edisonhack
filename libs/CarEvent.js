//var voice = require("./VoiceService");
var request = require('request');
//コンストラクタ
var CarEvent = function(voice, interactionUrl){
	//インスタンスプロパティ
	//this.text = text || "ほげ";
    this.interactionUrl = interactionUrl || null;
    this.voice = voice;
}
//クラスプロパティ
CarEvent.sample_class_prop = "value";
//クラスメソッド
CarEvent.sampleClassFunc = function(){
	
};
//インスタンスメソッド
CarEvent.prototype = {
	excute: function(){
        console.log(this.voice.text, this.voice.speaker);
	   //TODO call get Audio Servive with text.
       
        //v = new voice();
        //v.setText(this.text);
        this.voice.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
            console.log("localread:"+path);
            //TODO: Read
        });
        
        //TODO if interactionUrl is specified, call it.
        if(this.interactionUrl)
        {
            props = { w:this.voice.text };
            opt = {
              url: this.interactionUrl,
              qs: props
            };
            request.get(opt, function(error, response, body){          
                if (!error && response.statusCode == 200) 
                {
                    console.log('success: '+ body);
                } else {
                    console.log('error: '+ response.statusCode);
                }
            });
        }
        //
        this.voice = null;
	}
};

module.exports = CarEvent;
