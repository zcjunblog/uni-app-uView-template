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
        return money.toFixed(decimal)
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
     * 校验接口返回是否存在某属性值
     * @param {type} checkValue - 查询依据 checkValue为true时查询成功
     * @param {callback} suc - 查询成功的回调
     * @param {callback} err - 查询失败的回调
     */
    reCheck(checkValue, suc, err) {
        if (checkValue) { // checkValue存在或为true -> 查询成功
            suc(checkValue)
        } else {
            if (err) {
                reCheckDuration += 500  // 即0s 1.5s 3s ... 每次延长1.5s后再次查询
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
    /**
     * 校验身份证
     * @param {string|number} id - 身份证号
     * @return {object}  status: 1 "验证通过!", 0 //校验不通过
     * @description:
     */
    verifyIDCard(id) {
        if (!id) {
            return {
                'status': 0,
                'msg': '请输入您的身份证号码!'
            };
        }
        let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        // 号码规则校验
        if (!format.test(id)) {
            return {
                'status': 0,
                'msg': '请核对您的身份证号码!'
            };
        }
        // 区位码校验
        // 出生年月日校验   前正则限制起始年份为1900;
        let year = id.substr(6, 4), //身份证年
            month = id.substr(10, 2), //身份证月
            date = id.substr(12, 2), //身份证日
            time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
            now_time = Date.parse(new Date()), //当前时间戳
            dates = (new Date(year, month, 0)).getDate() //身份证当月天数
        if (time > now_time || date > dates) {
            return {
                'status': 0,
                'msg': '请核对您的身份证出生日期!'
            }
        }
        //校验码判断
        var c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] //系数
        var b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] //校验码对照表
        var id_array = id.split("");
        var sum = 0;
        for (var k = 0; k < 17; k++) {
            sum += parseInt(id_array[k]) * parseInt(c[k]);
        }
        if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
            return {
                'status': 0,
                'msg': '请核对您的身份证校验码!'
            }
        }
        return {
            'status': 1,
            'msg': '校验通过'
        }
    },

    /**
     * 合并含有相同项的数组 [[x,y,z],[x,y],[a,b]] = >[[x,y,z],[a,b]]
     * @param {array} arr - 二维数组
     * @return {array}  合同含有相同项后的数组
     * @description:
     */
    repeatItemArrTrans(arr) {
        return arr.reduce((list, subList) => {
            const set = list.find(set => {
                return subList.some(num => set.has(num))
            })
            if (set) {
                subList.forEach(set.add.bind(set))
            } else {
                list.push(new Set(subList))
            }
            return list;
        }, [])
            .map(set => {
                return [...set]
            })
    },
    /**
     * 将传入data数据中keys包含的项转为obj格式
     * @param {object} data - 传入的数据
     * @param {array} keys - data中需要转换为obj格式项的键名
     * @return {object}  转换后的数据
     * @description: 适配EF Core的Microsoft.Text.Json库,转换被序列化后的额外属性
     */
    responseParse(data,keys){
        let newObj = Object.assign({}, data)
        for(let key in data){
            if(keys.includes(key)){
                newObj[key] = JSON.parse(data[key])
            }
        }
        return newObj
    },
    /**
     * 将传入data数据中keys包含的项转为string格式
     * @param {object} data - 传入的数据
     * @param {array} keys - data中需要转换为string格式项的键名
     * @return {object}  转换后的数据
     * @description:适配EF Core的Microsoft.Text.Json库,序列化传入接口的额外属性数据
     */
    paramsParse(data,keys){
        let newObj = Object.assign({}, data)
        for(let key in data){
            if(keys.includes(key)){
                newObj[key] = JSON.stringify(data[key])
            }
        }
        return newObj
    },
    /**
     * 社会统一信用代码校验
     * @param {string} Code - 传入社会统一信用代码编号
     * @return {boolean} 返回校验结果是否合法 false：不合法
     */
    checkSocialCreditCode(Code) {
        var patrn = /^[0-9A-Z]+$/;
        //18位校验及大写校验
        if ((Code.length !== 18) || (patrn.test(Code) === false)) {
            return {result: false, msg: "请检查机构组织代码是否为18位且为大写！"}
        } else {
            var anCode;//统一社会信用代码的每一个值
            var anCodeValue;//统一社会信用代码每一个值的权重
            var total = 0;
            var weightedFactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
            var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
            //不用I、O、S、V、Z
            for (var i = 0; i < Code.length - 1; i++) {
                anCode = Code.substring(i, i + 1);
                anCodeValue = str.indexOf(anCode);
                total = total + anCodeValue * weightedFactors[i];
                //权重与加权因子相乘之和
            }
            var logicCheckCode = 31 - total % 31;
            if (logicCheckCode === 31) {
                logicCheckCode = 0;
            }
            var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
            var Array_Str = Str.split(',');
            logicCheckCode = Array_Str[logicCheckCode];


            var checkCode = Code.substring(17, 18);
            if (logicCheckCode !== checkCode) {
                console.info("不是有效的统一社会信用编码！");
                return {result: false, msg: "请检查机构组织代码是否填写正确！"}
            }
            return {result: true, msg: "填写正确"};
        }
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
}

