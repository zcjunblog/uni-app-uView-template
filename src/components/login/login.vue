<template>
    <u-popup v-model="show" :mask-close-able="!inputTenantNameShow" mode="center" border-radius="14" @close="hide">
        <div class="content">
            <div class="avatar">
                <image class="image" :src="appConfig.staticUrl + '/logo.png'" mode="widthFix"></image>
                <div class="name">{{appConfig.appName}}</div>
            </div>
            <u-field
                    v-if="inputTenantNameShow"
                    v-model="tenantName"
                    label-width="70"
                    :label="appConfig.tenantEntityName + ':'"
                    :placeholder="'请输入您所在的' + appConfig.tenantEntityName"
            >
            </u-field>
            <div class="tip" v-else>
                获得您的公开信息(微信头像、昵称等)
            </div>
            <div class="btn">
                <u-button v-if="inputTenantNameShow" ripple @click="inputTenantConfirm">确 认</u-button>
                <u-button style="position: relative;top: 36rpx;" v-else open-type="getUserProfile" @click="getUserProfile" ripple>微信一键授权</u-button>
            </div>
        </div>
    </u-popup>
</template>

<script>
    export default {
        data() {
            const appConfig = this.$appConfig
            return {
                appConfig,
                tenantName:'',
                show: false,
                inputTenantNameShow: false,
                userProfile: {},
            }
        },
        watch:{
            vuex_login_modal(newVal){
                this.show = newVal
            }
        },
        beforeMount(){
            // 挂载之前重置显隐状态
            this.$u.vuex('vuex_login_modal', false)
        },
        methods:{
            hide(){
              this.$u.vuex('vuex_login_modal',false)
            },
            inputTenantConfirm(){
                if(!this.tenantName){
                    return this.$tools.toast({ title: '请输入诊所名称!' })
                }
                this.changeTenantByName(this.tenantName).then(()=>{
                    this.inputTenantNameShow = false
                    this.wxLogin()
                })
            },
            changeTenantByName(tenantName) {
                return new Promise(resolve =>{
                    this.$api('tenant.findByName', { __name: tenantName, __type: this.$appConfig.weixinMiniProgramType }, {removeAuthorization: true})
                        .then(res => {
                            this.$u.vuex('vuex_curTenant', {id: res.tenantId,name: res.name});
                            resolve({id: res.tenantId,name: res.name})
                        })
                } )
            },
            changeTenantById(tenantId) {
                return new Promise(resolve =>{
                    this.$api('tenant.findById', { __id: tenantId, __type: this.$appConfig.weixinMiniProgramType }, {removeAuthorization: true,showLoading:false})
                        .then(res => {
                            this.$u.vuex('vuex_curTenant', {id: res.tenantId,name: res.name});
                            resolve({id: res.tenantId,name: res.name})
                        })
                } )
            },
            onInput (e,type) {
                this[type] = value.replace(/\s+/g,"")
            },
            wxLogin () {
                uni.showLoading({title: '处理中...', mask: true})
                uni.login({
                    provider: 'weixin',
                    success: res_login => {
                        this.$tools.onLogin({
                            lookupUseRecentlyTenant: !this.vuex_curTenant.id,
                            code: res_login.code,
                            appId: this.$appConfig.appId,
                        }, false)
                            .then(res => {
                                if(!res.tenantId){
                                    // 让用户主动输入租户 切换租户后再走登录逻辑
                                    uni.hideLoading()
                                    this.inputTenantNameShow = true
                                }else {
                                    // 切换到最近租户
                                    this.changeTenantById(res.tenantId).then(()=>{
                                        this.handleAfterLogin(JSON.parse(res.rawData))
                                    })
                                }
                            })
                    }
                })

            },
            handleAfterLogin (tokens) {
                this.$tools.setTokens(tokens)
                // 这几个参数都是控制showLoading的
                const reqs = [
                    this.$tools.onHostLogin(false),
                    this.$tools.getEnumDictionary(false),
                    this.$tools.getConfiguration(false)
                ]
                if (wx.getUserProfile){
                    reqs.unshift(this.$tools.updateUserInfo(this.userProfile))
                }
                Promise.all(reqs)
                    .then((res) => {
                        this.$tools.reload()
                        this.$u.vuex('vuex_login_modal',false)
                        this.$tools.getUserInfo().then(res=>{
                            if(!res.phoneNumberConfirmed){
                                this.$tools.jump('/subPages/bindPhone/index',false)
                            }
                        })
                    })
                    .catch((e)=>{ // 错误处理
                        console.log(e)
                        uni.hideLoading()
                        this.$tools.alert({
                            title: '出错提示',
                            content: '抱歉!登录服务发生错误,请您稍后再试!',
                            confirmText: '好的',
                            success:  (res)=> {
                                this.$u.vuex('vuex_login_modal',false)
                                if (res.confirm) {
                                    this.$store.commit('$clearLifeData')
                                }
                            }
                        })
                    })
            },
            getUserProfile(){
                if (wx.getUserProfile){
                    wx.getUserProfile({
                        desc:'用于小程序内头像昵称显示',
                        lang: 'zh_CN',
                        success:res=>{
                            this.userProfile = res.userInfo
                            this.wxLogin()
                        },
                        fail: (err) =>{
                            this.$tools.toast({ title: '您拒绝了授权', duration: 3000})
                        }
                    })
                    return
                }
                this.wxLogin()
            }
        }
    }
</script>

<style scoped lang="scss">
.content{
    width: 520rpx;
    height: 460rpx;
    padding: 30rpx;
}

.tip{
    margin: 20rpx 0;
    text-align: center;
}
.avatar{
    @include flex-vertical;
    align-items: center;
    border-bottom: 1rpx solid $border-color;
    padding-bottom: 20rpx;
    .image{
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
    }
    .name{
        margin-top: 10rpx;
        font-size: $font-size-extra-lg;
    }
}
.btn{
    width: 380rpx;
    height: 80rpx;
    margin: 40rpx auto;
}

</style>
