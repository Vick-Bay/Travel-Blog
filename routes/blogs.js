var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
var imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter }).single(
  "image"
);

//Index - show all blogs

router.get("/", middleware.isLoggedIn, function(req, res) {
  //search feature
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    //Get all blogs from DB after search
    Blog.find({ name: regex })
      .populate("comments")
      .exec(function(err, allBlogs) {
        if (err) {
          console.log(err);
        } else {
          res.render("blogs/index", { blogs: allBlogs });
        }
      });
  } else {
    //Get all blogs from DB
    Blog.find({})
      .populate("comments")
      .exec(function(err, allBlogs) {
        if (err) {
          console.log(err);
        } else {
          res.render("blogs/index", { blogs: allBlogs });
        }
      });
  }
});

//Create - add new blog to DB

router.post("/", middleware.isLoggedIn, function(req, res) {
  //get data from form and add to blogs array
  var author = {
    id: req.user._id,
    username: req.user.username
  };

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
    } else {
      var newBlog = {
        name: req.body.blog.name,
        image: `/uploads/${req.file.filename}`,
        description: req.body.blog.description,
        author: author
      };
      Blog.create(newBlog, function(err, newlyCreated) {
        if (err) {
          console.log(err);
        } else {
          //redirect back to blogs page
          res.redirect("/blogs");
        }
      });
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("blogs/new");
});

//SHOW - show more info about one blog
router.get("/:id", middleware.isLoggedIn, function(req, res) {
  //find the blog with the provided ID
  Blog.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundBlog) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that blog
        res.render("blogs/show", { blog: foundBlog });
      }
    });
});

//Edit Blog Route
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    res.render("blogs/edit", { blog: foundBlog });
  });
});

//Update Blog Route

router.put("/:id", middleware.checkBlogOwnership, function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function( err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Destroy Blog Route

router.delete("/:id", middleware.checkBlogOwnership, function(req, res) {
  //findByIdAndRemove
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else res.redirect("/blogs");
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;