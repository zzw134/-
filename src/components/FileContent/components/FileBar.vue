<template>
  <div class="filebar-container">
    <div
      :class="{ active: selectedFileIndex === index, 'bar-item': true }"
      v-for="(item, index) in selectedFiles"
      :key="index"
      @click="handleClick(index)"
    >
      <div class="icon iconfont icon-dangewenjian"></div>
      <div
        class="name"
        @mousemove="triggerPathName($event, 'show', item.pathName)"
        @mouseleave="triggerPathName($event, 'hide')"
      >
        <div>
          {{ sameNameMap[item.name] > 1 ? changeNameToPathName(item.pathName) : item.name }}
        </div>
      </div>
      <div
        class="close"
        @click="handleClose($event, index)"
        @mouseenter="handleIconChange('enter', item)"
        @mouseleave="handleIconChange('leave', item)"
      >
        <div class="unsave" v-show="item.closeIcon === 'unsave'"></div>
        <div class="icon iconfont icon-close" v-show="item.closeIcon === 'close'"></div>
      </div>
    </div>
    <div class="path-name" ref="pathNameRef">hhdsf</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileStore } from '../../../store/file'

const fileStore = useFileStore()
const { selectedFileIndex, selectedFiles } = storeToRefs(fileStore)
const selectedFile = computed(() => {
  return selectedFiles.value[selectedFileIndex.value]
})

// const props = defineProps({
//   isFileChange: {
//     type: Boolean,
//     default: false
//   }
// })

const pathNameRef = ref(null)
const pageWidth = document.body.clientWidth
let timer = null
function triggerPathName(e, type, pathName) {
  if (type === 'show') {
    if (pathNameRef.value.style.display !== 'none') {
      return
    }
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      const left = e.clientX + 10
      const top = e.clientY + 15
      pathNameRef.value.innerText = pathName
      pathNameRef.value.style.display = 'block'
      if (pageWidth - left < pathNameRef.value.clientWidth) {
        pathNameRef.value.style.left = 'unset'
        pathNameRef.value.style.right = 0
      } else {
        pathNameRef.value.style.right = 'unset'
        pathNameRef.value.style.left = left + 'px'
      }
      pathNameRef.value.style.top = top + 'px'
      clearTimeout(timer)
    }, 800)
  }
  if (type === 'hide') {
    pathNameRef.value.style.display = 'none'
  }
}

const sameNameMap = computed(() => {
  const nameArr = selectedFiles.value.map((item) => {
    return item.name
  })
  const obj = {}
  for (let i = 0; i < nameArr.length; i++) {
    const name = nameArr[i]
    if (name in obj) {
      obj[name]++
    } else {
      obj[name] = 1
    }
  }
  return obj
})

function changeNameToPathName(pathName) {
  const names = pathName.match(/\\[^\\]*/g)
  const length = names.length
  const name = names[length - 1].slice(1)
  const secondName = names[length - 2]
  return name + ' ...' + secondName
}

changeNameToPathName('\\views\\Entire\\index.jsx')

function handleClick(index) {
  fileStore.changeSelectedFileIndex(index)
}

function handleClose(e, index) {
  e.stopPropagation()
  if (selectedFile.value.isFileChange) {
    // 因为鼠标移入事件会在关闭的时候触发，所以得在这判断一下
    selectedFile.value.closeIcon = 'unsave'
  } else {
    selectedFile.value.closeIcon = 'close'
  }
  const newSelectedFiles = [...selectedFiles.value]
  newSelectedFiles.splice(index, 1)
  if (index === selectedFileIndex.value) {
    fileStore.changeSelectedFileIndex(0)
  } else if (index < selectedFileIndex.value) {
    fileStore.changeSelectedFileIndex(selectedFileIndex.value - 1)
  }
  fileStore.changeSelectedFiles(newSelectedFiles)
}

function handleIconChange(action, item) {
  if (action === 'enter') {
    item.closeIcon = 'close'
  }
  if (action === 'leave') {
    if (item.isFileChange) {
      item.closeIcon = 'unsave'
    }
  }
}
</script>

<style lang="scss" scoped>
.filebar-container {
  display: flex;
  align-items: center;
  width: 100%;
  color: #8c8c8c;
  height: 50px;
  background-color: #252526;
  overflow-x: overlay;
  &:hover {
    &::-webkit-scrollbar {
      display: block;
      height: 4px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #4b4b4b;
    }
  }
  .bar-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 5px 8px;
    background-color: #2d2d2d;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid #252526;
    cursor: pointer;
    &.active {
      background-color: #1e1e1e;
      border-bottom: 1px solid #252526;
      color: #fff;
      & .close .unsave {
        background-color: #fff;
      }
      & .close .icon-close {
        display: block;
      }
    }
    &:hover {
      & .close .icon-close {
        display: block;
      }
    }
    .name {
      display: flex;
      align-items: center;
      height: 100%;
      margin: 0 5px;
    }

    .close {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: #3b3c3c;
        border-radius: 5px;
      }
      .unsave {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #8c8c8c;
      }
      .icon-close {
        font-size: 20px;
        display: none;
      }
    }
  }

  .path-name {
    display: none;
    position: fixed;
    background-color: #fff;
    color: #1e1e1e;
    padding: 5px 8px;
    white-space: nowrap;
    z-index: 1;
  }
}
</style>
