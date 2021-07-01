<template>
    <layout>
        <div class="wrap-bind" v-if="pageType === 'bind'">
            <div class="content" v-if="loginType === 'weChat'">
                <div class="title">{{vuex_user.phoneNumberConfirmed ? '换绑手机号码' : '绑定手机号码'}}</div>
                <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="getCaptcha login-btn gradient-theme-h">微信手机号快速验证</button>
            </div>
            <div class="content" v-if="loginType === 'phone'">
                <div class="title">{{vuex_user.phoneNumberConfirmed ? '换绑手机号码' : '绑定手机号码'}}</div>
                <input class="u-border-bottom input" type="number" v-model="tel" placeholder="请输入手机号" />
                <div class="tips tip">绑定手机号确保应用功能正常使用</div>
                <button @tap="getVerCode" :disabled="!tel" :style="[inputStyle]" class="getCaptcha">获取短信验证码</button>
            </div>
            <div class="bottom">
                <u-divider ><span class="tip">其他方式绑定</span></u-divider>
                <div class="loginType">
                    <div class="item">
                        <div class="icon" v-if="loginType === 'phone'" @click="loginType = 'weChat'"><u-icon size="80" name="weixin-circle-fill" :color="vuex_theme['color']"></u-icon></div>
                        <div class="icon" v-if="loginType === 'weChat'" @click="loginType = 'phone'"><u-icon size="70" name="shouji" custom-prefix="dt-icon" :color="vuex_theme['color']"></u-icon></div>
                    </div>
                </div>
            </div>
        </div>
        <view class="wrap-code" v-if="pageType === 'code'">
            <view class="key-input">
                <view class="title">输入验证码</view>
                <view class="tips">验证码已发送至 +{{tel.substring(0,3)}}****{{tel.substring(7,11)}}</view>
                <u-message-input :focus="true" :value="codeValue" @change="codeValueChange" @finish="codeInputFinish" :maxlength="maxlength"></u-message-input>
                <view class="captcha theme-color">
                    <text :class="{ noCaptcha: show }" @tap="noCaptcha">收不到验证码点这里</text>
                    <text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
                </view>
            </view>
        </view>
    </layout>
</template>

<script>
    export default {
        data() {
            const appConfig = this.$appConfig
            return {
                appConfig,
                tel: '', //手机号
                code: '', // 验证码
                show: false,
                second: 60,
                timer: null,
                codeValue: '', // 用户输入的验证码
                loginType: 'weChat', // 可选 phone
                pageType: 'bind', // code - 输入验证码
                maxlength: 6,
            }
        },
        computed: {
            inputStyle() {
                let style = {
                    backgroundColor: this.$u.color['bgColor']
                };
                if(this.tel) {
                    style.color = "#fff";
                    style.backgroundColor = this.vuex_theme['color']
                }
                return style;
            }
        },
        methods: {
            codeValueChange(e){
                this.codeValue = e
            },
            // 收不到验证码选择时的选择
            noCaptcha() {
                uni.showActionSheet({
                    itemList: ['更换手机号', '重新获取验证码'],
                    success: (res)=> {
                        console.log(res)
                        if(res.tapIndex === 1){
                            // 重新获取验证码
                            this.getVerCode()
                        }else {
                            // 更换手机号
                            this.pageType = 'bind'
                        }
                    }
                });
            },
            codeInputFinish(){
                console.log(this.codeValue)
                this.$api('appUser.BPNVerifyCaptcha', {
                    phoneNumber: this.tel.replace(/[\s]/g, ''),
                    captcha: this.codeValue
                })
                    .then(res => {
                        this.bindSuc()
                    })
            },
            getVerCode () {
                if (!this.$u.test.mobile(this.tel)){
                    return this.$tools.toast({title: '手机号格式不正确!'})
                }
                this.codeValue = ''
                this.$api('appUser.BPNGetCaptcha', {
                    phoneNumber: this.tel.replace(/[\s]/g, '')
                })
                    .then(res => {
                        this.pageType = 'code'
                        this.$tools.toast({title: '短信已发送,请注意查收'})
                        this.timer = setInterval(() => {
                            this.second--
                            if (this.second <= 0) {
                                this.show = true
                                clearInterval(this.timer);
                            }
                        }, 1000);
                    })
                    .catch(e => {
                        this.$tools.toast({
                            title: '验证码发送失败，请稍后再试'
                        })
                    })
            },
            getPhoneNumber(e) {
                uni.showLoading({title: '请稍等...', mask: true})
                if (!e.mp.detail.iv) {//获取用户手机号失败
                    uni.hideLoading()
                    this.$tools.alert({
                        title:'系统提示',
                        content: '获取微信绑定手机号失败，请手动输入手机号',
                        showCancel: false,
                        success: (res) => {
                            if (res.confirm) {
                                this.loginType = 'phone'
                            }
                        }
                    })
                    return
                }
                //获取成功
                if (e.mp.detail.errMsg === 'getPhoneNumber:ok') {
                    // 绑定手机
                    this.bindPhone(e.mp.detail)
                }
            },
            bindSuc(){
                this.$tools.reLogin().then(()=>{
                    this.$tools.toast({title: '绑定成功!',icon: 'success',duration:3000})
                    this.$tools.back()
                })
            },
            bindPhone(e) {
                return new Promise(resolve => {
                    wx.login({
                        success: res_login => {
                            this.$api('appUser.BPNVFromWeixin', {
                                iv: e.iv,
                                code: res_login.code,
                                encryptedData: e.encryptedData,
                                appId: this.$appConfig.appId
                            })
                                .then(res => {
                                    this.bindSuc()
                                })
                        }
                    })
                })
            },
        }
    };
</script>

<style lang="scss" scoped>
    page{
        height: auto;
    }
    .wrap-bind {
        height: 100vh;
        width: 100vw;
        font-size: 28rpx;
        background: #fff;
        .content {
            width: 600rpx;
            margin: auto;
            padding-top: 220rpx;

            .title {
                text-align: left;
                font-size: 60rpx;
                font-weight: 500;
                margin-bottom: 100rpx;
            }
            .input {
                min-height: 50rpx;
                text-align: left;
                margin-bottom: 10rpx;
                padding-bottom: 6rpx;
            }
            .tips {
                color: $u-type-info;
                margin-bottom: 60rpx;
                margin-top: 8rpx;
            }
            .getCaptcha {
                background-color: rgb(253, 243, 208);
                color: $u-tips-color;
                border: none;
                font-size: 30rpx;
                padding: 12rpx 0;

                &::after {
                    border: none;
                }
            }
            .alternative {
                color: $u-tips-color;
                display: flex;
                justify-content: space-between;
                margin-top: 30rpx;
            }
        }
        .bottom {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 360rpx;
            .loginType {
                margin-top: 40rpx;
                .item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: $u-content-color;
                    font-size: 28rpx;
                    height: 80rpx;
                }
            }
        }
    }
    .login-btn{
        color: #fff!important;
    }
    .wrap-code {
        padding: 74rpx;
        background: #fff;
        .box {
            margin: 30rpx 0;
            font-size: 30rpx;
            color: 555;
        }

        .key-input {
            padding: 30rpx 0;
            text {
                display: none;
            }
        }

        .title {
            font-size: 50rpx;
            color: #333;
        }

        .key-input .tips {
            font-size: 30rpx;
            color: #333;
            margin-top: 20rpx;
            margin-bottom: 60rpx;
        }
        .captcha {
            font-size: 30rpx;
            margin-top: 40rpx;
            .noCaptcha {
                display: block;
            }
            .regain {
                display: block;
            }
        }
    }

</style>
