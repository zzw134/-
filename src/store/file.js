import { defineStore } from "pinia";

export const useFileStore = defineStore('file', {
  state() {
    return {
      fileInfo: [],
      selectedMethod: 'select',
      selectedFiles: [],
      selectedFileIndex: undefined
    }
  },
  actions: {
    changeFileInfo(info) {
      this.fileInfo = info
    },
    /**
     * 
     * @param {'select' | 'drag'} method 
     */
    changeSelectedMethod(method) {
      this.selectedMethod = method
    },
    changeSelectedFiles(file) {
      this.selectedFiles = file
    },
    changeSelectedFileIndex(index) {
      this.selectedFileIndex = index
    }
  }
})