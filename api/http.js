import tools from '@/utils/tools'
import appConfig from '@/utils/appConfig'
import store from '@/stores'

const toastMsg = (res, msg) => {
  if (res.data && res.data.error.message) {
    msg = res.data.error.message
  }
  tools.toast({ title: msg })
}

const request = (
  methods,
  url,
  params,
  {
    isHost = false, // 宿主的Authorization
    removeAuthorization = false,// 移除请求头
    baseUrl = appConfig.baseUrl,
  } = {}
) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '加载中',
      mask: true
    })

    let config = {
      url: `${baseUrl}${url}`,
      method: methods,
      data: params,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        uni.hideLoading()

        if (res.statusCode === 200 || res.statusCode === 204) {
          resolve(res.data)
        }
        if (res.statusCode === 401) {
          tools.refreshTokenToLogin()
          reject(res)
        }
        if (res.statusCode === 403) {
          handle403(res)
          reject(res)
        }
        if (res.statusCode === 404 || res.statusCode === 400 || res.statusCode === 500) {
          toastMsg(res, '操作失败')
          reject(res)
        }
      },
      fail: (res) => {
        uni.hideLoading()
        toastMsg({}, '请求失败')
        reject(res)
      }
    }

    const tokens = store.state.tokens
    const hostTokens = store.state.hostTokens
    const curTenant = store.state.curTenant
    // ① 不携带请求头的请求类型
    if(removeAuthorization){ // 请求头不需要携带多余信息
      uni.request(config)
      return
    }
    // ② 宿主授权的请求类型 请求头携带宿主tokens
    if(isHost){
      if (hostTokens.access) {
        config.header.Authorization = `Bearer ${hostTokens.access}`
        uni.request(config)
      }else {
        uni.hideLoading()
        tools.toLogin()
        reject(new Error('不存在hostTokens.access,需要重新登录'))
      }
      return
    }
    // ③ 租户授权的请求类型 请求头携带租户tokens和tenant.id
    if (curTenant.id) {
      config.header.__tenant = curTenant.id
      if (tokens.access) {
        config.header.Authorization = `Bearer ${tokens.access}`
        uni.request(config)
      } else {
        uni.hideLoading()
        tools.toLogin()
        reject(new Error('不存在tokens.access,需要重新登录'))
      }
    }else {
      uni.hideLoading()
      // 无 tenantId 置空 tokens
      tools.toLogin(!curTenant.id)
      reject(new Error('need login'))
    }
  })
}
// 403的处理
function handle403 (res) {

}

export default request
