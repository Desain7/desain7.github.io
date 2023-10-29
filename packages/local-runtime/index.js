// 每隔三秒输出时间

const time = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(new Date())
      resolve('time')
    }, 3000)
  })
}

const outputTime = async () => {
  await time()
  outputTime()
}

outputTime()
