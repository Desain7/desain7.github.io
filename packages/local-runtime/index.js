const arr = [1, 2, [3, 4, [5, 6]], 7]

const result1 = arr.flat(Infinity)

const myFlat = (arr, depth = 1) => {
  if (depth === 0) return arr
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? myFlat(cur, depth - 1) : cur)
  }, [])
}

const result2 = myFlat(arr, Infinity)

console.log(result1, result2)
