var express = require('express');
var router = express.Router();
var mongo=require("mongodb");
var db=require("monk")('localhost/nodeblog');
var posts = db.get('posts');
var categories = db.get('categories');

/* GET home page. */
router.get('/add', function(req, res, next) {
	res.render('addcategory',{'title':'Add Category'});	
});

router.get('/show/:category', function(req, res, next) {
	var posts=db.get('posts');
	posts.find({category:req.params.category},{},function(err,posts){
		categories.find({},{},function(err,categories){
			res.render('index',{
				'title':req.params.category,
				'posts':posts,
				"categories":categories
			});	
		})
	});
});

router.post('/add',function(req,res,next){
	//Get form values
	var title=req.body.title;

	//Form validation
	req.checkBody('title','Title field is required').notEmpty();
	var errors=req.validationErrors();
	console.log('It works');
	if(errors){
		res.render('addcategory',{
			"errors":errors,
			"title":title,
		});
	} else {
		var categories=db.get('categories');

		//Submit to db
		categories.insert({
			"title":title,
		},function(err,post){
			if(err) {
				res.send('Error');
			} else {
				req.flash('success', 'Category submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


module.exports = router;
