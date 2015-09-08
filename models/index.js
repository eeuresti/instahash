var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/instahash");

module.exports.User = require("./user");
