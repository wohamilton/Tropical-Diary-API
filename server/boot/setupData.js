module.exports = function(app) {
  var TropicalUser = app.models.TropicalUser;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var Team = app.models.Team;
  var User = app.models.User;

  TropicalUser.create([
    {name: 'Bill', username: 'Guardian', email: 'guardian@tropical.com', password: 'xxx'},
    {name: 'Gary', username: 'Guardian2', email: 'guardian2@tropical.com', password: 'xxx'},
    {name: 'Carlo', username: 'Parent', email: 'parent@tropical.com', password: 'xxx'}

  //  {username: 'Admin', email: 'admin@tropical.com', password: 'xxx'}
  ], function(err, users) {
    if (err) throw err;

    console.log('Created tropical users:', users);

    //create the admin role
    Role.create({
      name: 'guardian',
      description: 'Guardians'
    }, function(err, role) {
      if (err) throw err;

      console.log('Created role:', role);

      //make bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });

      //make bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[1].id
      }, function(err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });
    });

    Role.create({
      name: 'parent',
      description: 'Parents'
    }, function(err, role) {
      if (err) throw err;

      console.log('Created role:', role);

      //make bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[2].id
      }, function(err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });
    });



    // create project 1 and make john the owner
    users[0].Diaries.create({
      name: "Jim's Diary",
      //balance: 100
    }, function(err, diary) {
      if (err) throw err;

      console.log('Created diary:', diary);

      // add team members
      Team.create([
        {ownerId: diary.ownerId, memberId: users[0].id}
      ], function(err, team) {
        if (err) throw err;

        console.log('Created team:', team);
      });
    });
    
    users[1].Diaries.create({
      name: "Thomas' Diary",
    }, function(err, diary) {
      if (err) throw err;

        console.log('Created diary:', diary);

        diary.activities.create({
	  name: "Eating spaghetti",
	  session: "lunch",
	  isPublished: false,
	  description: "Fun, fun, fun.",
	  image_url: "Some_url.com",
	  start_date: '12/12/12',
	  end_date: '12/13/12'
	}, function(err, day){
          if (err)
	    console.log(err);
            console.log('Created Activity: ',  day);
        });
        
	diary.activities.create({
	  name: "Painting a picture",
	  session: "afternoon",
	  isPublished: false,
	  description: "Fun, fun, fun.",
	  image_url: "Some_url.com",
	  start_date: '12/12/12',
	  end_date: '12/13/12'
	}, function(err, day){
          if (err)
	    console.log(err);
            console.log('Created Activity: ',  day);
        });

      
    });

  });

  TropicalUser.create([
    //{username: 'Guardian', email: 'guardian@tropical.com', password: 'xxx'}
    {username: 'Admin', name: 'Admin', email: 'admin@tropical.com', password: 'xxx'}
  ], function(err, users) {
    if (err) throw err;
    
      console.log('Created tropical users:', users);



    //create the admin role
    Role.create({
      name: 'admin',
      description: 'Admins'
    }, function(err, role) {
      if (err) throw err;

      console.log('Created role:', role);

      //make bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) throw err;

        console.log('Created principal:', principal);
      });
    });
  });
};

