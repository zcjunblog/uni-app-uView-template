import tools from '@/utils/tools'
import appConfig from '@/utils/appConfig'
import store from '@/store'
import api from '@/api'

let reqQueue = [] // 用来存储401报错的请求
let reCheckDuration = 300 // "三步查"初始间隔时间
const request = (
    methods,
    url,
    params,
    {
        removeAuthorization = false,// 移除请求头
        baseUrl = appConfig.baseUrl,
        isShowLoading = true,  // 弹出loading窗
        isEndLoading = true,  // 最后需要隐藏loading窗。若是false，则不隐藏
        reCheck = false, // 采用"三步查"
        reCheckValueName = '', // "三步查"结束判断值
        reCheckValueChildName = '', // "三步查"结束判断值 子节点
    } = {}
) => {
    return new Promise((resolve, reject) => {
        isShowLoading && uni.showLoading({title: '处理中...', mask: true})
        let config = {
            url: `${baseUrl}${url}`,
            method: methods,
            data: params,
            header: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: (res) => {
                if (res.statusCode === 200 || res.statusCode === 204) {
                    if (reCheck) {// 增加三步查的判断
                        let value = reCheckValueChildName ? res.data[reCheckValueName][reCheckValueChildName] : res.data[reCheckValueName]
                        if (value) { // 已查到
                            reCheckDuration = 300 // 重置该时间间隔
                            resolve(res.data)
                            return
                        }
                        reCheckDuration += 1500
                        if (reCheckDuration > 6000) {
                            reCheckDuration = 300 // 重置该时间间隔
                            reject(res)
                        } else {
                            setTimeout(() => {
                                uni.request(config)
                            }, reCheckDuration)
                        }
                    } else {
                        resolve(res.data)
                    }
                }
                if (res.statusCode === 401) {
                    // 往队列里丢待执行的请求
                    reqQueue.push(config)
                    // 让这个Promise一直处于Pending状态（即不调用resolve或reject，交给refreshTokenToLogin函数去处理）
                    refreshTokenToLogin()
                }
                if (res.statusCode === 403) {
                    handle403(res)
                    reject(res)
                }
                if (res.statusCode === 404 || res.statusCode === 400 || res.statusCode === 500) {
                    toastMsg(res, '操作失败')
                    reject(res)
                }
                if (isShowLoading && isEndLoading) {
                    uni.hideLoading()
                }
            },
            fail: (res) => {
                uni.hideLoading()
                toastMsg({}, '请求失败,请检查网络状态!')
                console.log(res)
                reject(res)
            }
        }
        // console.log(config)
        // 三步查第一次延时300ms
        reCheck && console.log("请求已延时300ms")
        tools.delayed(reCheck ? 300 : 0).then(()=>{
            const tokens = store.state.vuex_tokens
            // ① 不携带请求头的请求类型
            if (removeAuthorization) {
                uni.request(config)
                return
            }

            // ② 携带授权信息的请求类型
            if (tokens.access) {
                config.header.Authorization = `Bearer ${tokens.access}`
                uni.request(config)
            } else {
                tools.toLogin()
                uni.hideLoading()
                reject('安全警告:token不存在,需要重新登录!')
            }
        })
    })
}

// 提示消息
function toastMsg(res, msg) {
    if (res.data && res.data.error.message) {
        msg = res.data.error.message
    }
    tools.toast({title: msg, duration: 3000})
}

// 处理403的提示
function handle403(res) {
    const message = res.data.error.message
    if (message) {
        // 存在message
        if (message.startsWith('Authorization failed!')) {
            // 无权限访问
            const user = store.state.vuex_user
            if (!user.phoneNumber) {
                toastMsg({}, '请先绑定手机号!')
            } else {
                toastMsg({}, '无权限访问')
            }
        } else {
            // 正常message返回
            toastMsg(res, message)
        }
    } else {
        // 无message
        toastMsg({}, '无权限访问')
    }
}

// 无感重登
let refreshLoginStatus = false // 设置一个正在登陆状态，当发现有正在登录的操作时，不重复执行
function refreshTokenToLogin() {
    if (refreshLoginStatus === true) {
        return
    }
    refreshLoginStatus = true
    // refresh刷新登录态
    api('base.refreshAccessToken', {
        refreshToken: store.state.vuex_tokens.refresh
    }).then(res => {
        if (res.error) {
            console.log('refresh token 也失效 => 跳转登陆')
            refreshComplete(true)
        } else {
            // 执行队列里的请求
            reqQueue.forEach(config => {
                config.header.Authorization = `Bearer ${res.access_token}`
                uni.request(config)
            })
            // 事件队列执行完毕重置数组
            refreshComplete(false)
            // 最后存下token
            tools.setTokens(res)
        }
    }).catch(() => {
        refreshComplete(true)
    })
}

function refreshComplete(toLogin = false) {
    reqQueue.splice(0, reqQueue.length)
    refreshLoginStatus = false
    if (toLogin) {
        toastMsg({}, '登录已过期,请重新登录!')
        tools.toLogin()
    }
}

export default request
