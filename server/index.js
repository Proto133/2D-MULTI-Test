import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ 
  port: PORT,
  // Handle deployment behind proxy
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024
  }
});

// Store world state
const worldState = {
  players: new Map()
};

wss.on('connection', (ws) => {
  const playerId = randomUUID();
  
  // Initialize player position
  worldState.players.set(playerId, {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  });

  // Send initial state to new player
  ws.send(JSON.stringify({
    type: 'init',
    id: playerId,
    worldState: {
      players: Object.fromEntries(worldState.players)
    }
  }));

  // Broadcast new player to others
  broadcast({
    type: 'playerJoined',
    id: playerId,
    player: worldState.players.get(playerId)
  }, ws);

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    
    if (message.type === 'move') {
      const player = worldState.players.get(playerId);
      if (player) {
        player.x = message.x;
        player.y = message.y;
        
        broadcast({
          type: 'playerMoved',
          id: playerId,
          x: player.x,
          y: player.y
        });
      }
    }
  });

  ws.on('close', () => {
    worldState.players.delete(playerId);
    broadcast({
      type: 'playerLeft',
      id: playerId
    });
  });
});

function broadcast(message, exclude = null) {
  wss.clients.forEach((client) => {
    if (client !== exclude && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

console.log(`WebSocket server running on port ${PORT}`);