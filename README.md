# mongoDB에 저장된 데이터를 불러와서 NAVER API 인자로 넣어주기


----------

*실제 구현을 확인하기 위해서는 brew를 통한 mongod(mongodb 서버를 열어주는 역할) , mongo(DB에서 수행되는 CRUD를 확인하기 위한 역할) 패키지를 설치해야한다. *


----------
## 데이터 처리 과정 ##
**1. 공공데이터 처리**

CSV파일을 이용하여 mongoDB에 수동적으로 import ( 추후 다른 방법을 고안 하고자 한다. )

    $ mongoimport --db {using db name} --collection {collection name} --type csv --headerline --file {file name}.csv

**2. 공공데이터 활용**

mongoose 모듈을 통한 데이터 import가 실패하여 mongodb 모듈을 불러와 MongoClient를 활용한 mongoDB와의 통신을 활용한다. ( 추후 다른 방법을 고안하고자 한다. )


----------


 *routes/index.js*
 
     const MongoClient = require('mongodb').MongoClient;
     const assert = require('assert');
     const url = 'mongodb://localhost:27017'; // 기본 서버 포트 : 27017

    app.get('/maps', (req, res) => {
        MongoClient.connect(url, (err, client) => {
            assert.equal(null, err);
            var db = client.db("mongob_tutorial");
            // mongodb 용어로, cctv collection을 검색
            var cursor = db.collection('cctv').find({});
            // array화를 이용한 array method들을 이용하고자 함
            cursor.toArray((err, item) => {
                if(err) console.log(err);
                else {
                    res.send(item);
                    client.close();
                }
            })
        });
    });


**3. 회원정보(로그인 정보) DB 구축**

*mongo는 SQL과 다르게 data type을 가리지 않고 받아온다는 특징을 갖고 있다. 하지만, mongoose는 SQL의 특징 중 하나인 'data type을 사전에 지정해줘야한다.' 를   **Schema** 로 구현하여  **Schema** 를 이용하여 통신한다 . *

node의 모듈인 mongoose를 활용하여 mongoDB와 통신 


----------
*models/members.js*

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



*app.js* 

     // 스키마로 설정한 파일을 import
     const Members = require('./models/members');
     const router1 = require('./routes/index')(app, Members); // 위에서 설정한 스키마인 Members를 router에서 이용하기위해 인자로 넘겨주게 된다. 

*routes/index.js*

    module.exports = (app, Members) =>{
       
       app.post('/login/join', (req, res) => {
        let member = new Members();
        
        member.email_address = req.body.email_address;
        member.password = req.body.password;
        member.name = req.body.name;

        console.log(member.name);
        
        // mongoose는 mongoDB에 save 해줘야 데이터가 들어가게 된다.
        member.save((err) =>{
            if(err) {
                console.log(err);
                return;
            }
            res.send('mongoDB에서 생성여부를 확인하세요');
        })
    });

    app.get('/login/show', (req, res) => {
        var sess = req.session;
        var loginifo = { email_address : req.query.email_address,
                         password : req.query.password };

        console.log(loginifo);
        
        Members.find(loginifo, function(err, data){
                                    console.log(data);
                                    if(data.length !== 0) {
                                        sess.id = data['email_address'];
                                        sess.name = data['name'];
                                        console.log(sess.id, sess.name);
                                        
                                        res.send('login');
                                    }   
                                    else res.send('아이디 혹은 비밀번호를 다시 입력하세요!')
                                });
    });

