const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'), // post방식의 정보 전달을 가능하게 해준다. 
      ejs = require('ejs'),
      session = require('express-session');
      
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(session({
    secret : 'ddinggu and koraran',
    resave : false,
    saveUninitialized : true
}))

const Members = require('./models/members');
const cctvInfo = require('./routes/index')(app, Members);
const userInfo = require('./routes/sign')(app, Members);

app.listen(3000, () => {
    console.log('connect port 3000 to application');
});

