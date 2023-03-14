<template>
  <div class="select-page-container">
    <div class="main">
      <div
        class="drag-container"
        @drop="handleDrop($event)"
        @dragover="handleDragover($event)"
        @dragenter="handleDragenter($event)"
      >
        <div class="icons">
          <div class="icon iconfont icon-dangewenjian"></div>
          <div class="line"></div>
          <div class="icon iconfont icon-wenjianjia"></div>
        </div>
        <div class="text">将文件/文件夹拖拽至此</div>
      </div>
      <div class="select-container">
        <div class="left" @click="() => handleSelectClick('file')">
          <div class="icon iconfont icon-dangewenjian"></div>
          <div class="text">请选择文件</div>
        </div>
        <div class="right" @click="() => handleSelectClick('directory')">
          <div class="icon iconfont icon-wenjianjia"></div>
          <div class="text">请选择文件夹</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFileStore } from '@/store/file.js'
import { useMainStore } from '@/store/main.js'
import { storeToRefs } from 'pinia'
import useFileInfo from '../../hooks/useFileInfo'
const fileStore = useFileStore()
const mainStore = useMainStore()
const { selectedFiles } = storeToRefs(fileStore)

function changeStore(store, method, info) {
  if (info.length) {
    store.changeFileInfo(info)
    store.changeSelectedMethod(method)
  }
}

function changeMainStore(info) {
  if (info.length) {
    mainStore.changeStatus(true)
  } else {
    mainStore.changeStatus(false)
  }
}
// 点击选择文件的功能
async function handleSelectClick(type) {
  const handleSelect = useFileInfo('select')
  const fileInfo = await handleSelect(type)
  if (type === 'file') {
    const newSelectedFiles = [...selectedFiles.value]
    newSelectedFiles.push(...fileInfo)
    fileStore.changeSelectedFiles(newSelectedFiles)
    fileStore.changeSelectedFileIndex(0)
  }
  changeStore(fileStore, 'select', fileInfo)
  changeMainStore(fileInfo)
}

// 拖拽选择文件的功能
async function handleDrop(e) {
  e.preventDefault()
  const dataTransferItems = Array.from(await e.dataTransfer.items)
  const handleDropFile = useFileInfo('drop')
  const fileInfo = await handleDropFile(dataTransferItems)

  const newSelectedFiles = [...selectedFiles.value]
  const preLen = newSelectedFiles.length
  fileInfo.forEach((item) => {
    if (item.isFile) {
      newSelectedFiles.push(item)
    }
  })
  if (preLen !== newSelectedFiles.length) {
    fileStore.changeSelectedFiles(newSelectedFiles)
    fileStore.changeSelectedFileIndex(0)
  }
  changeStore(fileStore, 'drag', fileInfo)
  changeMainStore(fileInfo)
}

function handleDragover(e) {
  e.preventDefault()
}

function handleDragenter(e) {
  e.preventDefault()
}
</script>

<style lang="scss" scoped>
.select-page-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  .main {
    width: 50vw;
    height: 80vh;
    .drag-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 70%;
      border: 3px dashed #fff;
      border-radius: 3% / 6%;
      box-sizing: border-box;
      color: #fff;
      cursor: pointer;
      .icons {
        margin-bottom: 40px;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 60px;
        }
        .line {
          margin: 30px;
          &::before {
            display: block;
            content: '';
            width: 4px;
            height: 70px;
            background-color: #fff;
            transform: rotate(20deg);
          }
        }
      }
      .text {
        font-size: 35px;
        letter-spacing: 10px;
      }
    }
    .select-container {
      margin-top: 4%;
      display: flex;
      justify-content: space-between;
      height: 25%;
      width: 100%;
      .left,
      .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 48%;
        height: 100%;
        border: 2px solid #fff;
        border-radius: 3%/6%;
        color: #fff;
        font-size: 20px;
        letter-spacing: 5px;
        cursor: pointer;
      }
      .iconfont {
        font-size: 40px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
