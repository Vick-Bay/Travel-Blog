var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//sets the home page
router.get("/", function(req, res) {
  res.render("landing");
});

//Auth Routes

// //root route
// router.get("/register", function(req, res) {
//   res.render("register", { page: "register" });
// });

// //handle sign up logic
// router.post("/register", function(req, res) {
//   var newUser = new User({ username: req.body.username });
//   User.register(newUser, req.body.password, function(err, user) {
//     if (err) {
//       console.log(err);
//       return res.render("register", { error: err.message });
//     }
//     passport.authenticate("local")(req, res, function() {
//       req.flash(
//         "success",
//         "Successfully Signed Up! Nice to meet you " + req.body.username
//       );
//       res.redirect("/blogs");
//     });
//   });
// });

//show login form
router.get("/login", function(req, res) {
  res.render("login");
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

//Logout route

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/blogs");
});

module.exports = router;
