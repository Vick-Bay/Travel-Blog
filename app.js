var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Blog = require("./models/blog");
var ToDo = require("./models/toDo")
var Comment = require("./models/comment");
var User = require("./models/user")
// var seedDB = require("./seeds");
var path = require('path');

//Requiring routes
var commentRoutes = require("./routes/comments");
var blogRoutes = require("./routes/blogs");
var indexRoutes = require("./routes/index");
var toDoRoutes = require("./routes/toDos");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL || 'mongodb://localhost/blog');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(path.resolve('./public')));
app.use(methodOverride("_method"));
app.use(flash());


//seedDB(); //seed the database

app.locals.moment = require('moment'); //to add time instance to the blogs/comments

//Passport Configuration
app.use(require("express-session")({
	secret: "This website is good",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/toDos", toDoRoutes);




//starts the server
app.listen(process.env.PORT || 3000, process.env.IP, function() { 
  console.log('The Blog Server has started'); 
});