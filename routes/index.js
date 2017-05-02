var express = require('express');
var router = express.Router();
var mongo=require("mongodb");
var db=require("monk")('localhost/nodeblog');
var posts = db.get('posts');
var categories = db.get('categories');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db =req.db;
  posts.find({},{},function(err,posts){
  	categories.find({},{},function(err,categories){
  		res.render('index',{
  			"posts":posts.reverse(),
  			"categories":categories
  		});	
  	});
  });
});

module.exports = router;
