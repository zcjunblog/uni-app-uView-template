import request from './http'
import store from '@/stores'
import appConfig from '@/utils/appConfig'
const urls = require('./swagger.json')

console.log(urls)

const apiHandle = (api) => {
  const parsed = api.split('.', 2)
  parsed[1] = parsed[1] || parsed[0]

  const arr = urls[parsed[0]][parsed[1]]
  return { method: arr[0], url: arr[1] }
}

const parseUrl = (url, params) => {
  const arr = url.match(/\{.+?\}/g)
  if (arr && arr.length > 0) {
    arr.forEach(item => {
      const str = /\{(.+?)\}/.exec(item)[1]
      url = url.replace(item, params[`__${str}`])
      delete params[`__${str}`]
    })
  }
  return {url, params}
}

const fetch = (api, params = null, config = {}) => {
  let {method, url} = apiHandle(api)
  const result = parseUrl(url, params)
  url = result.url
  params = result.params

  return request(method, url, params, config)
}

const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '处理中',
      mask: true
    })
    uni.uploadFile({
      url: appConfig.baseUrl + '图片上传接口',
      filePath,
      name: 'images',
      header: {
        __tenant: store.state.curTenant.id,
        Authorization: `Bearer ${store.state.tokens.access}`
      },
      success (res) {
        uni.hideLoading()
        resolve(res)
      },
      fail (res) {
        uni.hideLoading()
        reject(res)
      }
    })
  })
}

export { uploadFile }
export default fetch
