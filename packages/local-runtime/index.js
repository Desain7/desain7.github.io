const arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const arr2 = ['A', 'B', 'C']

// Set 实现
function mergeArr1(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])]
}
// Filter 实现
function mergeArr2(arr1, arr2) {
  return [...arr1, ...arr2].filter((item, index, arr) => {
    return arr.indexOf(item) === index
  })
}

console.log(mergeArr1(arr1, arr2), mergeArr2(arr1, arr2))
