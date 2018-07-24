const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      Schema = mongoose.Schema,
      saltRounds = 10;
      
mongoose.connect('mongodb://localhost/mongob_tutorial');
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('Conneted to mongoDB server with mongoose');
});

const membersSchema = new Schema({
    email_address : {type : String, required : true, lowercase : true, 
                     index : true},
    password : {type : String, required : true, minlength: [8,'비밀번호는 8자리 이상 입력해주세요']},
    name : {type : String, required : [true,'이름을 적어주세요']},
    
    evaluation : {
        ratings : Number,
        reviews : String
    },
    dangerLocation : [{
        geometry : {
            type : {type : String, default : 'Point'},
            coordinates : [Number, Number]
        },
        properties : {
            locationOpinon : {type : String, maxlength : 50},
            createDate : { type: Date, default: Date.now }
        }
    }] // 여러개가 들어가야 하므로 array로 묶어주자. --> join이 더 효과적인데???     
});

// 모델에 저장되기 전에 해쉬를 적용한 비밀번호로 저장 
// pre hook이 진행된후 post hook이 진행된다. 
membersSchema.pre('save', function(next) { 
    var user = this;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) next(err);
        bcrypt.hash(user.password, salt, function(err, hashed) {
            if(err) next(err);
            else{ 
                user.password = hashed;
                next(); // 다음 미들웨어로 진행시킨다. (미들웨어의 실행진행순서를 파악할 수 있다.)
            }
        });
    });
});

// 비밀번호를 검사하는 메소드를 스키마에 추가
// cb : 콜백함수 --> 다음에 지정하는 콜백함수를 실행하게 된다!!!! 겁나 중요!!! 
membersSchema.methods.checkUser = function(guess, cb){
    bcrypt.compare(guess, this.password, function(err, isMatched){
        if(err) cb(err);
        cb(null, isMatched);
    })
};

membersSchema.methods.deleteUser = function(validator, guess){
    // router에 있는 삭제부분이 너무 지저분하므로 따로 함수를 생성할 수 있으면 생성해보자.. 
};

module.exports = mongoose.model('Member', membersSchema);



