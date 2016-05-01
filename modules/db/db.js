var sqlite3 = require('sqlite3').verbose();
var db = undefined;


exports.connect = function(){
	db = new sqlite3.Database('cindy.db',function(err){
		if(err){
			console.log('fail:'+err);
		}
	});
}

exports.disconnect = function(){
	db.close();
}

function runSql(sql,data){
	db.run(sql,data,function(err){
		if(err){
			console.log('fail:'+err);
		}
	});	
}

function create(sql){
	db.run(sql,function(err){
		if(err){
			console.log('fail:'+err);
		}
		
	});
}



/*
story_progress table
*/
exports.progressSetup = function(){
	sql = 'CREATE TABLE IF NOT EXISTS story_progress(user_id INT, progress TEXT)';
	create(sql);
}

exports.addProgress = function(data){
	sql = 'INSERT INTO story_progress(user_id, progress) VALUES (?, ?)';
	runSql(sql,data);
}

exports.updateProgress = function(data){
	sql = 'UPDATE item SET progress = ? WHERE user_id =?';;
	runSql(sql,data);
}

exports.deleteProgress = function(data){
	sql = 'DELETE FROM item WHERE user_id = ?';
	runSql(sql,data);
}

exports.lookupProgress = function(data,res){
	sql = 'SELECT progress FROM story_progress WHERE user_id =?';
	db.all(sql,data,function(err,row){
		//something here
	});
}

// important!!!!!!!!!!!!!!!!
exports.nextProgress = function(data,res){
	sql = 'SELECT progress FROM story_progress WHERE user_id =?';
	db.all(sql,data,function(err,row){
		//some logic here to find the next story line
		//demo is the order logic
		res.redirect('/:story_id/:page_id')
	});
}


/*
story table
*/
exports.storySetup = function(){
	sql = 'CREATE TABLE IF NOT EXISTS story(name TEXT)';
	create(sql);
}

exports.addStory = function(data){
	sql = 'INSERT INTO story(name) VALUES (?)';
	runSql(sql,data);
}

exports.updateStory = function(data){
	sql = 'UPDATE item SET name = ? WHERE rowid =?';;
	runSql(sql,data);
}

exports.deleteStory = function(data){
	sql = 'DELETE FROM story WHERE row_id = ?';
	runSql(sql,data);
}

exports.showStory = function(res,func){
	sql = 'SELECT *,rowid FROM story';
	db.all(sql,function(err,row){
		//something here
	});
}


/*
page table
*/
exports.pageSetup = function(){
	sql = 'CREATE TABLE IF NOT EXISTS page(page_index INT, story_id INT, text TEXT)';
	create(sql);
}

exports.addPage = function(data){
	sql = 'INSERT INTO page(page_index, story_id, text) VALUES (?,?,?)';
	runSql(sql,data);
}

exports.updatePage = function(data){
	sql = 'UPDATE page SET page_index = ?, story_id = ?, text = ? WHERE rowid =?';;
	runSql(sql,data);
}

exports.deletePage = function(data){
	sql = 'DELETE FROM page WHERE row_id = ?';
	runSql(sql,data);
}

exports.showPage = function(res,func){
	sql = 'SELECT *,rowid FROM page';
	db.all(sql,function(err,row){
		//something here
	});
}