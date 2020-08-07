// importing packages from node-modules
var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");


// database
// mongoose.connect("mongodb://localhoast/webproject");
mongoose.connect("mongodb://localhost:27017/webproject", { useNewUrlParser: true, useUnifiedTopology: true });

// app config
app.use(express.static(__dirname + '/public'));
console.log(__dirname) // gives the dir name which the project is currently working on 
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));

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
    })
});
// creating one form to make new blogs
app.get("/blogs/new", function(req, res) {
    res.render("new")
});

app.listen(4000, function(req, res) {
    console.log("port has started ")
})