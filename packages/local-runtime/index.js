const Obj = function () {
  this.a = 12
}

Obj.prototype.c = 2

const obj = new Obj()

obj.b = 1

function iterate(obj) {
  const res = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) res.push(`${key}: ${obj[key]}`)
  }
  return res
}

console.log(obj.hasOwnProperty(c))
