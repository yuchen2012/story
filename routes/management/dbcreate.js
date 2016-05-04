var express = require('express');
var router = express.Router();
var db = require('../../modules/db/db');
db.connect();

router.route('/')
.get(function(req,res){
	db.progressSetup();
	db.progressSetup();
	db.storySetup();
	db.pageSetup();
	res.send('success');
});


module.exports = router;