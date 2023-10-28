// 设计一个简单的任务队列, 要求分别在 1,3,4 秒后打印出 "1", "2", "3"；
function Queue() {
  this.queue = []
  this.add = function (timer, callback) {
    const p = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(callback())
        }, timer)
      })
    }
    this.queue.push(p)
    return this
  }
  this.start = async function () {
    while (this.queue.length) {
      await this.queue
        .shift()()
        .then((res) => {})
    }
  }
}

new Queue()
  .add(1000, () => {
    console.log(1)
  })
  .add(2000, () => {
    console.log(2)
  })
  .add(1000, () => {
    console.log(3)
  })
  .start()
