<template>
  <div>
    <div class="page-main">
      <div class="user-main">
        <div class="user">
          <image
            :src="isLogin ? user.weixinInfo.avatarUrl : '../../static/images/default_user.png'"
            mode="aspectFill"
            class="img"
            :class="{'default': !isLogin}"
            @click="$tools.updateStoreFromStorage"
          ></image>
          <div class="info" v-if="isLogin">
            <div class="name">{{user.name ? user.name : user.weixinInfo.nickName}}</div>
            <div class="score-main" v-if="theFirstScore.scoreId">
              <div class="score">{{theFirstScore.score.name + '：' + theFirstScore.scoreValue}}</div>
              <div class="more-btn" hover-class="g-btn-hover2"
                 @click="onClickScore"
              >
                <span class="text">{{lang.showMore}}</span>
                <van-icon name="down" size="13px" color="#fff"
                  custom-style="display:block;transform:rotate(-90deg)"
                />
              </div>
            </div>
          </div>
          <div class="login-main" v-else
            @click="$tools.userClickToLogin()"
          >
            <div class="title">请点击登录</div>
            <div class="btn" hover-class="g-btn-hover2">
              <span class="text">立即登录</span>
              <van-icon name="down" size="13px" color="#fff"
                custom-style="display:block;transform:rotate(-90deg)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="options" v-if="isLogin && curTenant.id">
        <div class="tenant" @click="goToSelect('tenant')">
          <div class="title">当前{{ appConfig.tenantEntityName }}</div>
          <div class="name">{{curTenant.name || '?'}}</div>
          <div>
            <van-icon size="15px" color="#49cc90" custom-style="display:block" name="arrow-down" />
          </div>
        </div>
      </div>
      <div class="g-operations" v-if="isLogin">
        <div class="item"
          hover-class="g-btn-hover"
          v-if="isManager"
          @click="$tools.jump('/pages/account/index')"
        >
          <span>{{lang.accountManage}}</span>
          <van-icon name="arrow" />
        </div>
        <div class="item"
             hover-class="g-btn-hover"
             @click="$tools.jump('/pages/myApplication/index')"
        >
          <span>{{lang.applyRecord}}</span>
          <van-icon name="arrow" />
        </div>
        <div class="item"
          hover-class="g-btn-hover"
          v-if="isAuditor || isManager"
          @click="$tools.jump('/pages/staff/index?type=Manage')"
        >
          <span>{{lang.personnelManage}}</span>
          <van-icon name="arrow" />
        </div>
        <!--奖品管理-->
        <div class="item"
             hover-class="g-btn-hover"
             v-if="isManager || isPrizeDirector"
             @click="$tools.jump('/pages/prizeList/index?type=Manage')"
        >
          <span>{{lang.prizeManage}}</span>
          <van-icon name="arrow" />
        </div>
        <!--奖品管理end-->
        <!--积分类型管理-->
        <div class="item"
          hover-class="g-btn-hover"
          v-if="isManager && appConfig.appSetting.scoreTypeManageShow"
          @click="$tools.jump('/pages/score/index?type=Manage')"
        >
          <span>{{lang.typeManage}}</span>
          <van-icon name="arrow" />
        </div>
        <!--积分类型管理end-->
        <div class="item"
          hover-class="g-btn-hover"
          v-if="isManager"
          @click="$tools.jump('/pages/rule/folder?type=Manage')"
        >
          <span>{{lang.ruleManage}}</span>
          <van-icon name="arrow" />
        </div>
        <div class="item"
          hover-class="g-btn-hover"
          v-if="!user.phoneNumberConfirmed"
          @click="goBindPhone"
        >
          <span>{{lang.bindPhone}}</span>
          <van-icon name="arrow" />
        </div>
        <div class="item"
          hover-class="g-btn-hover"
          @click="onUserTryReLogin"
        >
          <span>{{lang.reLogin}}</span>
          <van-icon name="arrow" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
  data () {
    const lang = this.$l.user
    const appConfig = this.$appConfig
    return {
      lang,
      appConfig,
      theFirstScore: {}
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      tokens: state => state.tokens,
      curTenant: state => state.curTenant,
      tenantTokens: state => state.tenantTokens,
      autoReloginOnUserPage: state => state.autoReloginOnUserPage
    }),
    isLogin(){
      return this.$tools.isLogin()
    },
    isAuditor () {
      return this.$tools.existRole('auditor', this.user.roles)
    },
    isManager () {
      return this.$tools.existRole('manager', this.user.roles)
    },
    isPrizeDirector(){
      return this.$tools.existRole('prizeDirector', this.user.roles)
    }
  },
  methods: {
    onClickScore() {
      this.$tools.jump('/pages/myScores/index')
    },
    onUserTryReLogin() {
      this.$tools.jump('/pages/login/index?click=1&type=reLogin')
    },
    goBindPhone () {
      this.$tools.jump('/pages/bindPhone/index')
    },
    getAppInformation(func = '') {
      this.$tools.getAppInfo()
      .then((res) => {
        if(!res.phoneNumberConfirmed){
          // console.log('没有绑定手机号')
          wx.redirectTo({
            url: '../bindPhone/index'
          })
        }else {
          this.getUserScores()
          if (func === 'jump') {
            wx.switchTab({ url: '/pages/index/index' })
          }
        }
      })
    },
    getUserScores () {
      this.$api('appUser.detail', { __id: this.user.id })
      .then(res => {
        const score = res.userScores[0]
        this.theFirstScore = score
        this.$store.commit('setData', { dataName: 'myFirstScore', data: res.userScores[0] })
      })
    },
    storageHandleAfterLogin (data) {
      // 记录当前获取accessToken的时间
      const time = new Date().getTime()

      const auth = data.authorization
      this.$tools.setStorage('tokens', {
        access: auth.access_token,
        refresh: auth.refresh_token,
        time
      })
      this.$tools.changeCurrentTenant(data.currentTenant)
      this.$tools.mergeTenantTokens()
    },
    reLogin () {
      wx.login({
        success: res => {
          this.$tools.onLogin({
            weixinMiniProgramType: this.$appConfig.weixinMiniProgramType,
            code: res.code,
            appId: this.$appConfig.appId
          })
          .then(res => {
            this.storageHandleAfterLogin(res)
            this.$tools.getEnumDictionary()
            this.getAppInformation()
          })
        }
      })
    },

    goToSelect () {
      this.$tools.jump('/pages/user/switchTenant')
    }
  },

  onShow () {
    // 成功绑定手机号码后自动重登录
    if (this.autoReloginOnUserPage) {
      this.reLogin()
      this.$store.commit('setData', { dataName: 'autoReloginOnUserPage', data: false })
      return
    }
    if(this.isLogin){
      this.getAppInformation()
    }
  },

  onShareAppMessage () {
    let path = '/pages/index/index'
    if (this.curTenant.id) {
      path += `?tenant=${JSON.stringify(this.curTenant)}`
    }
    return {
      title: this.curTenant.name,
      imageUrl: this.$appConfig.brandPic,
      path
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/static/style/reference.scss';

.login-btn {
  position: fixed!important;
  left: 0;
  right: 0;
  text-align: center!important;
  top: 40%;
  width: 100px;
}
.tips {
  padding: 10px;
}
.page-main {
  background-color: $page-bg;
  min-height: 100vh;
}
.user-main {
  height: 40vw;
  width: 100%;
  background-color: $theme;
  border-radius: 0 0 60vw 60vw / 0 0 8vw 8vw;
  padding: 0 0 0 4vw;
  box-sizing: border-box;
  .user {
    display: flex;
    align-items: center;
  }
  .img {
    width: 16vmin;
    height: 16vmin;
    border-radius: 50%;
    display: block;
    border: 3px solid #fff;
    &.default {
      -webkit-filter: grayscale(100%);
      filter: grayscale(100%);
      background-color: #ececec;
    }
  }
  $user-fs: 3.6vw;
  $user-pl: 3.4vw;
  .info {
    padding-left: $user-pl;
    color: #fff;
  }
  .name {
    font-size: $user-fs;
    font-weight: bold;
  }
  .score-main {
    font-size: $font-size;
    padding-top: 5px;
  }
  .more-btn {
    font-size: $font-size;
    margin-top: 5px;
    line-height: 1;
    padding: 5px 10px;
    border: 1px solid #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    position: relative;
    .text {
      padding-right: 5px;
    }
  }
  .login-main {
    padding-left: $user-pl;
    color: #fff;
    .title {
      font-size: $user-fs;
      font-weight: bold;
    }
    .btn {
      font-size: $font-size;
      margin-top: 5px;
      line-height: 1;
      padding: 5px 10px;
      border: 1px solid #fff;
      border-radius: 5px;
      display: flex;
      align-items: center;
      position: relative;
      .text {
        padding-right: 5px;
      }
    }
  }
}
.options {
  width: 72%;
  min-height: 10vw;
  background-color: #fff;
  border-radius: 6px;
  position: absolute;
  left: 14vw;
  top: 26vw;
  .tenant {
    margin: 0 auto;
    padding: 15px 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      color: $gray;
      font-size: $font-size;
    }
    .name {
      padding-top: 5px;
      font-size: 4.6vw;
      font-weight: bold;
      color: #000;
      text-align: center;
      width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
    }
  }
  .hidden {
    visibility: hidden;
  }
}
  .g-operations{
    margin-top: 24vw;
    .item{
      padding: 3.2vw 2.8vw;
      font-size: $font-size;
    }
  }
</style>
