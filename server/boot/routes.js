module.exports = function(app) {
  
  var dateformat = require('dateformat');
  var Promise = require('bluebird');
  var router = app.loopback.Router();

 
  router.get('/', function(req, res) {
    res.render('index', {
      loginFailed: false,
      errorMessage: ""
    });

  });
  
  router.get('/home', function(req, res) {
    app.models.Role.find(function(err, roles) {
          if (err) console.log(err)
        
          console.log(roles)

          res.render('home', {
            roles: roles,
          });

        });
    
    });



  router.post('/home', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    

      app.models.TropicalUser.login({email: email,password: password}, 'user', function(err, token) {
        if (err) return res.render('index', {loginFailed: true, errorMessage: err});
      
        app.models.Role.find(function(err, roles) {
          if (err) console.log(err)
        
          console.log(roles)

          res.render('home', {
            roles: roles,
            username: token.user.username,
            accessToken: token.id,
	    userId: token.user.id
          });

        });

      });
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





  router.get('/users', function(req, res){
   
  var RoleMapping = app.models.RoleMapping;
  var User = app.models.TropicalUser;
  var Role = app.models.Role;

  var role = req.query.role;
  var roleId = req.query.roleId;

  console.log("Role: " + role);

  /////////////////////////////
  ////////Get users by role////

  RoleMapping.usersIDByRole = function(role, callback){

    RoleMapping.app.models.Role.findOne({where: {name:role}}, function(err, role){

     if( err || !role ) return callback(err);
        RoleMapping.find({
          where: {
            roleId: role.id,
            principalType: RoleMapping.USER
          }
         }, function(err, mappings){

           if( err ) return callback(err);
              var users = mappings.map(function (m) {
               return m.principalId;
              });
              callback(null, users);
          });
      });

   } 

   User.getUsersByRole = function(role, callback) {

     User.app.models.RoleMapping.usersIDByRole(role, function(err, users) {

       if( err || !users ) return callback(err);
       
       User.find({where: {id : {inq:users}}}, function(err, users){
         console.log(users);
	 
	 res.render('users', {
            role: role,
            roleId: roleId,
	    users: users 
         });
       });
     });
   };

//////////////////////////////////
/////////////////////////////////
var getRolesWithBluebird = function(){

  return new Promise(function(resolve, reject){

    Role.find(function(err, roles) {

      if (err) reject(err); //the value in the reject function will be passed to the .catch function

      resolve(roles); //the value passed in the resolve function will be passed to the .then function
    });
  });
};

var getRoleMappingsWithBluebird = function(roles){

  return new Promise(function(resolve, reject){

    RoleMapping.find(function(err, roleMappings) {

      if (err) reject(err); //the value in the reject function will be passed to the .catch function

      resolve(roleMappings); //the value passed in the resolve function will be passed to the .then function
    });
  });
};

var getUsersWithBluebird = function(roles, roleMappings){

  return new Promise(function(resolve, reject){

    User.find(function(err, users) {

      if (err) reject(err); //the value in the reject function will be passed to the .catch function

      
      for (var i=0; i<roleMappings.length; i++){
        
	console.log('rolemapping.principalID: ' + roleMappings[i].principalId);

        for (var j=0; j<users.length; j++){
          
          console.log('userId: ' + users[j].id);

	  if (roleMappings[i].principalId == users[j].id){
            console.log('match: ' + roleMappings[i].principalId + ' vs ' + users[j].id);
	    users[j].roleId = roleMappings[i].roleId;

	  }


	}



      }


            
      for (var i=0; i<users.length; i++){
        for (var j=0; j<roles.length; j++){
          if (users[i].roleId == roles[j].id){
            users[i].role = roles[j].name;
	  }
	}
      }
      
      console.log(JSON.stringify(users));

      
      resolve(users); //the value passed in the resolve function will be passed to the .then function
    });
  });
};



/////////
////////



getRolesWithBluebird()
.then(function(roles){
  console.log('got this: ' + roles);
  getRoleMappingsWithBluebird(roles)
  .then(function(roleMappings){
    console.log('next got this: ' + roleMappings);
    getUsersWithBluebird(roles, roleMappings)
    .then(function(users){
      console.log('next next got this: ' + users);
      res.render('users', {users: users});
    })
  })
})
.catch (function(error){
  console.log('something went wrong: ' + error);
});

//getAvatarWithBluebird('danthareja')
//.then(function(avatarUrl){
// console.log('got this: ' + avatarUrl);
//    getAvatarWithBluebird('wohamilton')
//      .then(function(avatarUrl2){
//          console.log('then got this: ' + avatarUrl2);
//	    });



///////






//   User.getUsersByRole(role);

  });


  router.get('/editUser', function(req, res) {

      var userId = req.query.userId;
      var role = req.query.role;
      var roleId= req.query.roleId;
      
      
      app.models.TropicalUser.findById(userId, function(err, user){
        if (err) {
          console.log(err);
        }else{
	
  	  console.log(user);

          app.models.Role.find(function(err, roles) {
            if (err) console.log(err)
        
            console.log(roles)

            res.render('add_user', {
              user: user,
              role: role,
	      roleId: roleId,
              roles: roles,
           });

          });
        }
      });


  });

  router.post('/editUser', function(req, res) {
    
    console.log('req.body.name: ' + req.body.name);
    console.log('req.body.userName: ' + req.body.userName);
    console.log('req.body.email: ' + req.body.email);
    console.log('req.body.newRoleId: ' + req.body.newRoleId);
    console.log('req.body.id: ' + req.body.userId);
    console.log('req.body.originalRole: ' + req.body.originalRole);
    console.log('req.body.originalRoleId: ' + req.body.originalRoleId)


    console.log("req.body: " + JSON.stringify(req.body));

    var name = req.body.name;
    var userName = req.body.userName;
    var email = req.body.email;
    var id = req.body.userId;
    var originalRole = req.body.originalRole;
    var originalRoleId = req.body.originalRoleId;
    var newRoleId = req.body.newRoleId;
    
    var userDataString = '{"id":"'+id+'","name":"'+name+'","username":"'+userName+'", "email":"'+email+'"}';
    
    console.log('JSON String: ' + userDataString);
    var userDataJSON = JSON.parse(userDataString);

    
    app.models.TropicalUser.upsert(userDataJSON, function(err, obj){
      if (err) {
        console.log(err);
      }else{
        console.log(obj);
      }
    });

     
    app.models.RoleMapping.findOne({where: {principalId:id, roleId:originalRoleId}}, function(err, roleMapping){
      if (err) {
        console.log(err);
      }else{
        console.log("roleMapping " + roleMapping);
          

        //NEED NEW ROLE ID 
        var roleMappingString = '{"id":"'+roleMapping.id+'","principalId":"'+id+'","roleId":"'+newRoleId+'"}';
        var roleMappingJSON = JSON.parse(roleMappingString);

        app.models.RoleMapping.upsert(roleMappingJSON, function(err, obj){
          if (err) {
            console.log(err);
          }else{
            console.log(obj);
            res.redirect('/users');
          }
        });
      }
    });
  });
 
  router.get('/addUser', function(req, res) {
    /* 
    app.models.Guardian.find(function(err, obj){
      if (err)
        console.log(err)

      console.log(obj);

      res.render('add_diary', {
	guardians: obj

      });
    });
    */
    
    app.models.Role.find(function(err, roles) {
      if (err) console.log(err)
      
      console.log('roles: ' + JSON.stringify(roles));   
      res.render('add_user', {
        roles: roles
      });
    });
  });

 
  router.post('/addUser', function(req, res) {
    
    console.log('req.body.name: ' + req.body.name);
    console.log('req.body.userName: ' + req.body.userName);
    console.log('req.body.email: ' + req.body.email);
    console.log('req.body.roleId: ' + req.body.roleId);
    console.log('req.body.password: ' + req.body.password);

    var name = req.body.name; 
    var userName = req.body.userName;
    var email = req.body.email;
    var roleId = req.body.roleId;
    var password = req.body.password;
     
    
    var userDataString = '{"name":"'+name+'","userName":"'+userName+'", "email":"'+email+'", "password":"'+password+'"}';
    
    console.log('JSON String: ' + userDataString);

    var userDataJSON = JSON.parse(userDataString);

    
    app.models.TropicalUser.create(userDataJSON, function(err, user){
      if (err) {
        console.log(err);
      }else{
	
	console.log(user);
	
        var roleMappingDataString = '{"principalType":"'+app.models.RoleMapping.USER+'","principalId":"'+user.id+'", "roleId":"'+roleId+'"}';
    
        console.log('JSON String: ' + roleMappingDataString);

        var roleMappingDataJSON = JSON.parse(roleMappingDataString);

        app.models.RoleMapping.create(roleMappingDataJSON, function(err, roleMapping){
          if (err) console.log(err);
	
	  console.log(roleMapping);
	
	  res.redirect('users');

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
