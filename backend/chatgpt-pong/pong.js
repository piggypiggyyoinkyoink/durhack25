const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const connectBtn = document.getElementById('connectBtn');
const statusEl = document.getElementById('status');

let ws;
const PADDLE_HEIGHT = 80;

connectBtn.addEventListener('click', connectToPong);

let params = new URLSearchParams(document.location.search);
let userId = params.get("name");
const conversationId = 'my_conversation2';
const conversation2Id = "test3";
//handle submitting messages from Conversation 1
let form = document.getElementById("form1");
form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    let inputField = document.getElementById("inp1")
    let msg = inputField.value
    document.getElementById("inp1").value = "";

    console.log(msg);
    if(msg == "u"){
      sendInput("left","up", true)
    }else if (msg == "d"){
      sendInput("left","down", true)

    }
    const data = JSON.stringify({
        "message": msg,
        "conversation":conversationId,
        "user":userId
    });
    const response = await fetch("/pong/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
    });
    if (response.ok){
        document.getElementById("inp1").value = "";
    }
});

//handle submitting messages from Conversation 2:
let form2 = document.getElementById("form2");
form2.addEventListener("submit", async (e)=>{
    e.preventDefault();
    let inputField = document.getElementById("inp2")
    let msg = inputField.value
    console.log(msg);
    if(msg == "u"){
      sendInput("right","up", true)
    }else if (msg == "d"){
      sendInput("right","down", true)

    }
    const data = JSON.stringify({
        "message": msg,
        "conversation":conversation2Id,
        "user":userId
    });
    const response = await fetch("/pong/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
    });
    if (response.ok){
        document.getElementById("inp2").value = "";
    }
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
      statusEl.textContent = 'Press W/S for left paddle, ↑/↓ for right!';
    }

    if (msg.type === 'state') {
      drawGame(msg.state);
    }
  };

  ws.onclose = () => {
    statusEl.textContent = 'Disconnected';
  };
}
/*
// track keypresses
const keys = {};
window.addEventListener('keydown', e => {
  if (keys[e.key]) return;
  keys[e.key] = true;
  sendKeyChange(e.key, true);
});
window.addEventListener('keyup', e => {
  keys[e.key] = false;
  sendKeyChange(e.key, false);
});*/

function sendInput(side, dir, pressed) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  const msg = {
    type: pressed ? 'input' : 'inputEnd',
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
