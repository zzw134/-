<template>
  <div class="content-container">
    <div class="content-main" v-if="selectedFiles.length">
      <div class="file-bar">
        <FileBar />
      </div>
      <Content />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useFileStore } from '../../store/file'
import FileBar from './components/FileBar.vue'
import Content from './components/Content.vue'

const fileStore = useFileStore()
const { selectedFiles } = storeToRefs(fileStore)
</script>

<style lang="scss" scoped>
.content-container {
  height: 100%;
  flex: 1;
  background-color: #1e1e1e;
  overflow: hidden;
  .content-main {
    height: 100%;
    /* .content {
      position: relative;
      height: calc(100% - 50px);
      width: 100%;
      overflow: overlay;
      padding: 5px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        position: fixed;
        display: block;
        background-color: #1e1e1e;
        border-left: 1px solid #393939;
        width: 15px;
      }
      &::-webkit-scrollbar-thumb {
        display: none;
      }
      &::-webkit-scrollbar-corner {
        display: none;
      }
      &:hover {
        &::-webkit-scrollbar-thumb {
          display: block;
          background-color: #424242;
          &:hover {
            background-color: #4f4f4f;
          }
        }
      }
      .file-content {
        width: 100%;
        display: flex;
        .edit {
          width: 100%;
          color: #9cdcfe;
          margin: 0;
          outline: none;
          font-family: Consolas, 'Courier New', monospace;
          line-height: 25px;
          .line {
            width: 100%;
            height: 25px;
          }
        }
      }
      .blank {
        height: 400px;
      }
    } */
  }
}
</style>
