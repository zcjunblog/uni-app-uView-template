<template>
  <div class="main">
    <!--顶部个人信息-->
    <div class="user-main">
      <div class="user">
        <open-data type="userAvatarUrl" class="img" v-if="isLogin"></open-data>
        <image
                v-else
                src="../../static/images/default_user.png"
                mode="aspectFill"
                class="img"
                :class="{'default': !isLogin}"
        ></image>
        <div class="info" v-if="isLogin">
          <div class="name"><open-data type="userNickName"></open-data></div>
          <div class="score-main">
            <div class="score">{{''}}</div>
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
    <div class="content">
      <!--余额,优惠卷信息-->
      <div class="g-card">
        <div class="info">
          <div class="info-item" @click="$tools.jump('/pages/storedValueCard/index')">
            <div class="num">00.00 <span>元</span></div>
            <div class="txt">账户余额</div>
          </div>
          <div class="info-item">
            <div class="num">0 <span>张</span></div>
            <div class="txt">优惠卡券</div>
          </div>
        </div>
      </div>
      <!--各功能入口-->
      <div class="g-card">
        <div class="g-operations">
          <!--功能入口-->
          <div class="item"
               hover-class="g-btn-hover" hover-stay-time="100"
               @click="$tools.jump('')"
          >
            <div class="item-left">
              <span class="iconfont icon">&#xe600;</span>
              <span>资质认证</span>
            </div>
            <div class="item-right">
              <van-icon class="icon" color="green" name="passed" />已认证
            </div>
          </div>
          <!--功能入口-->
          <div class="item icon-align"
               hover-class="g-btn-hover" hover-stay-time="100"
               @click="$tools.jump('/pages/patientManage/index')"
          >
            <div class="item-left">
              <span class="iconfont icon">&#xe8f4;</span>
              <span>功能入口</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <!--功能入口-->
          <div class="item"
               hover-class="g-btn-hover" hover-stay-time="100"
               @click=""
          >
            <div class="item-left">
              <span class="iconfont icon">&#xe666;</span>
              <span>功能入口</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <!--功能入口-->
          <div class="item icon-align"
               hover-class="g-btn-hover" hover-stay-time="100"
               @click=""
          >
            <div class="item-left">
              <span class="iconfont icon">&#xe8f4;</span>
              <span>功能入口</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <!--重新登陆-->
          <div class="item"
               hover-class="g-btn-hover" hover-stay-time="100"
               @click="$tools.jump('/pages/login/index?click=1')"
          >
            <div class="item-left">
              <span class="iconfont icon">&#xe807;</span>
              <span>重新登录</span>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <!--如果页面空余充足 这里可以放个广告图片 不需要可以删掉-->
      <div class="g-card" v-if="1">
        <div class="ad-img">
          <div class="tip">广告</div>
          <img src="http://yanxuan.nosdn.127.net/0fa9287b6c329d0a7137818fd060351c.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
  },
  onShow(){

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.main{
  height: 100%;
  width: 100%;
  position: relative;
}
.user-main {
  height: 250rpx;
  width: 100%;
  background-color: $theme;
  border-radius: 0 0 5vw 5vw / 0 0 0.5vw 0.5vw;
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
    overflow: hidden;
    &.default {
      -webkit-filter: grayscale(100%);
      filter: grayscale(100%);
      background-color: #ececec;
    }
  }
  $user-fs: 36rpx;
  $user-pl: 28rpx;
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
  .content{
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    font-size: $font-size;
    position: absolute;
    top: 150rpx;

    .info{
      height: 120rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .info-item{
        flex: 1;
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:after{
          content:'';
          position: absolute;
          right: 0;
          top: 25rpx;
          height: 70rpx;
          width: 3rpx;
          background-color: #e5e5e5;
        }
        &:last-child{
          &:after{
            content:none;
          }
        }
        .num,.txt{
          font-size: $font-size;
        }
        .num{
          font-size: 40rpx;
          color: $theme-dark;
          font-weight: bold;
          span{
            font-size: 24rpx;
            position: relative;
            top: -3rpx;
          }
        }
        .txt{
          color: #656565;
        }
      }
    }
    .item-left,.item-right{
      display: flex;
      align-items: center;
      .icon{
        padding-right: 5rpx;
      }
    }
    .item-left{
      .icon{
        font-size: 40rpx;
      }
      .icon-align{
        position: relative;
        top: -2rpx;
      }
    }
    .ad-img{
      width: 100%;
      height: 240rpx;
      position: relative;
      overflow: hidden;
      border-radius:10rpx;
      .tip{
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.3);
        height: 32rpx;
        width: 48rpx;
        font-size: 20rpx;
        color:#fff;
        padding: 0 5rpx;
        border-radius:0 0 10rpx 0;
      }
      image{
        height: 100%;
        width: 100%;
      }
    }
  }
.setEmail{
  font-size: $font-size;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 40rpx;
  .label{
    flex: 0 0 100rpx;
  }
  .email-input{
    flex: 1;
  }
}
.recipient-content{
  font-size: $font-size;
  padding: 40rpx 80rpx;
  text-align: left;
}
</style>
<style lang="scss">
  page{
    height: 100%;
  }
  .van-radio-recipient{
    margin-top: 16rpx;
  }
</style>
