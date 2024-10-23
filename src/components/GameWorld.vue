<script setup lang="ts">
import { computed } from 'vue';
import type { Player } from '../types';

const props = defineProps<{
  players: Map<string, Player>;
  currentPlayerId: string | null;
}>();

const gridSize = 20;
const cellSize = computed(() => {
  // Make grid cells responsive on mobile
  return window.innerWidth < 768 ? Math.floor((window.innerWidth - 40) / gridSize) : 30;
});

const worldStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridSize}, ${cellSize.value}px)`,
  gap: '1px',
  backgroundColor: '#333',
  padding: '1px',
  maxWidth: '100%',
  overflowX: 'auto'
}));
</script>

<template>
  <div class="world-wrapper">
    <div class="world" :style="worldStyle">
      <template v-for="y in gridSize" :key="y">
        <template v-for="x in gridSize" :key="`${x}-${y}`">
          <div 
            class="cell"
            :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
          >
            <template v-for="[id, player] in players" :key="id">
              <div 
                v-if="player.x === x - 1 && player.y === y - 1"
                class="player"
                :class="{ 'current-player': id === currentPlayerId }"
                :style="{ 
                  backgroundColor: player.color,
                  width: `${cellSize - 4}px`,
                  height: `${cellSize - 4}px`
                }"
              />
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.world-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: center;
}

.world {
  border: 2px solid #666;
  border-radius: 4px;
}

.cell {
  background-color: #1a1a1a;
  position: relative;
}

.player {
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.current-player {
  border: 2px solid #fff;
}

@media (max-width: 768px) {
  .world {
    margin: 0 auto;
  }
}
</style>