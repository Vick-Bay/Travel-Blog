var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var path = require('path');


seedDB();


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(path.resolve('./public')));

//Schema Setup


//  Campground.create(
//  	{
//  		name:"Greatest Hill", image:"https:////live.staticflickr.com/552/19907026675_fc068975a2_m.jpg",

// 		description: "A large pile of granite"
		
//  	}, function(err, campground){
		
//  		if(err){
//  			console.log(err);
//  		} else {
//  			console.log("Newly created campground: ");
//  			console.log(campground);
//  		}
	
// });

// var campgrounds = [
// 		{name:"Salmon Creek", image:"https:////live.staticflickr.com/3720/10635166454_9ffe25efb7_m.jpg"},
// 		{name:"Granite Hill", image:"https:////live.staticflickr.com/552/19907026675_fc068975a2_m.jpg"},
// 		{name:"Mountain Goat's Hill", image:"https:////live.staticflickr.com/5567/15068323371_5d60da4e5d_m.jpg"}
// 	]

//for Node to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//This is to avoid writing *.ejs all the time
app.set("view engine", "ejs");

//sets the home page
app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	
	//Get all campgrounds from DB
	
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});	
});


app.post("/campgrounds", function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	
	//Create a new campground and save to DB
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});	
});

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res){
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", function(req, res){

	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){

	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);

					} else {
						campground.comments.push(comment);
						campground.save();
						res.redirect('/campgrounds/' + campground._id);
					}
				});
			};
		});

	//create new comment
	//connect new comment to campground
	//redirect compground show page

});


//starts the server
app.listen(3000, function() { 
  console.log('The YelpCamp Server has started'); 
});