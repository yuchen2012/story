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
	sql = 'CREATE TABLE IF NOT EXISTS story_progress(user_id INT, story_id INT, page_index INT, progress TEXT)';
	create(sql);
}

exports.addProgress = function(data){
	sql = 'INSERT INTO story_progress(user_id, story_id, page_index, progress) VALUES (?, ?, ?, ?)';
	runSql(sql,data);
}

exports.updateProgress = function(data){
	sql = 'UPDATE story_progress SET story_id = ?, page_index = ? ,progress = ? WHERE user_id =?';
	runSql(sql,data);
}

exports.deleteProgress = function(data){
	sql = 'DELETE FROM story_progress WHERE rowid = ?';
	runSql(sql,data);
}

exports.lookupProgress = function(data,res){
	sql = 'SELECT rowid FROM story_progress WHERE user_id =?';
	db.all(sql,data,function(err,row){
		if(err){
			console.log(err);
		}else{
			if(row.length==0){
				//login failed
				//but will add a new user in this demo
				sql = 'INSERT INTO story_progress(user_id, story_id, page_index, progress) VALUES (?, ?, ?, ?)';
				db.run(sql,[data,1,1,''],function(err){
					if(err){
						console.log(err);
					}else{
						res.redirect('/'+data);
					}
				});
			}else{
				res.redirect('/'+data);
			}
		}
	});
}

exports.showProgress = function(data,res,func){
	var sql;
	if(func=='game'){
		sql = 'SELECT story_progress.user_id, story_progress.story_id, story_progress.page_index, story.name, page.text FROM story_progress '+
		'INNER JOIN story ON story_progress.story_id = story.rowid '+
		'INNER JOIN page ON story_progress.story_id = page.story_id AND story_progress.page_index = page.page_index '+
		'WHERE story_progress.user_id = ?';
		db.all(sql,data,function(err,row){
			if(err){
				console.log(err);
			}else{
				
				if(row.length==0)res.send('No more story!');
				else res.render('story',{title:'story',data:row});
				
			}
		});
	}else if(func=='management'){
		sql = 'SELECT rowid,* FROM story_progress';
		db.all(sql,function(err,row){
			if(err){
				console.log(err);
			}else{
				
				res.render('management/progress',{title:'Progress management',data:row});
				
			}
		});
	}
}


// important!!!!!!!!!!!!!!!!
//demo is the order of the pages 
//write your own logic here
function findNext(user_id,progress,res){
	var story = 0;
	for(var i in progress){
		story = Math.max(story,parseInt(i));
	}
	
	console.log(story);
	
	var page = 0;
	
	for(var i in progress[String(story)]){
		page = Math.max(page,parseInt(i));
	}
	
	sql = 'SELECT page_index FROM page WHERE page_index > ? AND story_id = ? LIMIT 1';
	db.all(sql,[page,story],function(err,row1){
		if(err){
			console.log(err);
		}else{
			//console.log(row1);
			//console.log(page);
			if(row1.length>0){
				sql1 = 'UPDATE story_progress SET page_index = ? WHERE user_id =?';
				db.run(sql1,[row1[0].page_index,user_id],function(err){
					if(err){
						console.log(err);
					}else{
						res.redirect('/'+user_id);
					}
				});
			}else{
				sql2 = 'SELECT story_id, page_index FROM page WHERE story_id > ? ORDER BY story_id, page_index ASC LIMIT 1';
				db.all(sql2,story,function(err,row2){
					if(row2.length>0){
						
						sql3 = 'UPDATE story_progress SET story_id = ?, page_index = ? WHERE user_id =?';
						db.run(sql3,[row2[0].story_id,row2[0].page_index,user_id],function(err){
							if(err){
								console.log(err);
							}else{
								res.redirect('/'+user_id);
							}
						});
					}else{
						res.send('No more story!');
					}
				});
			}
		}
	});
}


exports.nextProgress = function(data,res){
	sql = 'SELECT progress FROM story_progress WHERE user_id =?';
	db.all(sql,data[0],function(err,row){
		var progress = {};
		//console.log(row[0].progress);
		if(row[0].progress.length!=0){ 
			progress = JSON.parse(row[0].progress);
			if(progress[String(data[1])] == null){
				progress[String(data[1])] = {};
				progress[String(data[1])][String(data[2])] = data[3];
			
			}else{
				progress[String(data[1])][String(data[2])] = data[3];
			}
		}
		else{
			progress[String(data[1])] = {};
			progress[String(data[1])][String(data[2])] = data[3];
		}
		
		
		strProgress = JSON.stringify(progress);
		sql1 = 'UPDATE story_progress SET progress = ? WHERE user_id =?';
		db.run(sql1,[strProgress,data[0]],function(err){
			if(err){
				console.log(err);
			}else{
				findNext(data[0],progress,res);
			}
		});
		
		
		
		
		
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
	sql = 'UPDATE story SET name = ? WHERE rowid =?';;
	runSql(sql,data);
}

exports.deleteStory = function(data){
	sql = 'DELETE FROM story WHERE rowid = ?';
	runSql(sql,data);
}

exports.showStory = function(res,func){
	sql = 'SELECT *,rowid FROM story';
	db.all(sql,function(err,row){
		if(func=='management')res.render('management/story',{title:'Story Management',data:row});
	});
}

exports.lookupStory = function(data,res,func){
	sql = 'SELECT *,rowid FROM story WHERE rowid = ?';
	db.all(sql,data,function(err,row){
		if(func=='management')res.render('management/storyupdate',{title:'Story Update',data:row});
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
	sql = 'DELETE FROM page WHERE rowid = ?';
	runSql(sql,data);
}

exports.showPage = function(res,data,func){
	if(func=='all'){
		sql = 'SELECT *,rowid FROM page';
		db.all(sql,function(err,row){
			res.render('management/page',{title:'Page Management',storyid:0,data:row});
		});
	}else if(func=='storyid'){
		sql = 'SELECT *,rowid FROM page WHERE story_id = ?';
		db.all(sql,data,function(err,row){
			res.render('management/page',{title:'Page Management',storyid:data,data:row});
		});
	}
}

exports.lookupPage = function(res,data,func){
	if(func=='management'){
		sql = 'SELECT *,rowid FROM page WHERE rowid = ?';
		db.all(sql,data,function(err,row){
			res.render('management/pageupdate',{title:'Page Update',data:row});
		});
	}
}