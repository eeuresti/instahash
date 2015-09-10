var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/instahash");

mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "mongodb://localhost/instahash" );

module.exports.User = require("./user");
