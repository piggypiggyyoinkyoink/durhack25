const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const connectBtn = document.getElementById('connectBtn');
const backBtn = document.getElementById("backBtn");
const statusEl = document.getElementById('status');

let ws;
const PADDLE_HEIGHT = 80;
let params = new URLSearchParams(document.location.search);
let userId = params.get("name");
if(!userId || userId == null){
  window.location.href="http://"+location.host
}

connectBtn.addEventListener('click', connectToPong);
backBtn.addEventListener("click", function(){
  window.location.href = "http://"+location.host + `/games.html?name=${userId}`
})
const conversationId = 'my_conversation2';
const conversation2Id = "test3";
//handle submitting messages from Conversation 1
let form = document.getElementById("form1");
form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    let inputField = document.getElementById("inp1")
    let msg = inputField.value
    let msg2 = msg.toLowerCase()

    document.getElementById("inp1").value = "";

    console.log(msg);
    if(msg2 == "u"){
      sendInput("left","up", "input")
    }else if (msg2 == "d"){
      sendInput("left","down", "input")

    }
    else if (msg2=="r"){
      sendInput("dingus", "dingus", "reverse")
    }else if (msg2=="b"){
      sendInput("dingus", "dingus", "rotate")
    }else if (msg2=="s"){
      sendInput("dingus","dingus", "slow")
    }else if (msg2=="z"){
      sendInput("dingus","dingus","zoom")
    }
    const data = JSON.stringify({
        "message": msg,
        "conversation":conversationId,
        "user":userId
    });
    await fetch("/pong/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
    });
});

//handle submitting messages from Conversation 2:
let form2 = document.getElementById("form2");
form2.addEventListener("submit", async (e)=>{
    e.preventDefault();
    let inputField = document.getElementById("inp2")
    let msg = inputField.value
    let msg2 = msg.toLowerCase()
    document.getElementById("inp2").value = "";

    console.log(msg);
    if(msg2 == "u"){
      sendInput("right","up", "input")
    }else if (msg2 == "d"){
      sendInput("right","down", "input")

    }else if (msg2=="r"){
      sendInput("dingus", "dingus", "reverse")
    }else if (msg2=="b"){
      sendInput("dingus", "dingus", "rotate")
    }else if (msg2=="s"){
      sendInput("dingus","dingus", "slow")
    }else if (msg2=="z"){
      sendInput("dingus","dingus","zoom")
    }
    const data = JSON.stringify({
        "message": msg,
        "conversation":conversation2Id,
        "user":userId
    });
    await fetch("/pong/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
    });
});

function connectToPong() {
  const wsUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/pong';
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    statusEl.textContent = 'Connected — chaos awaits!';
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === 'welcome') {
      canvas.width = msg.width;
      canvas.height = msg.height;
      statusEl.textContent = 'Type "u" for up and "d" for down. Other letters may do different things....';
    }

    if (msg.type === 'state') {
      drawGame(msg.state);
    }
    if (msg.type == "scores"){
      if (msg.p1 > msg.p2){

        statusEl.textContent = "Team 1 wins. Press the button to play again"
      }else{
        statusEl.textContent="Team 2 wins. Press the button to play again"
      }
      
    }
  };

  ws.onclose = () => {
    statusEl.textContent = 'Disconnected';
  };
}

function sendInput(side, dir, type) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  const msg = {
    type: type,
    up: dir == 'up',
    down: dir == 'down',
    side
  };
  ws.send(JSON.stringify(msg));
}

function drawGame(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // middle dashed line
  ctx.fillStyle = '#222';
  for (let i = 0; i < canvas.height; i += 20) {
    ctx.fillRect(canvas.width / 2 - 2, i, 4, 10);
  }

  // paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, state.paddles[0], 10, PADDLE_HEIGHT);
  ctx.fillRect(canvas.width - 10, state.paddles[1], 10, PADDLE_HEIGHT);

  // ball
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, 8, 0, Math.PI * 2);
  ctx.fill();

  // scores
  ctx.font = '32px monospace';
  ctx.fillText(state.scores[0], canvas.width / 2 - 60, 50);
  ctx.fillText(state.scores[1], canvas.width / 2 + 36, 50);
}
