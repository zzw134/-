<template>
  <div class="container">
    <span class="line" v-for="n in lineNum" :key="n">{{ n }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  lineNum: {
    type: Number,
    default: 1
  }
})
</script>

<style lang="scss" scoped>
.container {
  background-color: #1e1e1e;
  color: #858585;
  margin: 0 20px 0 15px;
  .line {
    display: flex;
    justify-content: flex-end;
    height: 25px;
    line-height: 25px;
  }
}
</style>
