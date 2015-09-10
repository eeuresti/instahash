var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    session = require('express-session'),
    path = require('path'),
    keygen = require('keygenerator'),
    methodOverride = require('method-override'),
    app = express();

// views path
var views = path.join(process.cwd(), "views");

app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('_method'));

// create our session
app.use(
  session({
    secret: keygen._({specials: true}),
    resave: false,
    saveUninitialized: true
  })
);

// extending the `req` object to help manage sessions
app.use(function (req, res, next) {
  req.login = function (user) {
    req.session.userId = user._id;
  };
  // find the current user
  req.currentUser = function (cb) {
    db.User.
      findOne({ _id: req.session.userId },
      function (err, user) {
        req.user = user;
        cb(null, user);
      });
  };
  // logout the current user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };
  next();
});

// login route
app.get("/", function (req, res) {
  res.sendFile(path.join(views, "index.html"));
});

app.get("/login", function (req, res) {
  res.sendFile(path.join(views, "login.html"));
});

// signup route
app.get("/signup", function (req, res) {
  res.sendFile(path.join(views, "login.html"));
});



// where the user submits the sign-up form
app.post(["/users", "/signup"], function signup(req, res) {
  if (req.body.password.length < 6) {
  		res.status(400).send({message: "invalid password: Needs to be at least 8 characters"});
  	} else {
  		db.User.find({email: req.body.email}, function(err, found) {
  			if (found.length > 0) {
  				res.status(400).send({message: "email already exists"});
  			} else {
          var newUser = {
            email: req.body.email,
            password: req.body.password
          };
          db.User.createSecure(newUser.email, newUser.password, function(err, user) {
            req.login(user);
                res.redirect("/login");
          });
			}
		});
	}
});


// where the user submits the login form
app.post("/login", function(req, res) {
	var userData = {
		email: req.body.email,
		password: req.body.password
	};
	db.User.authenticate(userData.email, userData.password, function(err, user) {
		if (user !== undefined) {
			req.login(user);
			res.redirect("/login");
		} else {
			res.status(400).send({message: "bad username or password"});
		}
	});
});

// show the current user
app.get("/profile", function userShow(req, res) {
  req.currentUser(function (err, user) {
    if (user === null) {
      res.redirect("/signup");
    } else {
      res.send("Hello " + user.email);
    }
  });
});

// logout the user
app.delete(["/sessions", "/logout"], function(req, res) {
  req.logout();
  res.redirect("/");
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + listener.address().port);
});
