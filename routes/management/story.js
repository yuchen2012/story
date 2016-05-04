var express = require('express');
var router = express.Router();
var db = require('../../modules/db/db');
db.connect();

router.route('/')
.get(function(req,res){
	db.showStory(res,'management');
}).post(function(req,res){
	db.addStory(req.body.name);
	res.redirect('/management/story');
});

router.route('/delete/:id').get(function(req,res){
	db.deleteStory(req.params.id);
	res.redirect('/management/story');
});

router.route('/update/:id').get(function(req,res){
	db.lookupStory(req.params.id,res,'management');
}).post(function(req,res){
	db.updateStory([req.body.name,req.body.rowid]);
	res.redirect('/management/story');
});

module.exports = router;