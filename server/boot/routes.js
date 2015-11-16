module.exports = function(app) {
  var router = app.loopback.Router();

  router.get('/', function(req, res) {
    res.render('index', {
      loginFailed: false,
      title: 'Hello World'
    });

  });
  
  router.get('/home', function(req, res) {
    res.render('home');
  });

  router.post('/home', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var loginType = req.body.loginType;

   //check login type 
   if (loginType == 'guardian'){
      app.models.Guardian.login({
        email: email,
        password: password
      }, 'user', function(err, token) {
        if (err)
          return res.render('index', {
            email: email,
            password: password,
            loginFailed: true
          });


        token = token.toJSON();

        res.render('home', {
         username: token.user.username,
         accessToken: token.id
        });
      });


   }else{
      app.models.User.login({
        email: email,
        password: password
      }, 'user', function(err, token) {
        if (err)
          return res.render('index', {
            email: email,
            password: password,
            loginFailed: true
          });


        token = token.toJSON();

        res.render('home', {
         username: token.user.username,
         accessToken: token.id
        });
      });

   }


  });

  router.get('/diaries', function(req, res){
    
    var diariesJSON = "init";


/*
    app.models.Diary.find(null, function(err, instances){
      if (err) {
        console.log(err);
      }else{
        console.log('IN');
        console.log(instances.length);
        diariesJSON = instances;
      }    


    });

*/
    app.models.Diary.findById(1,{include: 'guardian'}, function(err, instance){
      if (err) {
        console.log(err);
      }else{
        console.log(instance);
      }    


    });

    res.render('diaries', {
      diaries: diariesJSON
    });

  });

  router.get('/logout', function(req, res) {
    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query['access_token']});
    token.destroy();

    res.redirect('/');
  });

  app.use(router);
};
