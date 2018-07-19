mongoDB에 저장된 데이터를 불러와서 NAVER API 인자로 넣어주기
=============

----------

_실제 구현을 확인하기 위해서는 brew를 통한 mongod(mongodb 서버를 열어주는 역할) , mongo(DB에서 수행되는 CRUD를 확인하기 위한 역할) 패키지를 설치해야한다._


## 1. 데이터 처리 방법 ##
### 1.1 공공데이터 처리

CSV파일을 이용하여 mongoDB에 수동적으로 import ( 추후 다른 방법을 고안 하고자 한다. )

    $ mongoimport --db {using db name} --collection {collection name} --type csv --headerline --file {file name}.csv

###1.2 공공데이터 활용 

mongoose 모듈을 통한 데이터 import가 실패하여 mongodb 모듈을 불러와 MongoClient를 활용한 mongoDB와의 통신을 활용한다. ( 추후 다른 방법을 고안하고자 한다. )

 _routes/index.js_
 
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


###1.3 회원정보(로그인 정보) DB 구축 

_mongo는 SQL과 다르게 data type을 가리지 않고 받아온다는 특징을 갖고 있다. 하지만, mongoose는 SQL의 특징 중 하나인 'data type을 사전에 지정해줘야한다.' 를   **Schema** 로 구현하여  **Schema** 를 이용하여 통신한다 ._

node의 모듈인 mongoose를 활용하여 mongoDB와 통신 



_models/members.js_

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



_app.js_ 

     // 스키마로 설정한 파일을 import
     const Members = require('./models/members');
     const router1 = require('./routes/index')(app, Members); // 위에서 설정한 스키마인 Members를 router에서 이용하기위해 인자로 넘겨주게 된다. 

_routes/index.js_

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


----------


## 2. NAVER API 활용 ##

이번주 구현하고자 했던 부분은 위에서 구축한 기본 데이터를 활용하여 DB,  server(router), client 간 통신을 확인하고자 하였고, 더 나아가 NAVER API를 활용하여 MAP을 깔고 실제 위치한 CCTV 위치를 마커로 표시하고자 하였다. 

_활용 도구 : jquery를 이용한 통신, naver api, ejs_
_기본 html 베이스는 파일 참고바람_

### 2.1  NAVER API 이용

네이버에서 제공하는 tutorial을 통해 기본 맵 구축하는 방법을 소개하고자 한다. 
네이버는 자바스크립트 문을 통해 제공되며, 본인은 template(view)와 js파일(public/js) 로 구분하여 관리하였다. 

##### 2.1.1 template 관리 
_view/body.ejs_

    // naver map은 id가 map인 div 박스에서 보여지게 된다.
    // can't load map은 본인이 map이 불러와지지 않는 경우를 확인하기 위해 일부러 값을 설정
    <div id="map" style="width:100%;height:600px;"> can't load map</div>
    // 로그인 세션을 확인해보기 위해 만든 박스 (실패)
    <div class="testing"> hello tester </div>
    
    // 버튼을 클릭하면 DB에 저장된 CCTV 좌표값들을 불러와 뿌려주게 된다. 
    <button class="place1"> 다른 곳 </button>
    <button class="place2"> 또 다른 곳 </button>
    <button class="place3"> 또또 다른 곳 </button>
    // naver api를 js script로 관리 
    <script src='/js/naverelements.js'></script>

##### 2.1.2 naver api 활용방법
_public/js/naverelement.js_

    // 네이버에서 제공하는 기본 map 설치방법
    var map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.5297825, 126.8992506), 
        zoom: 8, 
        mapTypeId: naver.maps.MapTypeId.NORMAL,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: naver.maps.MapTypeControlStyle.BUTTON,
            position: naver.maps.Position.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: naver.maps.ZoomControlStyle.SMALL,
            position: naver.maps.Position.TOP_RIGHT
        }
     }); 
    
     // 초기 마커를 설정하여 원하는 지점에 보낼 수 있게 만들기 위해 강제적으로 마커 삽입
    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(37.5297825, 126.8992506), 
        map: map
    });
    
    // 클릭에 따라 마커가 움직이게 만들어주는 eventHandler
    naver.maps.Event.addListener(map, 'click', function(e) {
        marker.setPosition(e.coord);
    });
    
    // 위도, 경도에 따른 셀리 마커 (실제 위치한 CCTV) 를 찍는 func
    function createMaker(latitude, longitude){
         var marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(latitude, longitude),
              map: map,
              icon: {
                    url: 'img/sally.png',
                    size: new naver.maps.Size(30, 32),
                    origin: new naver.maps.Point(0, 0),
                    anchor: new naver.maps.Point(25, 26)
                     }
         });
    }
    
    // window창이 열리게 되면, 자동적으로 서버와 통신하게된다. 
    // 이후 router에 위치한 app.get('/maps'...) 라우터가 DB와 통신하게 되고, MongoClient가 DB에서 array화 하여 res.send(item)으로 CCTV 데이터를 $.get(.. (data) ..)의 data라는 인자로 보내게 된다. 
    // 이후 createMaker로 원하는 개수만 마킹하기 위해 loop문을 이용
    $(window).on('load', () =>{
        $.get('/maps', (data) => {
            for(var i=0; i < 300; i++){
             var latitude = data[i]['latitude'],
                 longitude = data[i]['longitude'];  
                 
                 $('#map').html(createMaker(latitude, longitude));
            }
        })
    });
    
    // CCTV데이터를 전부 출력하면 생기는 과부하를 막기 위해 버튼으로 CCTV 갯수를 컨트롤하고자 만든 버튼들 
    $('.place1').on('click', () => {
        $.get('/maps', (data) => {
            for(var i=300; i < 500; i++){
             var latitude = data[i]['latitude'],
                 longitude = data[i]['longitude'];  
                 
                 $('#map').html(createMaker(latitude, longitude));
            }
        })
    })
    
    $('.place2').on('click', () => {
        $.get('/maps', (data) => {
            for(var i=500; i < 700; i++){
             var latitude = data[i]['latitude'],
                 longitude = data[i]['longitude'];  
                 
                 $('#map').html(createMaker(latitude, longitude));
            }
        })
    })
    
    $('.place3').on('click', () => {
        $.get('/maps', (data) => {
            for(var i=700; i < 900; i++){
             var latitude = data[i]['latitude'],
                 longitude = data[i]['longitude'];  
                 
                 $('#map').html(createMaker(latitude, longitude));
            }
        })
    })

### 2.2  구현 사례 

![default](./imgforREADME/default.png)
![wesung](./imgforREADME/wesung.png)

----------

DB를 활용한 전체적인 흐름
=============

![mongoclient](./imgforREADME/mongoclient.jpeg)
![mongoose](./imgforREADME/mongoose.jpeg)



