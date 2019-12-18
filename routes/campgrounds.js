var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
	 	destination: './public/uploads',
	  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter}).single('image');

//Index - show all campgrounds

router.get("/", middleware.isLoggedIn, function(req, res) {
  if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    //Get all campgrounds from DB
    Campground.find({name: regex}, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {
          campgrounds: allCampgrounds,
          page: "campgrounds"
        });
      }
    });
  } else {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {
          campgrounds: allCampgrounds,
          page: "campgrounds"
        });
      }
    });
  }
});

//Create - add new campground to DB

router.post("/", middleware.isLoggedIn, function(req, res) {
	//get data from form and add to campgrounds array
		var author = {
    id: req.user._id,
    username: req.user.username
    };
    
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        var newCampground = {
          name: req.body.campground.name,
          image: `/uploads/${req.file.filename}`,
          description: req.body.campground.description,
          author: author
        };
        console.log(req.file.filename);
        Campground.create(newCampground, function (err, newlyCreated) {
          if (err) {
            console.log(err);
          } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
          }
        });
      }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});


//SHOW - show more info about one campground
router.get("/:id", middleware.isLoggedIn, function(req, res) {
  //find the campground with the provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that campground
        console.log(foundCampground);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//Update Campground Route

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy Campground Route

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  //findByIdAndRemove
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else res.redirect("/campgrounds");
  });
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
