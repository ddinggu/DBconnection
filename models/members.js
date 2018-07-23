const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mongob_tutorial');
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('Conneted to mongoDB server with mongoose');
});

const membersSchema = new Schema({
    email_address : {type : String, required : true, lowercase : true, 
                     index : true},
    password : {type : String, required : true, trim: true, minlength: [8,'비밀번호는 8자리 이상 입력해주세요']},
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

module.exports = mongoose.model('Member', membersSchema);



