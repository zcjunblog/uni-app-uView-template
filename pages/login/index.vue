<template>
  <view class="main">
    <div class="top-bg">
      <div class="welcome">
        <p>嗨，欢迎来到{{appConfig.appName}}！</p>
        <p>准备开启心得征途吧~</p>
      </div>
      <div class="avatar">
        <image
          @error="errorImage"
          class="img"
          mode="aspectFit"
          :src="appConfig.brandPic">
        </image>
      </div>
    </div>
    <div class="login-button-container">
      <button @getuserinfo="wxLogin"
        class="login-button"
        hover-class="g-btn-hover-scale"
        open-type="getUserInfo"
      >
        <image class="wechat" src="../../static/images/wechat.png"> </image>
        微信一键{{userClick ? '重登' : '登录'}}
      </button>
      <div class="reject-button" @click="rejectLogin">我是游客，<span class="back">暂不登录</span></div>
    </div>
    <!--<div class="text-desc">点击登录即代表同意《义齿家xxx协议书》</div>-->
    <div class="bottom-bg">
      <div class="water-group">
        <image class="water water1" src="../../static/wave2.png"> </image>
        <image class="water water2" src="../../static/wave2.png"> </image>
        <image class="water water3" src="../../static/wave2.png"> </image>
      </div>
    </div>
  </view>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    const appConfig = this.$appConfig // 大括号语法不支持直接获取$appConfig
    return {
      appConfig,
      loading:false,
      userClick: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      tokens: state => state.tokens,
      launchPageUrl: state => state.launchPageUrl
    })
  },
  mounted() {
    const query = this.$root.$mp.query
    this.userClick = Boolean(query.click) // 用户主动点击登录
  },
  methods: {
    errorImage (e) {
      this.$tools.toast({
        title: e.mp.detail.errMsg
      })
    },
    rejectLogin () {
      const routes = getCurrentPages()
      const tabRoutes = [
        'pages/index/index',
        'pages/user/index'
      ]

      // 判断第一个路由是否是Tab页路由
      const firstRouteInTabs = tabRoutes.includes(routes[0].route)
      if ((routes.length === 2 && firstRouteInTabs) || routes.length > 2) {
        uni.navigateBack({
          delta: 1
        })
      } else {
        // 通过分享链接进来需要强制登录，但用户拒绝的情况进此
        this.$tools.goIndex() // 推荐回首页
      }
    },
    wxLogin () {
      uni.showLoading({
        title: '请稍等...',
        mask: true
      })
      uni.login({
        success: res_login => {
          uni.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            data: {
              code: res_login.code
            },
            success: res => {
              uni.hideLoading()
              this.$api('Login.onLogin', {
                iv: res.iv,
                lookupUseRecentlyTenant: false,
                code: res_login.code,
                encryptedData: res.encryptedData,
                appId: this.$appConfig.appId,
                rawData: res.rawData,
                signature: res.signature,
                userInfo: res.userInfo
              }, {
                removeAuthorization: true
              }).then(res => {
                // 存下token
                this.$tools.setTokens(res)
                // 存下token解码信息
                this.$tools.decodeAccessToken(res)
                this.handleAfterLogin()
              })
            }
          })
        }
      })
    },
    backToLastPage(){
      if (this.userClick) {
        // 用户主动登录的情况
        uni.navigateBack({
          delta: 1
        })
      } else {
        // 其他情况
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
    handleAfterLogin () {
      // 获取 用户信息 枚举字典...
      const reqs = [this.$tools.getMyProfile(), this.$tools.getEnumDictionary(),this.$tools.getConfiguration()]
      Promise.all(reqs)
      .then((res) => {
        this.$tools.setStorage('user', res[0])
        if(!res[0].phoneNumber){
          //  没有绑定手机号
          uni.redirectTo({
            url: '/pages/bindPhone/index'
          })
        }else { // 返回上一页
          this.backToLastPage()
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
page,.main{
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #fff;
}
.text-desc {
  color: #000;
  font-size: 24rpx;
  text-align: center;
  margin: 60rpx auto;
}
.login-button-container {
  margin-top: 30vh;
}
.reject-button{
  color: #C0C0C0;
  font-size: $font-size;
  text-align: center;
  .back{
    color: $theme-dark;
  }
}
.login-button {
  color: #fff;
  background-color: $theme-dark;
  height: 80rpx;
  line-height: 80rpx;
  margin: 8vw;
  font-size: $font-size;
  position: relative;
  &::after {
    border: none;
  }
  .wechat{
    width: 36rpx;
    height: 30rpx;
    vertical-align: middle;
    padding-right: 1vw;
  }
}
.top-bg{
  width: 100%;
  height: 280rpx;
  background:$theme-dark;
  position: relative;
  transform: rotateZ(-5deg) scale(1.5);
  .welcome{
    color: #fff;
    font-size: $font-size;
    position: absolute;
    top: 38%;
    left: 22%;
    transform: rotateZ(5deg) scale(1);
  }
  .img {
    display: block;
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    margin: 0 auto;
    position: absolute;
    top: 70%;
    right: 22%;
    background: #fff;
    transform: rotateZ(5deg) scale(1);
    border: 4rpx solid #fff;
  }
}
.bottom-bg {
  width: 100%;
  margin: auto;
  background: $theme-dark;
  position: absolute;
  bottom: 0;
  transform: rotate(180deg);
}


.water-group {
  position: relative;
  height: 80px;
  width: 100%;
  overflow: hidden;
}

.water-group .water {
  position: absolute;
  width: 200%;
  height: 100%;
  background-size: 50% 100%;
}

.water-group .water1 {
  top: 10px;
  left: -100%;
  opacity: 0.2;
  animation: water-right 20s infinite linear;
}

.water-group .water2 {
  top: 20px;
  left: 0;
  opacity: 0.3;
  animation: water-left 30s infinite linear;
}

.water-group .water3 {
  top: 34px;
  left: -100%;
  animation: water-right 40s infinite linear;
}

@keyframes water-right {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1)
  }

  50% {
    transform: translateX(25%) translateZ(0) scaleY(0.85)
  }

  100% {
    transform: translateX(50%) translateZ(0) scaleY(1)
  }
}

@keyframes water-left {
  from {
    transform: translate(0%, 0px);
  }

  to {
    transform: translate(-50%, 0px);
  }
}
</style>
