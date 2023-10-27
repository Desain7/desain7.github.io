const obj = {
  name: 'John',
  age: 30
}

const proxy = new Proxy(obj, {
  get(target, property) {
    console.log(`Getting property: ${property}`)
    return target[property]
  }
})

console.log(obj.name) // 输出: Getting property: name
//      John

console.log(proxy.age) // 输出: Getting property: age
//      30
