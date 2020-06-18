import api from '@/api'
import store from '@/stores'
import appConfig from '@/utils/appConfig'

const localStorageNames = [ 'user'] // Object
const localStorageNamesArray = ['rules'] // Array 用来解决小程序热启动vuex储存值丢失的问题

const tools = {
    jump: (url) => {
        url && wx.navigateTo({
            url: url
        })
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

    toLogin(emptyTokens = false) {
        const tokens = {}
        if (!emptyTokens) {
            // 保留refresh token
            tokens.refresh = store.state.tokens.refresh || ''
        }
        // 对比上一个跳转登陆存下的时间戳 3.5秒内不再重复跳转
        if (new Date().getTime() < wx.getStorageSync('jumpLoginTime')) {
            tokens.refresh = ''
            this.setStorage('tokens', tokens)
            return //不重复跳转
        }
        this.setStorage('tokens', tokens)

        wx.redirectTo({
            url: loginPageUrl,
            success: () => {
                this.setStorage('jumpLoginTime', new Date().getTime() + 3500)
            }
        })
    },

    isNeedToLogin() {
        if (this.isLogin()) {
            return false
        } else {
            this.userClickToLogin()
            return true
        }
    },

    goIndex() {
        wx.switchTab({
            url: '/pages/index/index' // 首页
        })
    },

    formatLargeString: (str, maxLength) => {
        return str.length <= maxLength ? str : str.substring(0, maxLength - 1) + '...'
    },

    formatTime(date, fmt, isStr = true) {
        if (!date) {
            return '-'
        }
        if (isStr) {
            date = date === 'now' ? new Date() : new Date(date)
        }
        var o = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S+': date.getMilliseconds()
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                if (k === 'y+') {
                    fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length))
                } else if (k === 'S+') {
                    var lens = RegExp.$1.length
                    lens = lens === 1 ? 3 : lens
                    fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens))
                } else {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                }
            }
        }
        return fmt
    },

    formatMoney(money = 0) {
        return money.toFixed(2)
    },

    reverseObjectKeyValue(object) {
        let newObject = {}
        for (let key in object) {
            newObject[object[key]] = key
        }
        return newObject
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

    /* 获取当前页带参数的url */
    splicePageUrlWithParams(obj) {
        const path = obj.route
        const query = obj.options
        // 拼接url的参数
        var urlWithParams = '/' + path + '?'
        for (let key in query) {
            const value = query[key]
            urlWithParams += key + '=' + value + '&'
        }
        urlWithParams = urlWithParams.substring(0, urlWithParams.length - 1)
        return urlWithParams
    },

    alert(config) {
        wx.showModal({
            title: '提示',
            confirmColor: '#49cc90',
            ...config
        })
    },

    toast(config) {
        wx.showToast({
            icon: 'none',
            ...config
        })
    },

    existRole(roleName, data) {
        const user = wx.getStorageSync('user')
        const roles = data ? data : user.roles
        return !!(roles && roles.includes(roleName));
    },

    copy(data, title = '复制成功') {
        if (!data && data !== 0) {
            return this.toast({title: '复制的内容不存在'})
        }
        wx.setClipboardData({
            data,
            success: () => {
                this.toast({title})
            }
        })
    },

    pageScrollTo(config) {
        config === 'top' && (config = {scrollTop: 0, duration: 0})
        wx.pageScrollTo(config)
    },

    updateStoreFromStorage() {
        localStorageNames.forEach(dataName => {
            const data = wx.getStorageSync(dataName)
            if (data) {
                store.commit('setData', {dataName, data})
            } else {
                store.commit('setData', {dataName, data: {}})
            }
        })
        localStorageNamesArray.forEach(dataName => {
            const data = wx.getStorageSync(dataName)
            if (data.length > 0) {
                store.commit('setData', {dataName, data})
            } else {
                store.commit('setData', {dataName, data: []})
            }
        })
    },

    checkAppEnv() {
        const appStorageEnv = wx.getStorageSync('appEnv')
        if (!appStorageEnv || appStorageEnv !== appConfig.env) {
            localStorageNames.forEach(dataName => {
                this.setStorage(dataName, {})
            })
        }
        if (appStorageEnv !== appConfig.env) {
            wx.setStorageSync('appEnv', appConfig.env)
        }
    },

    deepClone(data) {
        return JSON.parse(JSON.stringify(data))
    },

    setStorage(key, data, sync = true) {
        if (sync) {
            wx.setStorageSync(key, data)
            store.commit('setData', {dataName: key, data: data})
        } else {
            return new Promise((resolve, reject) => {
                wx.setStorage({
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

    // 记录onLaunch时的path和query，防止onLaunch中调用的接口
    // 报401后重定向至登录页导致最初页面记录丢失，从而在getCurrentPages中拿不到lastPage
    recordLaunchPageUrl(launch) {
        const pageUrl = this.splicePageUrlWithParams({
            route: launch.path,
            options: launch.query
        })
        store.commit('setData', {
            dataName: 'launchPageUrl',
            data: pageUrl
        })
    },

    /**
     * @param {number} lastIndex 路由数组中从尾部(1)开始数，要获取的路由所在的位置
     * @param {boolean} withParams 返回的Url是否携带params
     * @returns {string}
     */
    getPageUrl(lastIndex, withParams = true) {
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages()
        if (pages.length > 0 && pages.length >= lastIndex) {
            const thePage = pages.splice(-lastIndex, 1)[0]
            if (withParams) {
                return this.splicePageUrlWithParams(thePage)
            } else {
                return `/${thePage.route}`
            }
        } else {
            console.log('pages are empty or lastIndex error')
            return ''
        }
    },
    //scene格式处理
    sceneConvertToGuid(str) {
        return [str.slice(0, 8), str.slice(8, 12), str.slice(12, 16), str.slice(16, 20), str.slice(20)].join('-');
    },
    /**
     * 微信支付函数
     * @param {object} res 微信支付所需要的参数
     * @param {callback} successData 支付成功的回调
     * @param {callback} errorData 支付失败的回调函数
     */
    wxPay(res, successData, errorData) {
        console.log(res)
        // nonceStr，timeStamp，package，signType，paySign
        wx.requestPayment({
            provider: 'wxpay',
            timeStamp: res.timeStamp.toString(),
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: (data) => {
                this.toast({
                    title: '支付完成',
                    duration: 1500,
                    icon: 'success',
                    success: () => {
                        successData(data)
                    }
                })
            },
            fail: (data) => {
                if (errorData) {
                    errorData(data)
                }
                // errMsg: "requestPayment:fail cancel
                if (data.errMsg === 'requestPayment:fail cancel') {
                    this.toast({
                        title: '已取消支付',
                        icon: 'success',
                        duration: 1500
                    })
                } else {
                    this.toast({
                        title: '支付失败，请联系管理员！',
                        duration: 1500
                    })
                }
            }
        })
    },
    /**
     * @param {type} checkValue - 查询方法的返回的比对值
     * @return {type} suc - 查询成功的回调
     * @return {type} err - 查询失败的回调
     * @description:三步查询法,传入某查询函数的返回值
     */
    reCheck(checkValue, suc, err){
        let duration = 0
        if(checkValue){ // checkValue存在或为true -> 查询成功
            suc(checkValue)
        }else{
            if(err){
                duration += 1500  // 即0s 1.5s 3s ... 每次延长1.5s后再次查询
                setTimeout(()=>{
                    err(duration) // duration可用来判断超时
                },duration)
            }else{
                new Error('查询失败,无err回调!')
            }
        }
    }
}

export default tools
