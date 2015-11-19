module.exports = function(app) {
  var router = app.loopback.Router();

  router.get('/', function(req, res) {
    console.log('Root');
    res.render('index', {
      loginFailed: false,
      title: 'Hello World'
    });

  });
  
  router.get('/home', function(req, res) {
    res.render('home');
  });

  router.post('/home', function(req, res) {
    console.log('home')        
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

    var token = req.query.token;

    app.models.Diary.find(function(err, instances){
      if (err) {
        console.log(err);
      }else{
        res.render('diaries', {
          diaries: instances,
	  token: token
        });
      }    
    });
  });


  router.get('/diary', function(req, res){
    
    console.log ('req.query.diaryId: ' + req.query.diaryId);
    var diaryId = req.query.diaryId;
    var token = req.query.token;
    

    app.models.Diary.findById(diaryId,{include: 'Days'}, function(err, diary){
      if (err) {
        console.log(err);
      }else{
        console.log(diary);
         
        //To access the result from an 'include filter' need to call it as a function
	var days = diary.Days();
        console.log('***DayID ' + days[0].id);

        app.models.Day.findById(days[0].id,{include: 'Activities'}, function(err, day){

          console.log(day);
          var activities = day.Activities();
          console.log('***Activity Name ' + activities[0].name);

          res.render('diary', {
            diary: diary,
	    days: days,
            activities: activities, 
            token: token
          });

	});
      }    
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
