const express = require("express");
const talkJS = require("@talkjs/core");
const app = express ();
const http = require("http");
const WebSocket = require('ws');
const path = require("path");

const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });









app.use(express.static(path.join('./chatgpt-pong')));
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









//chatgpt pong
app.post("/pong/sendmessage", async function(req,res){
    
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
        //console.log(sendMessage);
        if (sendMessage.ok){

            res.sendStatus(200);
        }else{
            res.send(500)
        }
    }else{
        res.send(500)
    }
})



app.get("/pong", (req, res) => {
  res.sendFile(path.join(__dirname, "chatgpt-pong/pong.html"));
});


const port = process.env.PORT || 8080;




let gameState = {
  paddles: [200, 200],
  ball: { x: 400, y: 240, vx: 4, vy: 3 },
  scores: [0, 0],
};

const WIDTH = 800;
const HEIGHT = 480;
const PADDLE_HEIGHT = 80;

let connectedClients = 0;
let gameInterval = null;

// Helper: broadcast to all clients
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// Update game loop
function updateGame() {
  const b = gameState.ball;
  b.x += b.vx;
  b.y += b.vy;

  // Wall bounce
  if (b.y < 0 || b.y > HEIGHT) b.vy *= -1;

  // Left paddle
  if (
    b.x < 10 &&
    b.y > gameState.paddles[0] &&
    b.y < gameState.paddles[0] + PADDLE_HEIGHT
  ) {
    b.vx *= -1;
  }

  // Right paddle
  if (
    b.x > WIDTH - 10 &&
    b.y > gameState.paddles[1] &&
    b.y < gameState.paddles[1] + PADDLE_HEIGHT
  ) {
    b.vx *= -1;
  }

  // Score
  if (b.x < 0) {
    gameState.scores[1]++;
    resetBall();
  }
  if (b.x > WIDTH) {
    gameState.scores[0]++;
    resetBall();
  }

  broadcast({ type: "state", state: gameState });
}

function resetBall() {
  gameState.ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: Math.random() > 0.5 ? 4 : -4,
    vy: Math.random() > 0.5 ? 3 : -3,
  };
}

function startGameLoop() {
  if (gameInterval) return;
  console.log("🎮 Game loop started");
  gameState.scores = [0,0]
  gameInterval = setInterval(updateGame, 1000 / 60);
}

function stopGameLoop() {
  if (!gameInterval) return;
  clearInterval(gameInterval);
  gameInterval = null;
  console.log("🛑 Game loop stopped (no players connected)");
}

// Handle WebSocket connections
wss.on("connection", (ws, req) => {
  // Only handle connections for /pong
  if (req.url !== "/pong") return;

  connectedClients++;
  console.log(`👥 Client connected (${connectedClients} total)`);

  // Start loop if not already running
  startGameLoop();

  // Send welcome message with game size
  ws.send(
    JSON.stringify({
      type: "welcome",
      width: WIDTH,
      height: HEIGHT,
      state: gameState,
    })
  );

  // Handle incoming input from clients
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'input') {
          console.log(data)
    
        if (data.side === 'left') {
            if (data.down){
                gameState.paddles[0]+=40;
            }else{
                gameState.paddles[0]-=40;
            }
        } else if (data.side === 'right') {
            if (data.down){
                gameState.paddles[1]+=40;
            }else{
                gameState.paddles[1]-=40;
            }

        }
      } else if (data.type === 'reverse') {
        gameState.ball.vx *= -1;
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on("close", () => {
    connectedClients--;
    console.log(`👋 Client disconnected (${connectedClients} left)`);

    if (connectedClients === 0) {
      stopGameLoop();
    }
  });
});



server.listen(port, () => console.log('Server running on port', port));
//module.exports=app;