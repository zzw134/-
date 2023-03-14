import { ref } from 'vue'

// 点击选择文件
async function handleSelect(type) {
  let fileInfo
  if (type === 'file') {
    // 文件类型
    const fileHandles = await window.showOpenFilePicker({
      multiple: true
    })
    fileInfo = await Promise.all(
      fileHandles.map(async (handle) => {
        return await handleSelectedFile(handle)
      })
    )
  }
  if (type === 'directory') {
    // 文件夹类型
    const dirHandle = await window.showDirectoryPicker()
    // 注：此api只能选择一个文件夹，为了与store里的数据保持一致，顾将结果存于数组中
    fileInfo = [await handleSelectedFile(dirHandle)]
  }
  return fileInfo
}

// 拖拽选择文件
async function handleDrop(dataTransferItems) {
  const fileInfos = []
  // const firstHandle = await dataTransferItems[0].getAsFileSystemHandle()
  const handle = await dataTransferItems[0].getAsFileSystemHandle()

  if (dataTransferItems.length > 1) {
    alert('不可以同时拖拽多个文件夹或者文件')
  } else {
    fileInfos.push(await handleSelectedFile(handle))
  }

  // if (firstHandle.kind === 'directory' && dataTransferItems.length === 1) {
  //   fileInfos.push(await handleSelectedFile(firstHandle))
  // } else if (firstHandle.kind === 'directory' && dataTransferItems.length > 1) {
  //   alert('不可以同时拖拽多个文件夹或者同时拖拽文件夹和文件')
  //   return
  // } else if (firstHandle.kind === 'file') {
  //   fileInfos.push(await handleSelectedFile(firstHandle))
  //   // 目前不知道原因dataTransferItems数组如果又多个值，只可以使用其中的一个值，别的值使用不了
  //   for (let i = 1; i < dataTransferItems.length; i++) {
  //     const test = await dataTransferItems[i].getAsFileSystemHandle()
  //     console.log(test)
  //     const fileInfo = await handleSelectedFile(test)
  //     if (fileInfo.isDirectory) {
  //       alert('不可以同时拖拽文件夹和文件')
  //       return
  //     } else {
  //       fileInfos.push(fileInfo)
  //     }
  //   }
  // }

  return fileInfos
}

// 处理选择的文件
async function handleSelectedFile(handle, dirName='') {
  if (handle.kind === 'file') {
    // 文件
    return {
      name: handle.name,
      isFile: true,
      fileHandle: handle,
      closeIcon: ref('close'), // 可选值'close'和'unsave'
      isFileChange: ref(false),
      pathName: dirName + '\\' + handle.name
    }
  } else {
    // 文件夹
    const children = []
    for await (const item of handle.entries()) {
      children.push(await handleSelectedFile(item[1], dirName + '\\' + handle.name))
    }
    return {
      name: handle.name,
      children,
      isDirectory: true,
      isFold: true
    }
  }
}

export default function useFileInfo(selectMethod) {
  if (selectMethod === 'select') {
    return handleSelect
  }
  if (selectMethod === 'drop') {
    return handleDrop
  }
}