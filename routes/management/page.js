var express = require('express');
var router = express.Router();
var db = require('../../modules/db/db');
db.connect();

router.route('/:id')
.get(function(req,res){
	if(req.params.id==0) db.showPage(res,0,'all');
	else if(req.params.id!=0) db.showPage(res,req.params.id,'storyid')
}).post(function(req,res){
	db.addPage([req.body.page_index,req.body.story_id,req.body.text]);
	res.redirect('/management/page/'+req.body.story_id);
});


router.route('/delete/:id').get(function(req,res){
	db.deletePage(req.params.id);
	res.redirect('/management/page/'+req.body.story_id);
});

router.route('/update/:id').get(function(req,res){
	db.lookupPage(res,req.params.id,'management');
}).post(function(req,res){
	db.updatePage([req.body.page_index,req.body.story_id,req.body.text,req.body.rowid]);
	res.redirect('/management/page/'+req.body.story_id);
});

module.exports = router;