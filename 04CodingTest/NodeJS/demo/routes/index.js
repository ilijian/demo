
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.login = function(req, res){
  res.render('login', { title: '用户登录' });
};

exports.doLogin = function(req,res){
	var user = {
	username: 'admin',
	password: 'admin'
	}
	if(req.body.username === user.username && req.body.password===user.password){
		res.redirect("welcome?username=" + req.body.username);
	}
	res.render('login', { title: '用户登录' });
}

exports.welcome = function(req, res){
  res.render('welcome', { title: '欢迎' });
};

exports.logout = function(req, res){
  res.render('logout', { title: '登出' });
};