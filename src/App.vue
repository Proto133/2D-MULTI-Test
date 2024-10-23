<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GameWorld from './components/GameWorld.vue';
import VirtualControls from './components/VirtualControls.vue';
import { useWebSocket } from './composables/useWebSocket';
import type { WorldState, Player } from './types';

const { 
  connect, 
  disconnect, 
  sendMessage, 
  playerId,
  players
} = useWebSocket();

const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
  if (!playerId.value) return;
  
  const currentPlayer = players.value.get(playerId.value);
  if (!currentPlayer) return;

  let newX = currentPlayer.x;
  let newY = currentPlayer.y;

  switch (direction) {
    case 'up':
      newY = Math.max(0, currentPlayer.y - 1);
      break;
    case 'down':
      newY = Math.min(19, currentPlayer.y + 1);
      break;
    case 'left':
      newX = Math.max(0, currentPlayer.x - 1);
      break;
    case 'right':
      newX = Math.min(19, currentPlayer.x + 1);
      break;
  }

  if (newX !== currentPlayer.x || newY !== currentPlayer.y) {
    sendMessage({
      type: 'move',
      x: newX,
      y: newY
    });
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  const keyToDirection = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  } as const;

  const direction = keyToDirection[e.key as keyof typeof keyToDirection];
  if (direction) {
    movePlayer(direction);
  }
};

onMounted(() => {
  connect();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  disconnect();
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="game-container">
    <h1>2D Multiplayer World</h1>
    <GameWorld :players="players" :current-player-id="playerId" />
    <div class="instructions">
      <p>Use arrow keys to move</p>
      <p>Connected players: {{ players.size }}</p>
    </div>
    <VirtualControls @move="movePlayer" />
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 1rem 0.5rem calc(200px + 1rem) 0.5rem; /* Extra padding for virtual controls */
}

.instructions {
  margin-top: 0.5rem;
  text-align: center;
}

@media (max-width: 768px) {
  .instructions p:first-child {
    display: none; /* Hide keyboard instructions on mobile */
  }
  
  .game-container {
    padding-bottom: calc(200px + 0.5rem);
  }
}
</style>