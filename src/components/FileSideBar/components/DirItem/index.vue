<template>
  <div class="dir-item-container">
    <div v-for="item in sortDirItem" :key="item">
      <div class="dir-title" @click="handleClick(item)">
        <div
          :class="
            [
              item.isDirectory
                ? item.isFold
                  ? 'icon iconfont flod icon-xiangyou1'
                  : 'icon iconfont flod icon-xiangxia'
                : ''
            ].join(' ')
          "
        ></div>
        <div
          :class="
            ['icon', 'iconfont', item.isFile ? 'icon-dangewenjian' : 'icon-wenjianjia'].join(' ')
          "
        ></div>
        <div class="name">{{ item.name }}</div>
      </div>
      <div class="sub-title" v-if="item?.children?.length && !item.isFold">
        <DirItem :dirItem="item.children" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DirItem'
}
</script>

<script setup>
import { defineProps, computed } from 'vue'
import { useFileStore } from '@/store/file'
import { storeToRefs } from 'pinia'
const fileStore = useFileStore()
const { selectedFiles } = storeToRefs(fileStore)
const props = defineProps({
  dirItem: {
    type: Array,
    default() {
      return []
    }
  }
})

const sortDirItem = computed(() => {
  const dirArr = []
  const fileArr = []
  for (let i = 0; i < props.dirItem.length; i++) {
    if (props.dirItem[i].isDirectory) {
      dirArr.push(props.dirItem[i])
    } else {
      fileArr.push(props.dirItem[i])
    }
  }
  return dirArr.concat(fileArr)
})

function handleClick(item) {
  if (item.isDirectory) {
    item.isFold = !item.isFold
  } else {
    // 点击的是文件
    const newSelectedFiles = [...selectedFiles.value]
    const index = newSelectedFiles.indexOf(item)
    if (index === -1) {
      newSelectedFiles.push(item)
      fileStore.changeSelectedFiles(newSelectedFiles)
      fileStore.changeSelectedFileIndex(newSelectedFiles.length - 1)
    } else {
      fileStore.changeSelectedFileIndex(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.dir-item-container {
  color: #fff;
  .dir-title {
    display: flex;
    align-items: center;
    margin: 5px 0;
    cursor: pointer;
    .name {
      margin-left: 3px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .flod {
      margin-right: 5px;
    }
    .icon-dangewenjian {
      margin-left: 21px;
    }
  }
  .sub-title {
    margin: 5px 0 5px 21px;
  }
}
</style>
