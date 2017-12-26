var mongoose = require("mongoose");


var postSchema = new mongoose.Schema({
    status : String,
    image : String,
    time : {type: Date, default:Date.now()}
});


module.exports = mongoose.model("Post", postSchema);
