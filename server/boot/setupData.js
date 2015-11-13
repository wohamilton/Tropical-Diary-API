module.exports = function(app) {
  var TropicalUser = app.models.TropicalUser;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var Team = app.models.Team;

  TropicalUser.create([
    {username: 'Parent', email: 'parent@tropical.com', password: 'xxx'},
    {username: 'Guardian', email: 'guardian@tropical.com', password: 'xxx'},
    {username: 'Admin', email: 'admin@tropical.com', password: 'xxx'}
  ], function(err, users) {
    if (err) throw err;

    console.log('Created users:', users);

    // create project 1 and make john the owner
    users[1].diaries.create({
      name: 'diary1',
      //balance: 100
    }, function(err, diary) {
      if (err) throw err;

      console.log('Created diary:', diary);

      // add team members
      Team.create([
        {ownerId: diary.ownerId, memberId: users[0].id},
        {ownerId: diary.ownerId, memberId: users[1].id}
      ], function(err, team) {
        if (err) throw err;

        console.log('Created team:', team);
      });
    });

    //create the admin role
    Role.create({
      name: 'admin'
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
  });
};

