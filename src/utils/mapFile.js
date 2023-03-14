class MapFile {
  constructor() {
    this.mapFile = new Map()
  }
  setContent(fileHandle, saveContent, content) {
    const fileContent = this.getContent(fileHandle)
    saveContent !== null && (fileContent.saveContent = saveContent)
    content !== null && (fileContent.content = content)
    this.mapFile.set(fileHandle, fileContent)
  }
  getContent(fileHandle) {
    return this.mapFile.get(fileHandle) || {saveContent: null, content: null}
  }
}

export default new MapFile()