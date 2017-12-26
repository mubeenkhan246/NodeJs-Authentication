var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name : String,
    email : String,
    username : String,
    password : { type : String,},
    time : {type: Date, default: Date.now()}
});


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);