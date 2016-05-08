var express = require('express');
var router = express.Router();
var db = require('../../modules/db/db');
db.connect();

router.route('/')
.get(function(req,res){
	db.showProgress(0,res,'management');
});


router.route('/delete/:id').get(function(req,res){
	db.deleteProgress(req.params.id);
	res.redirect('/management/progress');
});


module.exports = router;