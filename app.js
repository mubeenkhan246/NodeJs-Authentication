var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var Post = require("./models/post");
var port = 4000;

// Connect to local MongoDB instance...
mongoose.connect("mongodb://localhost/auth");

// Profile Posts...
var posts = [
    {
        status : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolorum impedit ipsum iusto, nihil nisi ut. Amet doloremque, ea eligendi hic, illum ipsum, maiores nesciunt non officia perferendis quam reprehenderit",
        image : "/img/log-in-background.jpeg"
    },
    {
        status : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolorum impedit ipsum iusto, nihil nisi ut. Amet doloremque, ea eligendi hic, illum ipsum, maiores nesciunt non officia perferendis quam reprehenderit",
        image : "/img/log-in-background.jpeg"
    },
    {
        status : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolorum impedit ipsum iusto, nihil nisi ut. Amet doloremque, ea eligendi hic, illum ipsum, maiores nesciunt non officia perferendis quam reprehenderit",
        image : "/img/log-in-background.jpeg"
    }
]

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true }));

app.use(require("express-session")({
    secret : "Meen",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.use(new localStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, done) {
    res.locals.currentUser = req.user;
    done();
});

// Main Home Page...
app.get("/", function (req, res) {
    var status = req.body.status;
    var image = req.body.image;
    var newPost = { status : status, image: image };
    Post.find({}, function(err, data){
       if (err) {
           console.log(err);
       } else {
           console.log(data);
       }
    });
    res.render("index", {posts : posts});
});

app.post("/", function (req, res) {
    var status = req.body.Userstatus;
    var image = req.body.Userimage;
    var time = req.body.time;
    var newPost = { status : status, image: image, time : time };
    Post.create(newPost, function (err, postImage) {
        if (err) {
            console.log(err)
        } else {
            console.log(postImage);
            res.render("index", {posts : postImage})
        }
    });

});

// User Sign Up ...
app.get("/sign-up", function (req, res) {
    res.render("sign-up");
});
app.post("/sign-up", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({name : name, email : email, username : username}), password, function (err, user) {
        if (err) {
            console.log(err);
        }
        passport.authenticate("local")(req, res, function () {
                res.redirect("/");
        });
        console.log(user)
    })
});


// Sign in Page ...
app.get("/sign-in", function (req, res) {
    res.render("log-in")
});
app.post("/sign-in", passport.authenticate("local", {
    successRedirect : "/",
    failureRedirect : "/sign-in"
}), function (req, res) {

    if (successRedirect) {
        User.findById(req.params.id, function (err, user) {
            if (err){
                console.log(err);
            } else {
                console.log(user);
                res.render("index", { currentUser : user});
            }
        });
    }
});

// User Logout ...
app.get("/log-out", function (req, res) {
    req.logout();
    res.redirect("/sign-in");
});
// listen
app.listen(port, function () {
    console.log("Server Is Listening On Port :" + port)
});