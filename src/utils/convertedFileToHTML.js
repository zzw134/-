import hljs from "highlight.js"
function convertedFileToHTML(fileContent) {
  const lineContents = fileContent.split('\n')
  let container = document.createElement('div')
  lineContents.forEach(line => {
    const divEl = document.createElement('div')
    divEl.classList.add('line')
    divEl.style.height = '25px'
    const spanEl = document.createElement('span')
    spanEl.innerHTML = hljs.highlightAuto(line).value
    divEl.append(spanEl)
    container.append(divEl)
  })
  const innerHTML = container.innerHTML
  container = null
  return innerHTML
}

// function convertedFileToHTML(fileContent) {
//   const lineContents = fileContent.split('\n')
//   const highlightLines = []
//   lineContents.forEach((line, index) => {
//     highlightLines.push({lineHTML: hljs.highlightAuto(line).value, line: index + 1})
//   })
//   console.log(highlightLines)
//   return highlightLines
// }

export default convertedFileToHTML