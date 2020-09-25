import request from './http'
import store from '@/stores'
import appConfig from '@/utils/appConfig'

const urls = {
  base: {
    'onLogin': ['post', 'api/weChatManagement/miniPrograms/login/login'],
    'configuration': ['get', 'api/abp/application-configuration'],
    'preUploadImage': 'api/fileManagement/file/many',
  },
}

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

const uploadFile = (filePath, dailyDirectoryId) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: appConfig.baseUrl + urls.base.preUploadImage,
      filePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${store.state.tokens.access}`
      },
      formData: {
        fileType: 2,
        ParentId: dailyDirectoryId,
        fileContainerName: 'DentureOrderRemark'
      },
      success (res) {
        resolve(res)
      },
      fail (res) {
        reject(res)
      }
    })
  })
}

export { uploadFile }
export default fetch
