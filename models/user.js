// require dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

// user's subdocument 
var searchSchema = new Schema ({
  searTerm: { type: String, required: true},
  date: { type: String, required: true}
});

// create user schema
var UserSchema = new Schema({
  email: {type: String, required: true},
  passwordDigest: {type: String, required: true},
  createdAt: {type: Date, default: Date.now() },
  searches: [searchSchema]
});

// create a new user with secure (hashed) password (for sign up)
UserSchema.statics.createSecure = function (email, password, cb) {
  var _this = this;
  bcrypt.hash(password, 10, function (err, hash) {
    var user = {
      email: email,
      passwordDigest: hash,
      createdAt: Date.now()
    };
    _this.create(user, cb);
  });
};

// authenticate user (for login)
UserSchema.statics.authenticate = function (email, password, cb) {
  this.findOne({email: email}, function (err, user) {
    if (user === null) {
      cb("Can\'t find user with that email", null);
    } else if (user.checkPassword(password)) {
      cb(null, user);
    } else {
      cb("password incorrect", user);
    }
  });
};

// compare password user enters with hashed password (`passwordDigest`)
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordDigest);
};

// define user model
var Search = mongoose.model('Search', searchSchema);
var User = mongoose.model('User', UserSchema);

// export user model
module.exports = User;
