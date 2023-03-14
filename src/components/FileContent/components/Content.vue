<template>
  <div class="content">
    <Theme />
    <div class="file-content">
      <div class="lines">
        <LineNum :line-num="lineNumRef" />
      </div>
      <pre
        class="edit"
        contenteditable
        @input="handleInput($event)"
        @keydown.ctrl.s="handleSave($event)"
        v-html="highLightLines"
      ></pre>
    </div>
    <div class="blank"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
import { useFileStore } from '../../../store/file'
import Theme from './Theme.vue'
import LineNum from './LineNum.vue'
import { unescapedHTML } from '@/utils/escapedHTML.js'
import convertedFileToHTML from '@/utils/convertedFileToHTML.js'
import mapFile from '@/utils/mapFile.js'

const fileStore = useFileStore()
const { selectedFiles, selectedFileIndex } = storeToRefs(fileStore)
const selectedFile = computed(() => {
  return selectedFiles.value[selectedFileIndex.value]
})

const lineNumRef = ref(1)

const rawContent = ref('')
let fileContent = ref('')
const highLightLines = ref('')

watch(
  [selectedFileIndex, selectedFiles],
  async () => {
    if (selectedFiles.value.length) {
      let tempSaveContent, tempContent
      const { saveContent, content } = mapFile.getContent(selectedFile.value.fileHandle)
      if (content === null && saveContent === null) {
        const fileObj = await selectedFile.value.fileHandle.getFile()
        const fileContent = await fileObj.text()
        mapFile.setContent(selectedFile.value.fileHandle, fileContent, fileContent)
        tempSaveContent = fileContent
        tempContent = fileContent
      } else {
        tempSaveContent = saveContent
        tempContent = content
      }
      console.log(tempContent)
      rawContent.value = tempSaveContent
      lineNumRef.value = tempContent.split('\n').length
      highLightLines.value = convertedFileToHTML(tempContent)
    }
  },
  { immediate: true }
)

const handleInput = _.debounce(
  (e) => {
    const preEl = e.target
    if (preEl.childNodes.length === 0) {
      // 用来防止删除全部内容后把最后一个div也删除的情况
      const divEl = document.createElement('div')
      divEl.classList.add('line')
      divEl.style.height = '25px'
      divEl.style.lineHeight = '25px'
      preEl.append(divEl)
    }

    fileContent.value = ''
    // const lines = e.target.innerHTML.replace('\n', '').split(/(?=<div)(?<=\/div>)/)
    const lines = preEl.innerHTML.match(/<(\w+)[^>]*>([\s\S]*?<\/\1>)?/g)
    lines?.forEach((line, index) => {
      fileContent.value += unescapedHTML(line.replace(/<.*?>|<\/.*?>|\n/g, ''))
      if (index !== lines.length - 1) {
        fileContent.value += '\n'
      }
    })
    lineNumRef.value = lines?.length
    if (fileContent.value !== rawContent.value) {
      selectedFile.value.isFileChange = true
      selectedFile.value.closeIcon = 'unsave'
    } else {
      selectedFile.value.isFileChange = false
      selectedFile.value.closeIcon = 'close'
    }

    mapFile.setContent(selectedFile.value.fileHandle, null, fileContent.value)
  },
  200,
  { leading: true }
)

async function handleSave(e) {
  e.preventDefault()
  if (selectedFile.value.isFileChange) {
    const fileHandle = selectedFile.value.fileHandle
    try {
      const writable = await fileHandle.createWritable()
      mapFile.setContent(fileHandle, fileContent.value, null)
      rawContent.value = fileContent.value
      selectedFile.value.isFileChange = false
      selectedFile.value.closeIcon = 'close'
      await writable.write(fileContent.value)
      await writable.close()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
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
    }
  }
  .blank {
    height: 400px;
  }
}
</style>
