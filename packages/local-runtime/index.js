const obj = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
}

delete obj.key2

console.log(obj) // { key1: 'value1', key3: 'value3' }
