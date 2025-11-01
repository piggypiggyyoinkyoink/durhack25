const express = require("express");
const talkJS = require("@talkjs/core");
const app = express ();
const jwt = require("jsonwebtoken")
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.static("../frontend"));
app.use(express.json());

app.use(bodyParser.json());


/*
async function a(){
    let a = await fetch('https://api.durhack.talkjs.com/v1/tKAe9pYx', {
        headers: {
    Authorization: 'Bearer sk_test_j3dBD6Y7qNNd4P5Ye9I18QgLFbqIDh2m',
    },
    });
    console.log(a);
    }
a();*/
app.post("/sendmessage", async function(req,res){
    
    console.log(req.body);//contains message text, user ID and conversation ID.
    const conversationId = req.body.conversation;
    const userId = req.body.user;
    const messageText = req.body.message;
    const registerConversation = await fetch(`https://api.durhack.talkjs.com/v1/tKAe9pYx/conversations/${conversationId}`, {
        method: "PUT",
        headers: {
            Authorization: 'Bearer sk_test_j3dBD6Y7qNNd4P5Ye9I18QgLFbqIDh2m',
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "participants" : [userId]
        })
    });
    if (registerConversation.ok){
        const sendMessage = await fetch(`https://api.durhack.talkjs.com/v1/tKAe9pYx/conversations/${conversationId}/messages`,{
            method: "POST",
        headers: {
            Authorization: 'Bearer sk_test_j3dBD6Y7qNNd4P5Ye9I18QgLFbqIDh2m',
            "Content-Type" : "application/json"
        },
        body:JSON.stringify([{
            "text": `${messageText}`,
            "sender": `${userId}`,
            "type": "UserMessage"
        }])
        })
        console.log(sendMessage);
        if (sendMessage.ok){

            res.sendStatus(200);
        }else{
            res.send(500)
        }
    }else{
        res.send(500)
    }
})

//User check
app.get('/api/user/:username', function (req,resp){
    
    let user = req.params.username;
    console.log("USERID: " + user)
    // CALL TO CHECK EXISTS
    var session = talkJS.getTalkSession({
        // @ts-ignore
        host: 'durhack.talkjs.com',
        appId: 'tKAe9pYx',
        userId: user
    });
    
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

module.exports=app;