const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
    
    // Connection URL
const url = 'mongodb://localhost:27017';

module.exports = (app, Members) =>{
    
    app.get('/maps', (req, res) => {
        MongoClient.connect(url, (err, client) => {
            assert.equal(null, err);
            var db = client.db("mongob_tutorial");
            var cursor = db.collection('cctv').find({});
            cursor.toArray((err, item) => {
                if(err) console.log(err);
                else {
                    res.send(item);
                    client.close();
                }
            })
        });
    });

    app.get('/', (req, res) =>{
        res.render('index');
    })

    app.get('/login', (req, res) => {
        res.render('loginview', {test : '회원가입'});
    })

    app.post('/login/join', (req, res) => {
        let member = new Members();

        member.email_address = req.body.email_address;
        member.password = req.body.password;
        member.name = req.body.name;

        console.log(member.name);
        
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
        // test connecting route
        // res.send('query');
    });
        

} // 모듈의 끝