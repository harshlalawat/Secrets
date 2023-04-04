require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});




const User = mongoose.model("User", userSchema);

app.get("/",function(req, res){
  res.render("home");
});


app.get("/login",function(req, res){
  res.render("login");
});


app.get("/register",function(req, res){
  res.render("register");
});


app.post("/register", function(req, res){
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)});
  user.save().then(function(){
    res.render("secrets");
  });
})


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({email: username}).then(function(result){
    if(result){
      if(result.password === password){
        res.render("secrets");
      }
    }else{
      console.log("Not a user");
    }
  })
})


app.listen(3000, function(){
  console.log("server is running on port 3000");
})
