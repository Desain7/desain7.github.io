function findMostWord(article) {
  // 合法性判断
  if (!article) return
  // 参数处理
  article = article.trim().toLowerCase()
  const wordList = article.match(/[a-z]+/g)
  const visited = []
  let maxNum = 0
  let maxWord = ''
  article = ` ${wordList.join('  ')} `
  console.log(article)
  // 遍历判断单词出现次数
  wordList.forEach((item) => {
    if (visited.indexOf(item) < 0) {
      // 加入 visited
      visited.push(item)
      const word = new RegExp(` ${item} `, 'g')
      const num = article.match(word).length
      if (num > maxNum) {
        maxNum = num
        maxWord = item
      }
    }
  })
  return `${maxWord}  ${maxNum}`
}

const arti =
  'lorem, ipsum dolor sit amet consectetur adipiscing elit ipsum sit sit sit'

console.log(findMostWord(arti))
