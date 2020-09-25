import api from '@/api'
import store from '@/stores'
import method from './method'
import appConfig from '@/utils/appConfig'

const localStorageNames = ['user', 'tokens', 'enumDict', 'configuration', 'customerUserInfo']
const loginPageUrl = '/pages/login/index'

const tools = {
    // 合并method
    ...method,

    // tools方法正文↓
    jump: (url) => {
        url && uni.navigateTo({
            url: url
        })
    },

    userClickToLogin() {
        // 用户点击去登录可保留refresh token
        this.jump(`${loginPageUrl}`)
    },

    alertNeedLogin() {
        this.alert({
            content: '请先登录',
            showCancel: false,
            confirmText: '去登录',
            success: (res) => {
                if (res.confirm) {
                    this.jump('/pages/login/index')
                }
            }
        })
    },

    toLogin() {
        // 清空tokens缓存
        this.setStorage('tokens', {})
        // 更新缓存值到vuex
        this.updateStoreFromStorage()
        // 跳转到登录页
        uni.redirectTo({
            url: loginPageUrl
        })
    },

    isLogin() {
        return Boolean(store.state.tokens.access)
    },

    goIndex() {
        uni.switchTab({
            url: '/pages/index/index' // 首页
        })
    },

    // token持久化
    setTokens(tokens){
        this.setStorage('tokens', {
            access: tokens.access_token,
            refresh: tokens.refresh_token,
        })
    },

    isIphoneX(){
        uni.getSystemInfo({
            success: (res)=> {
                this.setStorage('isIphoneX', res.model.search('iPhone X') !== -1)
            }
        })
    },

    // 查询用户信息
    getMyProfile() {
        return new Promise((resolve, reject) => {
            api('profile.profile',null,{isEndLoading: false})
                .then(res => {
                    this.setStorage('user', res)
                    resolve(res)
                })
                .catch(e => {
                    console.log(e)
                })
        })
    },

    getConfiguration() {
        api('base.configuration', null , {isEndLoading: false})
            .then(res => {
                this.setStorage('configuration', res)
            })
            .catch(e => {
                console.log(e)
            })
    },

    getEnumDictionary() {
      // 备用
    },

    formatLargeString: (str, maxLength) => {
        return str.length <= maxLength ? str : str.substring(0, maxLength - 1) + '...'
    },

    // 如果后端时间已经是北京时间无需再转时区则直接修改格式显示
    formatTimeNotChange(time){
        return time ? time.split('.')[0].replace(/T/g,' ') : ''
    },

    getRect(selector, all, that = wx) { // that参数：在自定义组件中，需传入this替代wx,否则拿不到dom元素
        return new Promise(resolve => {
            that.createSelectorQuery()[all ? 'selectAll' : 'select'](selector)
                .boundingClientRect(rect => {
                    if (all && Array.isArray(rect) && rect.length) {
                        resolve(rect)
                    }
                    if (!all && rect) {
                        resolve(rect)
                    }
                })
                .exec()
        })
    },

    alert(config) {
        uni.showModal({
            title: '提示',
            confirmColor: '#4E6EF2',
            ...config
        })
    },

    toast(config) {
        uni.showToast({
            icon: 'none',
            ...config
        })
    },

    pageScrollTo(config) {
        config === 'top' && (config = {scrollTop: 0, duration: 0})
        uni.pageScrollTo(config)
    },

    updateStoreFromStorage() {
        localStorageNames.forEach(dataName => {
            const data = uni.getStorageSync(dataName)
            if (Object.keys(data).length) {
                store.commit('setData', {dataName, data})
            } else {
                store.commit('setData', {dataName, data: {}})
            }
        })
        const curRole = uni.getStorageSync('curRole')
        if(curRole){
            store.commit('setData', {dataName:'curRole', data: curRole})
        }
    },

    checkAppEnv() {
        const appStorageEnv = uni.getStorageSync('appEnv')
        if (!appStorageEnv || appStorageEnv !== appConfig.env) {
            localStorageNames.forEach(dataName => {
                this.setStorage(dataName, {})
            })
        }
        if (appStorageEnv !== appConfig.env) {
            uni.setStorageSync('appEnv', appConfig.env)
        }
    },

    setStorage(key, data, sync = true) {
        if (sync) {
            uni.setStorageSync(key, data)
            store.commit('setData', {dataName: key, data: data})
        } else {
            return new Promise((resolve, reject) => {
                uni.setStorage({
                    key,
                    data,
                    success() {
                        store.commit('setData', {dataName: key, data: data})
                        resolve()
                    },
                    fail: e => {
                        this.toast({title: `set ${key} storage fail`})
                        reject(e)
                    }
                })
            })
        }
    },

    /**
     * @description: 检测小程序更新的函数
     */
    updateApp() {
        if (uni.canIUse('getUpdateManager')) {
            const updateManager = uni.getUpdateManager()
            updateManager.onCheckForUpdate((res) => {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(() => {
                        this.alert({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(() => {
                        // 新的版本下载失败
                        this.alert({
                            title: '更新提示',
                            content: '新版本已经上线啦！请退出小程序重新进入',
                            showCancel: false,
                            confirmText: '知道了'
                        })
                    })
                }
            })
        }
    }
}

export default tools
