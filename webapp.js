var express = require('express')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId


var app = express();
var db;

app.use(morgan('dev'))
app.use(express.static('static'));

//gets a list of filtered records
app.get('/api/bugs', function(req, res) {
	console.log("Query string", req.query);
	var filter = {};
	if(req.query.priority){
		filter.priority= req.query.priority;
	}
	if(req.query.status) {
		filter.status = req.query.status
	}

	db.collection("bugs").find(filter).toArray(function(err, docs) {
		res.json(docs)
	})
})

app.use(bodyParser.json())

//inserts a record
app.post('/api/bugs', function(req, res) {
	console.log('The req.body is:', req.body);
	var newBug = req.body
	db.collection("bugs").insertOne(newBug, function(err, result) {
		var newId = result.insertedId;
		db.collection("bugs").find({_id: newId}).next(function(err,doc) {
			res.json(doc);
		})
	})
})

//getting a single record
app.get('/api/bugs/:id', function(req,res) {
	db.collection("bugs").findOne({_id: ObjectId(req.params.id)}, function(err, bug) {
		res.json(bug);
	})
})

//modifying one record given its ID
app.put('/api/bugs/:id', function(req, res) {
	var bug = req.body
	console.log("modifying bug:", req.params.id, bug)
	var old = ObjectId(req.params.id)
	db.collection("bugs").updateOne({_id:old}, bug, function(err,result) {
		db.collection("bugs").find({_id:old}).next(function(err,doc) {
			res.send(doc);
		})
	})
})
//mongodb://<dbuser>:<dbpassword>@ds025429.mlab.com:25429/bugsdb
//mongodb://localhost/bugsdb
//mongodb://localhost/thisbugsss
MongoClient.connect('mongodb://devin:devin@ds025429.mlab.com:25429/bugsdb', function(err, dbConnection) {
	db= dbConnection;
})

var server = app.listen((process.env.PORT || 3030), function() {
	var port = server.address().port;
	console.log("Started server at port", port);
});
