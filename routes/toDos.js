var express = require("express");
var router = express.Router();
var ToDo = require("../models/toDo");
var middleware = require("../middleware");
var multer = require("multer");



//Index - show to do list

router.get("/", middleware.isLoggedIn, function(req, res) {

    ToDo.find({}, function(err, allToDos){
        if(err){
            console.log(err);
        } else {
           res.render("toDo/index",{toDos:allToDos});
        }
     });
});

//Create - add new to do item to DB

router.post("/", middleware.isLoggedIn, function(req, res){

    var date = req.body.date;

    var toDo = req.body.toDo;

    var newToDo = {date: date, toDo: toDo};

    ToDo.create(newToDo, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to the to do list page
            res.redirect("/toDos");
        }
    });
});

//Edit To Do Route

router.get("/:id/edit", function(req, res) {
  ToDo.findById(req.params.id, function(err, foundtoDo) {
    res.render("toDo/edit", { toDo: foundtoDo });
  });
});


//Update To Do Route

router.put("/:id", function(req, res) {

  if (req.body.status === 'checked') {
    req.body.toDo.isCompleted = true;
  } else {
    req.body.toDo.isCompleted = false;
  }

  ToDo.findByIdAndUpdate(req.params.id, req.body.toDo, function(err) {
    if (err) {
      res.redirect("/toDos");
    } else {
      res.redirect("/toDos");   
    }
  });
});


//Destroy To Do Route

router.delete("/:id", function(req, res) {
  //findByIdAndRemove
  ToDo.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/toDos");
    } else res.redirect("/toDos");
  });
});


module.exports = router;