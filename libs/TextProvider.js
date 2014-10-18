var TextData = {
    GREETING_MORNING:["おはよう。"],
    GREETING_DAY:["こんにちは。"],
    GREETING_NIGHT:["こんばんわー。"],
    HOWS_GOING:["調子はどう？"],
    IM_FINE:["俺はバリバリだぜー！","私は絶好調よ！"],
    LETS_GO:["さぁ、出かけようぜ！","さぁ。出発しましょう！"],
    SELF_INTRO:["僕は{{name}}だよー。","私、{{name}}っていうの"],
    GOOD_BYE:["バイバイー。","ごきげんよう。"],
    TARGET_NAME:["{{targetname}}さん、"],
    NICE_TO_MEET_YOU:["はじめましてー。"],
    HELLO_AGAIN:["また会ったねー"]
}

//コンストラクタ
var TextProvider = function(name, sex){
	//インスタンスプロパティ
    console.log(name);
	this.sex = sex || 0;
    this.name = name || "名無し";
    this.buffer = "";
}
/*//クラスプロパティ
TextProvider.STATIC_TEXTS = ;
//クラスメソッド
TextProvider.sampleClassFunc = function(){
	
};*/
//インスタンスメソッド
TextProvider.prototype = {
	greeting: function(time){
        hours = new Date().getHours();
        greeting = ""
        if(hours < 11)
        {
            greeting = this._getTextForSex("GREETING_MORNING");
        }else if(hours < 19)
        {
            greeting = this._getTextForSex("GREETING_DAY");
        }else
        {
            greeting = this._getTextForSex("GREETING_NIGHT");
        }
        
        this.buffer += greeting;
        
        return this;
	},
    selfIntro:function(){
        this.buffer += this._getTextForSex("SELF_INTRO");
        return this;
    },
    getText:function(id)
    {
        this.buffer += this._getTextForSex(id);
        return this;
    },
    getTextWithName:function(id,name)
    {
        r = this._getTextForSex(id).replace(/{{targetname}}/g,name);
        this.buffer += r;
        return this;
    },
    //出会った時のあいさつ
    getGreeting:function(targetName, metCount)
    {
        if(metCount == 0)
        {
            this.getText("NICE_TO_MEET_YOU").getTextWithName("TARGET_NAME", targetName).selfIntro();
        }else if(metCount == 1)
        {
            this.greeting().getTextWithName("TARGET_NAME", targetName).getText("HELLO_AGAIN")
        }else
        {
            this.greeting().getTextWithName("TARGET_NAME", targetName)
        }
        return this;
    },
    
    build:function()
    {
        text = this.buffer;
        this.buffer = "";
        text =  text.replace(/{{name}}/g,this.name);
        return text; 
    },
    _getTextForSex:function(textId, metCount)
    {
        src = TextData[textId];
        return src[this.sex] || src[0];
    }
};
module.exports = TextProvider;
