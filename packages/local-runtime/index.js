console.log('script start')

async function test() {
  console.log('before async')
  await new Promise((resolve) => resolve(1))
  console.log('after async')
}

test()

console.log('script end')
