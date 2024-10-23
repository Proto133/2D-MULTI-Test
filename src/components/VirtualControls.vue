<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'move', direction: 'up' | 'down' | 'left' | 'right'): void
}>();

const buttonPressed = ref<string | null>(null);

const handleTouchStart = (direction: 'up' | 'down' | 'left' | 'right') => {
  buttonPressed.value = direction;
  emit('move', direction);
};

const handleTouchEnd = () => {
  buttonPressed.value = null;
};
</script>

<template>
  <div class="virtual-controls">
    <div class="d-pad">
      <button
        class="d-pad-button up"
        :class="{ active: buttonPressed === 'up' }"
        @touchstart.prevent="handleTouchStart('up')"
        @touchend.prevent="handleTouchEnd"
        aria-label="Up"
      >
        ▲
      </button>
      <div class="middle-row">
        <button
          class="d-pad-button left"
          :class="{ active: buttonPressed === 'left' }"
          @touchstart.prevent="handleTouchStart('left')"
          @touchend.prevent="handleTouchEnd"
          aria-label="Left"
        >
          ◄
        </button>
        <div class="d-pad-center"></div>
        <button
          class="d-pad-button right"
          :class="{ active: buttonPressed === 'right' }"
          @touchstart.prevent="handleTouchStart('right')"
          @touchend.prevent="handleTouchEnd"
          aria-label="Right"
        >
          ►
        </button>
      </div>
      <button
        class="d-pad-button down"
        :class="{ active: buttonPressed === 'down' }"
        @touchstart.prevent="handleTouchStart('down')"
        @touchend.prevent="handleTouchEnd"
        aria-label="Down"
      >
        ▼
      </button>
    </div>
  </div>
</template>

<style scoped>
.virtual-controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: none; /* Hidden by default, shown on mobile */
}

@media (max-width: 768px) {
  .virtual-controls {
    display: block;
  }
}

.d-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.middle-row {
  display: flex;
  gap: 5px;
  align-items: center;
}

.d-pad-button {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.d-pad-button.active {
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0.95);
}

.d-pad-center {
  width: 60px;
  height: 60px;
}
</style>