import api from '@/api'
import appConfig from '@/utils/appConfig'
import store from '@/store'
import method from './method'

const tools = {
    // 合并method
    ...method,
    $vuex(name, value){
        store.commit('$uStore', {
            name, value
        })
    },
    toLogin() {
        this.$vuex('vuex_login_modal', true)
    },
    isLogin() {
        return Boolean(store.state.vuex_tokens.access)
    },
    goIndex() {
        wx.switchTab({
            url: '/pages/index/index' // 首页
        })
    },
    checkAppEnv() {
        const appStorageEnv = uni.getStorageSync('appEnv')
        if (appStorageEnv && appStorageEnv !== appConfig.env) {
            this.alert({
                title: '提示',
                content: '检测到运行环境切换,请清除缓存后继续使用。',
                showCancel: false,
                confirmText: '清除缓存',
                success: (res) => {
                    if (res.confirm) {
                        store.commit('$clearLifeData')
                    }
                }
            })
        }
        if (appStorageEnv !== appConfig.env) {
            uni.setStorageSync('appEnv', appConfig.env)
        }
    },
    reload() {
        // 页面重载
        const pages = getCurrentPages()
        // 声明一个pages使用getCurrentPages方法
        const curPage = pages[pages.length - 1]
        // 声明一个当前页面
        curPage.onLoad(curPage.options)
        curPage.onShow()
        curPage.onReady()
        // 执行刷新
    },
    setTabBar(){
        let theme = store.state.vuex_theme_name
        let tabs = ['home', 'integral', 'prize', 'my'] //tabBar页面名称
        tabs.forEach((name,index)=>{
            uni.setTabBarItem({
                index,
                selectedIconPath: `static/tabs/${name}-${theme}.png`,
            })
        })
    },
    copy(data) {
        if (!data && data !== 0) {
            return this.toast({title: '复制的内容不存在'})
        }
        uni.setClipboardData({data})
    },
    setTabBarBadge(){
        let canAuditReview = this.checkPolicies(appConfig.review.auditReview)
        let canFinalAuditReview = this.checkPolicies(appConfig.review.finalAuditReview)
        if(canAuditReview && canFinalAuditReview){
            // 优先显示初审剩余数量
            this.getReviewTotalCount('audit')
        }else if (canAuditReview){
            this.getReviewTotalCount('audit')
        }else if (canFinalAuditReview){
            this.getReviewTotalCount('finialAudit')
        }else {
            uni.removeTabBarBadge({ index: 1})
        }
    },
    onLogin(param, showLoading = true) {
        return api('base.onLogin', param, {
            showLoading,
            autoRedirectToLoginPage: true
        })
    },

    // 查询用户信息
    getUserInfo(showLoading = true) {
        return new Promise((resolve, reject) => {
            api('base.getAppInfo', null, {showLoading})
                .then(res => {
                    this.$vuex('vuex_user',res)
                    resolve(res)
                })
                .catch(e => {
                    reject(e)
                })
        })
    },
    reLogin () { // 有微信授权后无需用户再主动调起 - 权限变更时使用
        return new Promise((resolve,reject)=>{
            wx.login({
                success: res_login => {
                    this.onLogin({
                        lookupUseRecentlyTenant: false,
                        code: res_login.code,
                        appId: appConfig.appId,
                    }, false)
                        .then(res => {
                            this.setTokens(JSON.parse(res.rawData))
                            this.getConfiguration(false).then(()=>{
                                resolve(res)
                            })
                        })
                        .catch(e=>{
                            reject(e)
                        })
                }
            })
        })
    },
    setTokens(tokens) {
        this.$vuex('vuex_tokens', {
            access: tokens.access_token,
            refresh: tokens.refresh_token
        })
    },
    jump(url,intercept = true){ // intercept: 无需登录拦截填false
        if(!store.state.vuex_tokens.access && intercept){
            this.$vuex('vuex_login_modal',true)
            console.log(store.state.vuex_tokens)
            return this.toast({title: '请先登录!'})
        }
        const pages = getCurrentPages()
        const curPage = pages[pages.length - 1]
        if(`/${curPage.route}` === url){ // 重复页面
            return
        }
        url && uni.navigateTo({
            url: url,
            fail: (err)=>{
                this.toast({title: err.errMsg,duration:3000})
            }
        })
    },
    back(delta = 1) {
        uni.navigateBack({
            delta
        })
    },
    alert(config) {
        uni.showModal({
            title: '提示',
            confirmColor: store.getters.vuex_theme['color'],
            ...config
        })
    },

    toast(config) {
        uni.showToast({
            icon: 'none',
            ...config
        })
    },
    /**
     * @param {type} duration - 延时时间ms
     * @description: 在函数内部进行延时 配合三步查方法
     */
    delayed (duration) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, duration)
        })
    },
    /**
     * @param {type} str - json字符串
     * @description: 传入字符串判断是否json格式
     */
    isJson (str) {
        try {
            JSON.parse(str)
        } catch (e) {
            return false
        }
        return true
    },
    checkPolicies (name) { // 根据permission鉴权
        let configuration = JSON.parse(store.state.vuex_configuration)
        return configuration[name] || null
    },
    existRole(roleName) {
        let user = store.state.vuex_user
        const roles = user.roles
        return !!(roles && roles.includes(roleName))
    },
    deepClone(data) {
        return JSON.parse(JSON.stringify(data))
    },
    reverseObjectKeyValue(object) {
        let newObject = {}
        for (let key in object) {
            newObject[object[key]] = key
        }
        return newObject
    },
    updateApp() {
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate((res) => {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(() => {
                        this.alert({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: (res) => {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    store.commit('$clearLifeData')
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(() => {
                        // 新的版本下载失败
                        this.alert({
                            title: '更新提示',
                            content: '新版本下载失败！请重新登录以适配新版本!',
                            showCancel: false,
                            confirmText: '知道了',
                            success: (res) => {
                                if (res.confirm) {
                                    // 清空缓存
                                    store.commit('$clearLifeData')
                                }
                            }
                        })
                    })
                }
            })
        }
    },
}

export default tools
