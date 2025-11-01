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

//Rooms games








//chatgpt pong

app.get("/pong", (req, res) => {
  res.sendFile(path.join(__dirname, "chatgpt-pong/pong.html"));
});


const port = process.env.PORT || 8080;



// --- PONG GAME SECTION ---
const WIDTH = 800;
const HEIGHT = 480;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 8;
const TICK_RATE = 60;

let players = [null, null];
let spectators = [];

let gameState = {
  ball: { x: WIDTH/2, y: HEIGHT/2, vx: 250, vy: 150 },
  paddles: [HEIGHT/2 - PADDLE_HEIGHT/2, HEIGHT/2 - PADDLE_HEIGHT/2],
  scores: [0, 0]
};

function resetBall(direction = 1) {
  gameState.ball.x = WIDTH/2;
  gameState.ball.y = HEIGHT/2;
  gameState.ball.vx = 250 * direction;
  gameState.ball.vy = (Math.random() * 200 - 100);
}

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  spectators.concat(players).forEach(ws => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(msg);
  });
}

// Attach Pong-specific WebSocket handling
wss.on('connection', (ws, req) => {
  // only handle connections that go to /pong
  if (req.url !== '/pong') return;

  let role = 'spectator';
  let index = null;

  if (!players[0]) { players[0] = ws; role = 'player'; index = 0; }
  else if (!players[1]) { players[1] = ws; role = 'player'; index = 1; }
  else spectators.push(ws);

  ws.send(JSON.stringify({
    type: 'welcome',
    role,
    playerIndex: index,
    width: WIDTH,
    height: HEIGHT
  }));

  console.log(`Pong: ${role}${index !== null ? ' ' + (index + 1) : ''} connected`);

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'paddle' && role === 'player') {
        const y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, data.y));
        gameState.paddles[index] = y;
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on('close', () => {
    console.log('Pong client disconnected');
    if (role === 'player') players[index] = null;
    else spectators = spectators.filter(s => s !== ws);
  });
});

// Pong game loop (runs globally)
setInterval(() => {
  const s = gameState;
  const dt = 1 / TICK_RATE;

  s.ball.x += s.ball.vx * dt;
  s.ball.y += s.ball.vy * dt;

  if (s.ball.y < 0 || s.ball.y > HEIGHT) s.ball.vy *= -1;

  // left paddle
  if (s.ball.x - BALL_RADIUS < PADDLE_WIDTH) {
    const py = s.paddles[0];
    if (s.ball.y >= py && s.ball.y <= py + PADDLE_HEIGHT) {
      s.ball.vx = Math.abs(s.ball.vx);
    }
  }

  // right paddle
  if (s.ball.x + BALL_RADIUS > WIDTH - PADDLE_WIDTH) {
    const py = s.paddles[1];
    if (s.ball.y >= py && s.ball.y <= py + PADDLE_HEIGHT) {
      s.ball.vx = -Math.abs(s.ball.vx);
    }
  }

  // scoring
  if (s.ball.x < 0) {
    s.scores[1]++;
    resetBall(1);
  } else if (s.ball.x > WIDTH) {
    s.scores[0]++;
    resetBall(-1);
  }

  broadcast({ type: 'state', state: s });
}, 1000 / TICK_RATE);


server.listen(port, () => console.log('Server running on port', port));
//module.exports=app;