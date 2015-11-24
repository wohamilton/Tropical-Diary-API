module.exports = function(app) {
  
  var dateformat = require('dateformat');
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
	 userId: token.user.id,
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
         accessToken: token.id,
	 userId: token.user.id
        });
      });

   }


  });

  router.get('/diaries', function(req, res){

    app.models.Diary.find(function(err, instances){
      if (err) {
        console.log(err);
      }else{
        res.render('diaries', {
          diaries: instances
        });
      }    
    });
  });


  router.get('/diary', function(req, res){
    
    console.log ('req.query.diaryId: ' + req.query.diaryId);
    var diaryId = req.query.diaryId;
    

    app.models.Diary.findById(diaryId,{include: 'activities'}, function(err, diary){
      if (err) {
        console.log(err);
      }else{
     
        console.log(JSON.stringify(diary));

	var activities = diary.activities();

        res.render('diary', {
          diary: diary,
	  activities: activities,
        });
      }    
    });
  });
  
  router.get('/deleteDiary', function(req, res) {
    
    console.log ('req.query.diaryId: ' + req.query.diaryId);
    var diaryId = req.query.diaryId;
   
    app.models.Diary.destroyById(diaryId, function(err){
      if (err) {
        console.log(err);
      }else{
        console.log('Deleted: diaryId ' + diaryId); 
	res.redirect('diaries');
      }
    });
     
  });
  
  
  router.get('/addDiary', function(req, res) {
     
    app.models.Guardian.find(function(err, obj){
      if (err)
        console.log(err)

      console.log(obj);

      res.render('add_diary', {
	guardians: obj

      });
    });
  });

  router.post('/addDiary', function(req, res) {
    
    console.log ('req.body.userId: ' + req.body.userId);
    console.log ('req.body.diaryName: ' + req.body.diaryName);

    var userId = req.body.userId;
    var diaryName = req.body.diaryName;

    var diaryDataString = '{"ownerId":'+userId+', "name":"'+diaryName+'"}';
    
    console.log('JSON String: ' + diaryDataString);
    
    var diaryDataJSON = JSON.parse(diaryDataString);

    app.models.Diary.create(diaryDataJSON, function(err, obj){
      if (err) {
        console.log(err);
      }else{
	
	console.log(obj);
	
	res.redirect('diaries?userId=' + userId+ '&token=123');

      }
    });
    
  });

  router.get('/addActivity', function(req, res) {

      var diaryId = req.query.diaryId;
 
      res.render('add_activity',{
        diaryId: diaryId
      });
  });

  router.post('/addActivity', function(req, res) {
    
    console.log('req.body.name: ' + req.body.name);
    console.log('req.body.session: ' + req.body.session);
    console.log('req.body.description: ' + req.body.description);
    console.log('req.body.diaryId: ' + req.body.diaryId);
    console.log('req.body.startDate: ' + req.body.startDate);
    console.log('req.body.endDate: ' + req.body.endDate);
    console.log('req.body.imageUrl: ' + req.body.imageUrl);
    console.log('req.body.isPublished: ' + req.body.isPublished);



    var name = req.body.name;
    var session = req.body.session;
    var description = req.body.description;
    var diaryId = req.body.diaryId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var imageUrl = req.body.imageUrl;
    var isPublished = req.body.isPublished;

    var activityDataString = '{"session":"'+session+'","description":"'+description+'", "name":"'+name+'", "diaryId":'+diaryId+', "start_date":"'+startDate+'", "end_date":"'+endDate+'", "image_url":"'+imageUrl+'", "isPublished":'+isPublished+'}';
    
    console.log('JSON String: ' + activityDataString);
    
    var activityDataJSON = JSON.parse(activityDataString);

    
    app.models.Activity.create(activityDataJSON, function(err, obj){
      if (err) {
        console.log(err);
      }else{
	
	console.log(obj);
	
	res.redirect('diary?diaryId=' + diaryId);

      }
    });

    
    
  });

  router.get('/editActivity', function(req, res) {

      var diaryId = req.query.diaryId;
      var activityId = req.query.activityId;
      
      app.models.Activity.findById(activityId, function(err, activity){
        if (err) {
          console.log(err);
        }else{
	
  	  console.log(activity);

          var d = new Date(activity.start_date);
          var formattedStartDate = dateformat(d, "yyyy-mm-dd");
          
          var d = new Date(activity.end_date);
          var formattedEndDate = dateformat(d, "yyyy-mm-dd");
          
          console.log(d);
    
          res.render('add_activity',{
            diaryId: diaryId,
            activity: activity,
            formattedStartDate: formattedStartDate,
            formattedEndDate: formattedEndDate 
          });

        }
      });


  });

  router.post('/editActivity', function(req, res) {
    
    console.log('req.body.activityId: ' + req.body.activityId);
    console.log('req.body.name: ' + req.body.name);
    console.log('req.body.session: ' + req.body.session);
    console.log('req.body.description: ' + req.body.description);
    console.log('req.body.diaryId: ' + req.body.diaryId);
    console.log('req.body.startDate: ' + req.body.startDate);
    console.log('req.body.endDate: ' + req.body.endDate);
    console.log('req.body.imageUrl: ' + req.body.imageUrl);
    console.log('req.body.isPublished: ' + req.body.isPublished);


    var id = req.body.activityId;
    var name = req.body.name;
    var session = req.body.session;
    var description = req.body.description;
    var diaryId = req.body.diaryId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var imageUrl = req.body.imageUrl;
    var isPublished = req.body.isPublished;

    var activityDataString = '{"id":"'+id+'","session":"'+session+'","description":"'+description+'", "name":"'+name+'", "diaryId":'+diaryId+', "start_date":"'+startDate+'", "end_date":"'+endDate+'", "image_url":"'+imageUrl+'", "isPublished":"'+isPublished+'"}';
    
    console.log('JSON String: ' + activityDataString);
    
    var activityDataJSON = JSON.parse(activityDataString);

    
    app.models.Activity.upsert(activityDataJSON, function(err, obj){
      if (err) {
        console.log(err);
      }else{
	
	console.log(obj);
	
	res.redirect('diary?diaryId=' + diaryId);

      }
    });

    
    
  });

  
  router.get('/deleteActivity', function(req, res) {
    
    console.log ('req.query.activityId: ' + req.query.activityId);
    var activityId = req.query.activityId;
    var diaryId = req.query.diaryId;
   
    app.models.Activity.destroyById(activityId, function(err){
      if (err) {
        console.log(err);
      }else{
        console.log('Deleted: ActivityId ' + activityId); 
	res.redirect('diary?diaryId=' + diaryId);
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
