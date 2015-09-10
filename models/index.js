var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/instahash");

mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "YOUR OWN LOCAL URL HERE" );

module.exports.User = require("./user");
