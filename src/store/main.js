import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
  const selectStatus = ref(false) // 是否已选择文件
  function changeStatus(status) {
    selectStatus.value = status
  }
  return {selectStatus, changeStatus}
})