mongoDB에 저장된 데이터를 불러와서 NAVER API 인자로 넣어주기
=============

----------

_실제 구현을 확인하기 위해서는 brew를 통한 mongod(mongodb 서버를 열어주는 역할) , mongo(DB에서 수행되는 CRUD를 확인하기 위한 역할) 패키지를 설치해야한다._


## 1. 데이터 처리 방법 ##
### 1.1 공공데이터 처리

CSV파일을 이용하여 mongoDB에 수동적으로 import ( 추후 다른 방법을 고안 하고자 한다. )

    $ mongoimport --db {using db name} --collection {collection name} --type csv --headerline --file {file name}.csv

추가로, import 된 data를 aggregate framework를 통해 GEOJSON 형식 및 불필요한 정보들을 제거하였다.\

**mongoDB에서 제공하는 aggreagate framework로는 collection에 새로운 데이터를 올리는 것에 문제가 생겨서 map-reduce를 통해 데이터 전처리를 하려고 한다.**

### 1.2 공공데이터 활용 

mongoose 모듈을 통한 데이터 import가 실패하여 mongodb 모듈을 불러와 MongoClient를 활용한 mongoDB와의 통신을 활용한다. ( 추후 다른 방법을 고안하고자 한다. )


### 1.3 회원정보(로그인 정보) DB 구축 

_mongo는 SQL과 다르게 data type을 가리지 않고 받아온다는 특징을 갖고 있다. 하지만, mongoose는 SQL의 특징 중 하나인 'data type을 사전에 지정해줘야한다.' 를   **Schema** 로 구현하여  **Model** 을 이용하여 통신한다 ._

mongoose의 모델은 스키마를 컴파일링 한 클래스가 되고, 도큐먼트들은 모델에 의해 생성되는 과정을 거쳐서 DB에 CRUD를 할 수 있다.\
추가로 스키마구조를 구축할 때, vaildator를 사용하여 에러값을 쉽게 출력할 수 있도록 간단하게 만들어 보았다.

이번 기간동안은 mongoose 기본쿼리로 간단한 회원가입 - 로그인 - 탈퇴 기능을 구현했고, 추후에 bcrypt-nodejs와 session middleware들을 사용하여 구조를 보완 할 것이다. 

- 7/24 
bcrypt를 이용하여 암호 해쉬화를 진행하였고, DB에 안착되는 것을 확인\
또한, mongoose schema에 pre hook, adding method를 활용.

이를 통해 CRD를 구축했고, 팀원들과 협의를 통해 form 형식을 그대로 갈 것인지, ajax통신을 이용할 것인지 논의해야한다. 


----------


## 2. NAVER API 활용 ##

구현하고자 하는 부분은 위에서 구축한 기본 데이터를 활용하여 DB,  server(router), client 간 통신을 확인하고자 하였고,  NAVER API를 활용하여 MAP을 깔고 실제 위치한 CCTV 위치를 마커로 표시하고자 하였다.  
더 나아가 navigator.geolocation 메소드를 이용하여 사용자의 위치를 판단하고자 하였다.

_활용 도구 : jquery를 이용한 통신, naver api, ejs, navigator.geolocation 메소드_
_기본 html 베이스는 파일 참고바람_

### 2.1  NAVER API 이용

네이버에서 제공하는 tutorial을 통해 기본 맵 구축하는 방법을 소개하고자 한다. 
네이버는 자바스크립트 문을 통해 제공되며, 본인은 template(view)와 js파일(public/js) 로 구분하여 관리하였다. 

##### 2.1.1 template 관리 
_view/index.ejs_
_view/header.ejs_
_view/body.ejs_

##### 2.1.2 naver api 활용방법
_public/js/naverelement.js_
_public/js/findmyloca.js_


### 2.2  구현 사례 

![default](./imgforREADME/default.png)
![wesung](./imgforREADME/wesung.png)

----------

## 3. 이후 계획 ## 

1. bcrypt-nodejs와 salt를 통해 비밀번호 단방향 보안작업
2. map - reduce를 통한 CCTV 데이터 전처리 작업
3. Chrome에서 제공하는 GPS 보안이슈(https) 처리
4. 이미 존재하는 CCTV데이터를 합산하는 작업 
5. 길찾기 알고리즘 생성
6. gitignore, config module을 통해 민감정보 제거
7. Sound, Image DB 구축


DB를 활용한 전체적인 흐름
=============

![mongoclient](./imgforREADME/mongoclient.jpeg)
![mongoose](./imgforREADME/mongoose.jpeg)



