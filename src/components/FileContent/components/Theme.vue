<template>
  <div class="theme-container">
    <Transition name="theme">
      <div class="theme-button" @click="handleClick($event)" v-if="!isShowOptions">T</div>
      <div class="theme-options" v-else>
        <div
          :class="['option', index === currentIndex ? 'active' : ''].join(' ')"
          v-for="(item, index) in optionNames"
          :key="item"
          @click="changeOption($event, index)"
        >
          {{ item }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
const modules = import.meta.glob('/node_modules/highlight.js/styles/*.css', { query: '?' })
const keys = Object.keys(modules)
const optionNames = keys.map((item) => {
  return item.replace(/\/.*\/|\.css/g, '')
})
const index = localStorage.getItem('theme')
const currentIndex = ref(+index ?? 0)
const isShowOptions = ref(false)

function eventFunc() {
  isShowOptions.value = false
}
onMounted(() => {
  window.addEventListener('click', eventFunc)
})

onUnmounted(() => {
  window.removeEventListener('click', eventFunc)
})
watchEffect(() => {
  modules[keys[currentIndex.value]]()
})

function handleClick(e) {
  e.stopPropagation()
  isShowOptions.value = true
}
function changeOption(e, index) {
  e.stopPropagation()
  currentIndex.value = index
  localStorage.setItem('theme', index)
}
</script>

<style lang="scss" scoped>
.theme-container {
  position: fixed;
  top: 80px;
  right: 0px;
  .theme-button {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 25px;
    height: 40px;
    border-radius: 20px 0 0 20px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    font-weight: 700;
    background-color: #878787;
    cursor: pointer;
    padding-left: 10px;
    box-sizing: border-box;
    opacity: 0.5;
    transition: all 0.35s ease;
    &:hover {
      width: 45px;
      opacity: 1;
    }
  }
  .theme-options {
    height: 300px;
    overflow: overlay;
    background-color: #ffffff;
    /* margin-top: 10px; */
    padding: 0px 0px 20px;
    border-radius: 5px;
    z-index: 2;
    .option {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #cacaca;
      color: #424242;
      font-weight: 600;
      padding: 0 8px;
      cursor: pointer;
      &:hover {
        background-color: #878787;
        color: #fff;
      }
      &.active {
        background-color: #878787;
        color: #fff;
      }
    }
  }
}

.theme-enter-active,
.theme-leave-active {
  transition: all 0.35s ease;
}
.theme-enter-from,
.theme-leave-to {
  opacity: 0;
  transform: scale(0);
}
.theme-options,
.theme-button {
  transform-origin: right top;
}
</style>
