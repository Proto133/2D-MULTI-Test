import { ref, onUnmounted } from 'vue';
import type { Player } from '../types';

export function useWebSocket() {
  const ws = ref<WebSocket | null>(null);
  const playerId = ref<string | null>(null);
  const players = ref<Map<string, Player>>(new Map());

  const connect = () => {
    // Use environment variable for WebSocket URL or fall back to default
    const WS_URL = import.meta.env.VITE_WS_URL || window.location.origin.replace(/^http/, 'ws');
    const wsUrl = WS_URL.includes('://') ? WS_URL : `${WS_URL}:3000`;
    
    ws.value = new WebSocket(wsUrl);

    ws.value.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'init':
          playerId.value = message.id;
          players.value = new Map(Object.entries(message.worldState.players));
          break;

        case 'playerJoined':
          players.value.set(message.id, message.player);
          break;

        case 'playerLeft':
          players.value.delete(message.id);
          break;

        case 'playerMoved':
          const player = players.value.get(message.id);
          if (player) {
            player.x = message.x;
            player.y = message.y;
          }
          break;
      }
    };

    ws.value.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after a delay
      setTimeout(connect, 3000);
    };

    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
  };

  const sendMessage = (message: any) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message));
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    connect,
    disconnect,
    sendMessage,
    playerId,
    players
  };
}