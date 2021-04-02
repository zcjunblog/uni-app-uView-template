import request from './http'
import store from '@/store'
import tools from '@/utils/tools'
import appConfig from '@/utils/appConfig'
import urls from './urls'


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

const uploadFile = (filePath, dailyDirectoryId,fileContainerName) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '处理中...',
      mask: true
    })
    wx.uploadFile({
      url: appConfig.baseUrl + urls.base.preUploadImageModule,
      filePath,
      name: 'files',
      header: {
        // 'Content-Type': 'multipart/form-data',
        __tenant: store.state.vuex_curTenant.id,
        Authorization: `Bearer ${store.state.vuex_tokens.access}`
      },
      formData: {
        fileType: 2,
        ParentId: dailyDirectoryId,
        fileContainerName
      },
      success (res) {
        resolve(res)
      },
      fail (res) {
        console.error(res)
        tools.toast({title: '图片上传出错,请稍后再试。'})
        wx.hideLoading()
        reject(res)
      }
    })
  })
}

export { uploadFile }
export default fetch
