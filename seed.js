db = require('./models');

/* Prints out EVERYTHING from the database */
db.User.find({}, function (massiveNuclearError, lifeGoesOn) {
  if(massiveNuclearError) {return console.log(massiveNuclearError);}
  console.log("Total number of database entries: " + lifeGoesOn.length);
  lifeGoesOn.forEach(function(dbEntry){
    console.log(dbEntry);
  });
  process.exit(0);
});
/* Deltes EVERYTHING from the database */
// db.User.remove({}, function(err, successful) {
//   if(err)  {return console.log(err);}
//   console.log("Successfully removed everything from DB.");
//   process.exit(0);
// });
