// importing packages from node-modules

var express = require("express");
var app = express();

// app config
app.use(express.static(__dirname + '/public'));
console.log(__dirname) // gives the dir name which the project is currently working on 
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.render("home")
});
app.get("/blogs", function(req, res) {
    res.render("index")
})


app.listen(4000, function(req, res) {
    console.log("port has started ")
})