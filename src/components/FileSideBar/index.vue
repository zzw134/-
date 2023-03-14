<template>
  <div class="side-bar-container">
    <div class="header">资源管理器</div>
    <!-- <SideBarHeader /> -->
    <div v-if="fileInfo[0].isDirectory" class="has-dir">
      <div class="main" v-for="(item, index) in fileInfo" :key="index">
        <div class="dir-title" @click="handleTitleClick(item)">
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
          <div class="icon iconfont icon-wenjianjia" style="margin-left: 5px"></div>
          <div class="name">{{ item.name }}</div>
        </div>
        <div class="sub-content" v-if="item?.children?.length && !item.isFold">
          <DirItem :dirItem="item.children" />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="msg">尚未打开文件夹</div>
      <button class="btn-click-dir" @click="handleOpenDir">打开文件夹</button>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import DirItem from './components/DirItem/index.vue'
import { useFileStore } from '@/store/file.js'
import useFileInfo from '../../hooks/useFileInfo'
const fileStore = useFileStore()
const { fileInfo } = storeToRefs(fileStore)

function handleTitleClick(item) {
  item.isFold = !item.isFold
}

async function handleOpenDir() {
  const handleSelect = useFileInfo('select')
  fileInfo.value = await handleSelect('directory')
}
</script>

<style lang="scss" scoped>
.side-bar-container {
  width: 15%;
  height: 100%;
  background-color: #252526;
  padding: 5px 8px;
  box-sizing: border-box;

  .header {
    color: #fff;
    /* position: fixed; */
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #252526;
  }
  .has-dir {
    height: calc(100% - 40px);
    .main {
      height: 100%;
      display: flex;
      flex-direction: column;
      .dir-title {
        display: flex;
        align-items: center;
        color: #fff;
        cursor: pointer;
        .name {
          margin-left: 5px;
        }
      }
      .sub-content {
        margin-left: 16px;
        overflow-y: overlay;
        &:hover {
          &::-webkit-scrollbar {
            display: block;
            width: 4px;
            background-color: transparent;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #4b4b4b;
          }
        }
      }
    }
  }
  .msg {
    margin-top: 5px;
    color: #fff;
    font-size: 14px;
  }
  .btn-click-dir {
    width: 100%;
    height: 40px;
    background-color: #2ea4e3;
    border: none;
    color: #fff;
    margin-top: 5px;
  }
}
</style>
