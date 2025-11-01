const express = require("express");
const app = express ();
const path = require("path");


app.get("/", function(req,res){
    res.json({
        "hello world":"hi"
    })
})
module.exports=app