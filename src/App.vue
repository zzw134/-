<script setup>
import { storeToRefs } from 'pinia'
import SelectPage from '@/components/SelectPage/index.vue'
import FileSideBar from '@/components/FileSideBar/index.vue'
import FileContent from '@/components/FileContent/index.vue'
import { useMainStore } from '@/store/main.js'

const store = useMainStore()
const { selectStatus } = storeToRefs(store)
</script>

<template>
  <div class="select-page" v-if="!selectStatus">
    <SelectPage />
  </div>
  <div class="file-info" v-else>
    <FileSideBar />
    <FileContent />
  </div>
</template>

<style scoped>
.file-info {
  width: 100%;
  height: 100vh;
  display: flex;
}
</style>
