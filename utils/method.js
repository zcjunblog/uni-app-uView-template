/**
 * @Created By zhaozc
 * @date 2020/8/11
 * @Description: 抽离tools.js里不涉及页面路由和api调用的功能型纯函数单独维护(针对项目特性的公用方法放tools里)
 */
let reCheckDuration = 1500 // reCheck方法超时判定
export default {
    /**
     * 返回上一页(某一页)
     * @param {number} delta - 返回第几页
     * @return {type} argName - description
     */
    back(delta = 1) {
        uni.navigateBack({
            delta
        })
    },

    /**
     * 价格格式化,保留小数点后多少位
     * @param {number} money - 金钱数额
     * @param {number} decimal - 小数点位数
     * @return {number} 保留/去除小数位后的数字
     */
    formatMoney(money, decimal = 2) {
        return money.toFixed(2)
    },

    /**
     * 时间格式化
     * @param {string|number} date - 传入时间日期,时间戳
     * @param {string} fmt - 传入输出的格式 例如'yyyy-MM-dd hh:mm'
     * @param {boolean} isStr - 传入的date是否是字符串
     * @return {string} fmt - 输出符合fmt格式的日期字符串
     */
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

    /**
     * 获取指定时区的年、月、日、小时 获取时间戳无需使用此方式utc+0时间戳是与utc+8时间戳一致的
     * @param {number} offset - 传入指定时区 例如: utc+x时offset就传x 中国一般是+8
     * @return {string} 输出指定时区日期字符串 例如: Wed Aug 26 2020 17:02:08 GMT+0800 (中国标准时间)
     */
    getOffsetDate(offset) {
        return new Date(
            Date.now() + (new Date().getTimezoneOffset() + (offset || 0) * 60) * 60000
        )
    },

    /**
     * 校验手机号
     * @param {number} phone - 传入手机号
     * @return {boolean} bool - 返回手机号输入是否合法 false：不合法
     * @description:
     */
    checkPhone(phone) {
        return /^1[34578]\d{9}$/.test(phone);
    },

    /**
     * 校验金额
     * @param {number} amount - 出入金额数目
     * @return {type} argName - 返回金额数目输入是否合法 false：不合法
     * @description:
     */
    checkAmount(amount){
        return /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(amount);
    },

    /**
     * 校验邮箱
     * @param {string} email - 传入邮箱账号(英文字母为小写)
     * @return {boolean} 返回邮箱是否合法 false：不合法
     */
    checkMail(email) {
        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        return reg.test(email)
    },

    /**
     * 去掉value为空的键值对
     * @param {object} obj - 传入对象
     * @return {object} param - 过滤后的对象
     */
    filterNullObj(obj) {
        const param = {};
        if (obj === null || obj === undefined || obj === "") return param;
        for (const key in obj) {
            if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
                param[key] = obj[key];
            }
        }
        return param;
    },

    /**
     * 反转键值对
     * @param {object} object - 传入对象
     * @return {object} newObject - 返回键值互换位置后的对象
     */
    reverseObjectKeyValue(object) {
        let newObject = {}
        for (let key in object) {
            newObject[object[key]] = key
        }
        return newObject
    },

    /**
     * 微信支付函数
     * @param {object} res 微信支付所需要的参数
     * @param {callback} successData 支付成功的回调
     * @param {callback} errorData 支付失败的回调函数
     */
    wxPay(res, successData, errorData) {
        // nonceStr，timeStamp，package，signType，paySign
        wx.requestPayment({
            provider: 'wxpay',
            timeStamp: res.timeStamp.toString(),
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: (data) => {
                uni.showToast({
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
                    uni.showToast({
                        title: '已取消支付',
                        icon: 'success',
                        duration: 1500
                    })
                } else {
                    uni.showToast({
                        title: '支付失败，请联系管理员！',
                        duration: 1500
                    })
                }
            }
        })
    },
    /**
     * "三步查询法"
     * @param {type} checkValue - 查询依据 checkValue为true时查询成功
     * @param {callback} suc - 查询成功的回调
     * @param {callback} err - 查询失败的回调
     */
    reCheck(checkValue, suc, err) {
        if (checkValue) { // checkValue存在或为true -> 查询成功
            suc(checkValue)
        } else {
            if (err) {
                reCheckDuration += 1500  // 即0s 1.5s 3s ... 每次延长1.5s后再次查询
                setTimeout(() => {
                    err(reCheckDuration) // duration可用来判断超时
                }, reCheckDuration)
            } else {
                new Error('查询失败,无err参数!')
            }
        }
    },
    /**
     * 复制文字
     * @param {string|number} data - 复制内容
     * @param {string} title - 复制操作执行后的提示
     */
    copy(data, title = '复制成功') {
        if (!data && data !== 0) {
            return uni.showToast({title: '复制的内容不存在'})
        }
        uni.setClipboardData({
            data,
            success: () => {
                uni.showToast({title})
            }
        })
    },
}
