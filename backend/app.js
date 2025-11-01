const express = require("express");
const app = express ();
const jwt = require("jsonwebtoken")
const path = require("path");

app.use(express.static("../frontend"));
app.use(express.json());



module.exports=app;

app.get('/api/user/:username', function (req,resp){

    let user = req.params.username;
    console.log("USERID: " + user)
    // CALL TO CHECK EXISTS
    check = true; // Placeholder for actual check
    resp.json({exists: false});

});


//User check
//Converstion check
//Message passthrough

//Rooms games
