// mongoDB를 통해 client에 뿌려주기

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost/mongob_tutorial';

MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db("mongob_tutorial");
    var cursor = db.collection('navers').find({});
    console.log(typeof(cursor));
    
    client.close();
});



