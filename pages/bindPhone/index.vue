<template>
    <div class="main">
        <image src="../../static/bindPhone.png" class="imgBp"></image>
        <div class="header">{{rebind ? '更换绑定的手机号' : '为确保账户安全，请绑定手机号'}}</div>
        <div class="formWx" v-if="fromWx">
            <button class="confirm-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信手机号快速验证</button>
            <div class="inputPhone" @click="fromWx = false">输入手机号验证</div>
        </div>
        <div class="fromInput" v-else>
            <div class="input-main tel-input-main">
                <input @input="onInput($event,'tel')" class="input" focus type="number" placeholder="请输入手机号">
                <div class="btn" @click="getVeriCode">{{textBtnVeri}}</div>
            </div>
            <div class="input-main check-code-main">
                <input @input="onInput($event,'code')" class="input" type="number" placeholder="请输入验证码">
            </div>
            <div class="confirm-btn" @click="goBind">确认</div>
            <div class="inputPhone" @click="fromWx = true">返回微信手机号验证</div>
        </div>
        <div class="bottomTxt">
            <div class="contact">
                <div class="line">
                    <div class="c"></div>
                </div>
                <div class="text">用户协议</div>
                <div class="line">
                    <div class="c"></div>
                </div>
            </div>
            <view class="telNum">点击验证即表示您已阅读并同意</view>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                countdown: 0,
                tel: '',
                code: '',
                wxCode: '',
                repeatSubmit: false,
                fromWx: true,// 从微信获取手机号
                rebind: false // 是否是换绑手机号
            }
        },

        computed: {
            ...mapState({
                user: state => state.user,
                launchPageUrl: state => state.launchPageUrl,
                shareOrAuthorize: state => state.shareOrAuthorize,//是否邀请或者授权跳转过来的
            }),
            textBtnVeri() {
                let text = '获取验证码'
                if (this.countdown > 0) {
                    text = this.countdown + '秒'
                    setTimeout(() => {
                        this.countdown -= 1
                    }, 1000)
                }
                return text
            }
        },

        methods: {
            onInput(e, type) {
                this[type] = e.mp.detail.value
            },
            checkTel() {
                const tel = this.tel.replace(/[\s]/g, '')
                if (/^1[0-9]{10}$/.test(tel) === false) {
                    this.$tools.toast({
                        title: '请输入正确的手机号码'
                    })
                    return false
                } else {
                    return true
                }
            },
            getVeriCode() {
                if (this.countdown > 0) return false
                if (!this.checkTel()) return false
                this.code = ''
                this.$api('profile.sendToken', {
                    phoneNumber: this.tel.replace(/[\s]/g, '')
                })
                    .then(res => {
                        this.countdown = 60
                        this.$tools.toast({
                            title: '短信已发送'
                        })
                    })
                    .catch(e => {
                        this.$tools.toast({
                            title: '验证码发送失败，请重新尝试'
                        })
                    })
            },
            getPhoneNumber(e) {
                if (!e.mp.detail.iv) {//获取用户手机号失败
                    this.$tools.alert({
                        content: '获取失败，请手动输入手机号绑定',
                        showCancel: false,
                        success: (res) => {
                            if (res.confirm) {
                                this.fromWx = false
                            }
                        }
                    })
                    return
                }
                //获取成功点击允许
                if (e.mp.detail.errMsg === 'getPhoneNumber:ok') {
                    this.$api('profile.wxBindPhone', {
                        iv: e.mp.detail.iv,
                        code: this.wxCode,
                        encryptedData: e.mp.detail.encryptedData,
                        appId: this.$appConfig.appId
                    }).then(res => {
                        this.backToLastPage()
                    })
                        .catch(e => {
                            let msg = '操作失败，请稍后再试'
                            const res = e.response
                            if (res && res.data.reason) {
                                msg = res.data.reason
                            }
                            this.$tools.toast({title: msg})
                            this.repeatSubmit = false
                            uni.switchTab({ // 一直绑定失败先跳出该页面
                                url: '/pages/user/index'
                            })
                        })

                }
            },
            goBind() {
                if (!this.checkTel()) return false
                if (!this.code) {
                    this.$tools.toast({
                        title: '请输入验证码'
                    })
                    return false
                }
                if (this.repeatSubmit === true) {
                    this.$tools.toast({
                        title: '不可重复提交'
                    })
                    return false
                }
                this.repeatSubmit = true

                this.$api('profile.verifyToken', {
                    phoneNumber: this.tel.replace(/[\s]/g, ''),
                    token: this.code
                }).then(res => {
                    this.backToLastPage()
                })
            },
            backToLastPage(){
                this.$tools.toast({
                    title: '绑定成功'
                })
                this.repeatSubmit = false
                // 跳转回上一页
                const lastPage = this.$tools.getPageUrl(2) || this.launchPageUrl
                uni.redirectTo({
                    url: lastPage,
                    fail: (res) => {
                        if (res.errMsg.includes('tab')) {
                            uni.reLaunch({
                                url: lastPage
                            })
                        } else {
                            this.$tools.toast({
                                title: res.errMsg
                            })
                            this.$tools.goIndex()
                        }
                    }
                })
            }
        },
        mounted() {
            this.rebind = this.$root.$mp.query.rebind
        },
        onShow() {
            wx.login({
                success: res_login => {
                    this.wxCode = res_login.code
                }
            })//回调中调用 wx.login 登录，可能会刷新登录态
            wx.hideHomeButton()
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data())
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        padding: 30rpx;
        min-height: 100vh;
        background-color: #f5f5f5;
        box-sizing: border-box;
    }

    .imgBp {
        width: 40vw;
        height: 40vw;
        margin: 6vw auto;
        text-align: center;
        display: block;
    }

    .header {
        font-size: 30rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0rpx;
        color: #2e2e2e;
        text-align: center;
        margin-bottom: 4vw;
    }

    .inputPhone {
        font-size: 28rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0rpx;
        color: $theme;
        text-align: center;
        margin-top: 4vw;
    }

    .bottomTxt {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 8vw;
        height: 16vw;
    }

    .contact {
        padding: 0 8vw;
        height: 5vw;
        display: flex;
        justify-content: center;
        align-items: center;

        .text {
            text-align: center;
            height: 100%;
            flex: 0 0 152rpx;
            font-size: 26rpx;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0rpx;
            color: #a3a3a3;
        }

        .line {
            flex: 1;
            height: 100%;
            position: relative;

            .c {
                background-color: #d0d0d0;
                height: 1px;
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
            }
        }
    }

    .telNum {
        font-family: PingFangSC-Medium;
        text-align: center;
        padding-top: 6vw;
        font-size: 26rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0rpx;
        color: #a3a3a3;

        image {
            width: 26rpx;
            height: 26rpx;
        }
    }

    .tel-input-main {
        display: flex;

        .input {
            width: 63%;
            padding: 0 10px;
            height: 90rpx;
            line-height: 90rpx;
        }

        .btn {
            flex: 1;
            text-align: center;
            line-height: 90rpx;
            color: #fff;
            background-color: $theme;
        }
    }

    .check-code-main {
        margin-top: 10px;

        .input {
            height: 100%;
            width: 100%;
            padding: 0 10px;
            height: 90rpx;
            line-height: 90rpx;
        }
    }

    .confirm-btn {
        height: 90rpx;
        width: 100%;
        border-radius: 3px;
        text-align: center;
        line-height: 90rpx;
        margin-top: 20px;
        color: #fff;
        background-color: $theme;
    }

    .tip {
        position: absolute;
        bottom: 20px;
        left: 0;
        width: 100%;
        font-size: 13px;
        text-align: center;
    }
</style>
