var express = require('express');
var router = express.Router();
var mongo=require("mongodb");
var multer=require('multer');
var upload = multer({ dest:'./public/images/uploads/' });
var db=require("monk")('localhost/nodeblog');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });

router.get('/show/:id', function(req, res, next) {
	var posts=db.get('posts');
	posts.findById(req.params.id,function(err,post){
  	res.render('show',{
  		'title':'',
  		'post':post
  		});
	});
});


/* GET users listing. */
router.get('/add', function(req, res, next) {
	var categories=db.get('categories');
	categories.find({},{},function(err,categories){
  	res.render('addpost',{
  		'title':'Add Post',
  		'categories':categories
  		});
	});
});

router.post('/add', upload.single('mainImage'), function(req,res,next){
	//Get form values
	var title=			req.body.title;
	var category=		req.body.category;
	var body=			req.body.body;
	var author=			req.body.author;
	var date = 			new Date();
	var mainImage=req.file;
	console.log(mainImage);
	//var mainImage=req.files.filename;

	if(req.file){
		console.log('Uploading file');
		//File info
		var mainImageOriginalName=		req.file.originalname;
		var mainImageName=				req.file.filename;
		var mainImageMime=				req.file.mimeType;
		var mainImagePath=				req.file.path;
		var mainImageExtension=			req.file.extension;
		var mainImageSize=				req.file.size;
	} else{
		//Set default image
		console.log("No image uploaded");
		var mainImageName='noname.png';
	}

	//Form validation
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body','Body field is required').notEmpty();

	var errors=req.validationErrors();
	
	if(errors){
		res.render('addpost',{
			"errors":errors,
			"title":title,
			"body":body
		});
	} else {
		var posts=db.get('posts');

		//Submit to db
		posts.insert({
			"title":title,
			"body":body,
			"category":category,
			"date":date,
			"author":author,
			"mainImage":mainImageName
		},function(err,post){
			if(err) {
				res.send('Error');
			} else {
				req.flash('success', 'Post submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
