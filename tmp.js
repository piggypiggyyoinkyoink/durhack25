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
      } else if (data.type === 'inputEnd') {
        if (data.side === 'left') {
          leftInputs.up -= data.up ? 1 : 0;
          leftInputs.down -= data.down ? 1 : 0;
        } else if (data.side === 'right') {
          rightInputs.up -= data.up ? 1 : 0;
          rightInputs.down -= data.down ? 1 : 0;
        }
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

