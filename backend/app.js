const express = require("express");
const jwt = require("jsonwebtoken")
const app = express ();
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.static("../frontend"));
app.use(express.json());

app.use(bodyParser.json());

app.post("/sendmessage", function(req,res){
    
    console.log(req.body);//contains message text, user ID and conversation ID.
    res.sendStatus(200);
})

module.exports=app
