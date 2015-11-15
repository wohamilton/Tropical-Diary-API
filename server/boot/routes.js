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

    console.log('LOGIN TYPE: ' + loginType);
   //check login type 
   if (loginType == 'guardian'){
      console.log('g'); 
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
      console.log('u');
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

  router.get('/logout', function(req, res) {
    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query['access_token']});
    token.destroy();

    res.redirect('/');
  });

  app.use(router);
};
