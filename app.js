// importing packages from node-modules

var express = require("express");
var app = express();

// app config
app.use(express.static(__dirname + '/public'));
console.log(__dirname) // gives the dir name which the project is currently working on 
app.set('view engine', 'ejs');
// home page 
app.get("/", function(req, res) {
    res.render("home")
});
// blog page which shows list of all blogs 
app.get("/blogs", function(req, res) {
    res.render("index")
});
// creating one form to make new blogs
app.get("/blogs/new", function(req, res) {
    res.render("new")
})

app.listen(4000, function(req, res) {
    console.log("port has started ")
})