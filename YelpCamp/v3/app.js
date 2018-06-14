var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment");
    
mongoose.connect("mongodb://localhost/yelp_camp");    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB(); //clears the db 

app.get("/", function(req, res){
    res.render("landing");    
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from the database
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }   else{
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    //get data from form and add to campground array or now DB
    
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};  //we made this js object because our array is having js objects...
    //create a new campground and save it to the database
    Campground.create(newCampground, function(err, newlyCreatedCampground){
        if(err){
            console.log(err);
        }   else{
               //redirect back to campgrounds page
               res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");    
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    // find the campground with provided ID
    // Campground.findById(id, callback)
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       }  else{
           console.log(foundCampground);
            // render show template with that campground
            res.render("show", {campground: foundCampground});
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});