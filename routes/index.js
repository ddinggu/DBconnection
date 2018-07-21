const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
    
    // Connection URL
    const url = 'mongodb://localhost:27017';

    module.exports = (app, Members) =>{
    
    // 영등포구
    app.get('/yeongdeungpo', (req, res) => {
        MongoClient.connect(url, (err, client) => {
            assert.equal(null, err);
            var db = client.db("mongob_tutorial");
            var cursor = db.collection('GEOcctv').find({});
            cursor.toArray((err, item) => {
                if(err) console.log(err);
                else {
                    res.send(item);
                    client.close();
                }
            })
        });
    });

    // 성동구
    app.get('/sungsu', (req, res) => {
        MongoClient.connect(url, (err, client) => {
            assert.equal(null, err);
            var db = client.db("mongob_tutorial");
            var cursor = db.collection('GEOcctv2').find({});
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

    app.post('/login/join/', (req, res) => {
        let member = new Members();

        member.email_address = req.body.email_address;
        member.password = req.body.password;
        member.name = req.body.name;

        if(!member.email_address || !member.password || !member.name) res.send('회원정보를 확인하고 다시 생성해주세요!');        
         
        member.save((err) =>{
            if(err) {
                console.log(err);
                return;
            }
            else res.send('mongoDB에서 생성여부를 확인하세요');
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

    // app.put('/login/change', (req, res) => {
    //     var checkinfo = { email_address : req.body.email_address,
    //                      password : req.body.password };

    //     console.log(checkinfo);
        
    //     Members.find(checkinfo, function(err, data){
    //                                 console.log(data);
    //                                 if(err) res.send(err);  
    //                                 else {
    //                                     data.name = req.body.name;

    //                                     data.save( (err)=> {
    //                                         if(err) res.send(err)
    //                                         else res.send('변경완료! DB에서 확인하세요!')
    //                                     })
    //                                 }

    //                             });
    //     // test connecting route
    //     // res.send('query');
    // });
 

} // 모듈의 끝 