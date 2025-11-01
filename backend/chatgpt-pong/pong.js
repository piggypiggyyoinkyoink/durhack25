const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const connectBtn = document.getElementById('connectBtn');
const statusEl = document.getElementById('status');

let ws;
let role = 'spectator';
let playerIndex = null;
const PADDLE_HEIGHT = 80;

connectBtn.addEventListener('click', connectToPong);

function connectToPong() {
  const wsUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/pong';
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    statusEl.textContent = 'Connected — waiting for assignment...';
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === 'welcome') {
      role = msg.role;
      playerIndex = msg.playerIndex;
      canvas.width = msg.width;
      canvas.height = msg.height;

      if (role === 'player') {
        statusEl.textContent = `You are Player ${playerIndex + 1}`;
      } else {
        statusEl.textContent = `Spectating the game`;
      }
    }

    if (msg.type === 'state') {
      drawGame(msg.state);
    }
  };

  ws.onclose = () => {
    statusEl.textContent = 'Disconnected';
  };
}

// send paddle position updates
function sendPaddle(y) {
  if (role === 'player' && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'paddle', y }));
  }
}

// Mouse control
canvas.addEventListener('mousemove', (e) => {
  if (role !== 'player') return;
  const rect = canvas.getBoundingClientRect();
  const y = e.clientY - rect.top - PADDLE_HEIGHT / 2;
  sendPaddle(y);
});

// Keyboard control
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

setInterval(() => {
  if (role !== 'player') return;
  let y = 0;
  if (keys['w'] || keys['ArrowUp']) y -= 8;
  if (keys['s'] || keys['ArrowDown']) y += 8;

  if (y !== 0) {
    sendPaddle(y);
  }
}, 16);

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
