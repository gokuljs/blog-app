// importing packages from node-modules
var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expresssanitizer = require("express-sanitizer");
// var methodoverride = require("method-overide");


// database
// mongoose.connect("mongodb://localhoast/webproject");
mongoose.connect("mongodb://localhost:27017/webproject", { useNewUrlParser: true, useUnifiedTopology: true });

// app config
app.use(express.static(__dirname + '/public'));
console.log(__dirname) // gives the dir name which the project is currently working on 
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(expresssanitizer()); //only requirement is this should always comes after intinalizing body-parser
app.use(methodOverride("_method"));

// creating new schema for the blog 
var blogschema = new mongoose.Schema({
    title: String,
    img: String,
    body: String,
    // now below we are trying to string get present date and time 
    created: {
        type: Date,
        default: Date.now,
    },
});

// now once u create the schema then ur compile it into mongoose model
var blog = mongoose.model("blog", blogschema);

// test case creating one blog 
// blog.create({
//     title: "Test blog",
//     img: "https://images.unsplash.com/photo-1590240346717-f0af2b722502?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//     body: "those bike produced by indian companies called vibrae",
// });
// Restful Routes 
// home page 
app.get("/", function(req, res) {
    res.render("home")
});
// blog page which shows list of all blogs 
app.get("/blogs", function(req, res) {
    // index page is basically going to show all the blog pages according to the convention of restful routing 
    // so now if u want to show everything in the blog page u have to call all the contents from the database 
    blog.find({}, function(err, blogs) { // we are passing the data coming fromt he database 
        if (err) { //checking any error has occured or not 
            console.log("error occured !");
        } else {
            res.render("index", { blogs: blogs });

        }
    });
});
// creating one form to make new blogs
// new route
app.get("/blogs/new", function(req, res) {
    res.render("new")
});
// create route 
app.post("/blogs", function(req, res) {
    //in this post route it will receive content coming froom the form page 
    // we craeate new blog and push it to datbase
    console.log(req.body.blog);
    // applying santization
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    blog.create(req.body.blog, function(err, newblog) {
        if (err) {
            console.log("Error !");
            res.render("new")
        } else {
            res.redirect("/blogs")
        }
    })
});

// show route
app.get("/blogs/:id", function(req, res) {
    console.log(req.params.id);
    blog.findById(req.params.id, function(err, foundblog) {
        if (err) {
            console.log("error !");
            res.redirect("/blogs")
        } else {
            res.render("show", { blog: foundblog });
        }
    });
    // res.render("show");
});
// getting started with edit route 
app.get("/blogs/:id/edit", function(req, res) {
    console.log(req.params.id);
    blog.findById(req.params.id, function(err, foundblog) {
        if (err) {
            console.log("error !");
            res.redirect("/blogs")
        } else {
            // res.render("show", { blog: foundblog });
            res.render("edit", { blog: foundblog });

        }
    });

    // res.render("edit");
});
// update route
// method-overide is used for using put request because normal html form tag has only post and get request 
app.put("/blogs/:id", function(req, res) {
    // res.send("update route")
    // blog.findByIdAndUpdate(req.params.id,newdata,callback)
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
// delete route 
app.delete("/blogs/:id", function(req, res) {
    // res.send("destroy route")\
    blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log("error !");
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")

        }
    })
})

// getting started with authentication routes 
app.get("/register", function(req, res) {
    res.render("register");
})

app.get("/login", function(req, res) {
    res.render("login");
})

app.listen(4000, function(req, res) {
    console.log("port has started ")
});