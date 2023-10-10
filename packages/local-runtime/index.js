const urlData =
  'http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled'

const getParams = (url) => {
  const queryString = url.split('?')[1]
  const paramsArray = queryString.split('&')
  const paramsObj = {}
  paramsArray.forEach((param) => {
    const [key, value] = param.split('=')
    if (!paramsObj[decodeURIComponent(key)]) {
      paramsObj[decodeURIComponent(key)] = decodeURIComponent(value)
    } else {
      paramsObj[decodeURIComponent(key)] = [].concat(
        paramsObj[decodeURIComponent(key)],
        decodeURIComponent(value)
      )
    }
    if (!value) {
      paramsObj[decodeURIComponent(key)] = true
    }
  })
  return paramsObj
}

console.log(getParams(urlData))
