// export default function(textstr) {
//   let temp = document.createElement('div')
//   temp.innerHTML = textstr
//   const output = temp.innerText || temp.textContent
//   temp = null
//   return output
// }

function escapedHTML(htmlStr) {
  return htmlStr.replace(/[<>&"]/g, function (match) {
    return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[match]
  }).replace(/ /g, '&nbsp;')
}

const arrEntites = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'}
function unescapedHTML(textStr) {
  return textStr.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (match, p) {
    return arrEntites[p]
  })
}

export {escapedHTML, unescapedHTML}