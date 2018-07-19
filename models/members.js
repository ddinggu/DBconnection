const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mongob_tutorial');
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('Conneted to mongoDB server with mongoose');
});

const membersSchema = new Schema({
    email_address : {type : String, required : true, lowercase : true },
    password : {type : String, required : true },
    name : String
});

module.exports = mongoose.model('Member', membersSchema);



