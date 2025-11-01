const express = require("express");
const talkJS = require("@talkjs/core");
const app = express ();
const jwt = require("jsonwebtoken")
const path = require("path");

app.use(express.static("../frontend"));
app.use(express.json());

const session = getTalkSession({
    // @ts-ignore
    host: 'durhack.talkjs.com',
    appId: 'tKAe9pYx',
    userId,
});

module.exports=app;

//User check
app.get('/api/user/:username', function (req,resp){

    let user = req.params.username;
    console.log("USERID: " + user)
    // CALL TO CHECK EXISTS
    session.currentUser.createIfNotExists({ name: user });
    check = true;
    resp.json({exists: check});

});


//Converstion check
app.get('api/conversation/:converstaionName'), function (req,resp){
    let conversation = req.params.converstaionName;
    
}

//Message passthrough

//Rooms games
