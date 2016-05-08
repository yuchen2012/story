var express = require('express');
var router = express.Router();
var db = require('../modules/db/db');
db.connect();

router.route('/')
.get(function(req,res){
	res.render('index',{title:'game'});
}).post(function(req,res){
	db.lookupProgress(req.body.rowid,res);
});

router.route('/:user_id').get(function(req,res){
	db.showProgress(req.params.user_id,res,'game');
});

router.route('/:user_id/:story_id/:page_index/:action').get(function(req,res,next){
	if(req.params.user_id!='management')db.nextProgress([req.params.user_id,req.params.story_id,req.params.page_index,req.params.action],res);
	else next();
});



module.exports = router;