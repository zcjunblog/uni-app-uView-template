<script>
    export default {
        onLaunch(launch) {
            this.$tools.updateApp() // 检测更新
            this.$tools.recordLaunchPageUrl(launch)
            this.$tools.checkAppEnv()// 沙盒和正式服切换的时候清空用户信息(开发用)
        },
        onShow() {
            // 更新缓存值到vuex
            this.$tools.updateStoreFromStorage()
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    }
</script>

<style lang="scss">
    @import '@/static/style/global.scss';

    @font-face {
        font-family: 'iconfont';
        src: url('//at.alicdn.com/t/font_1921111_l109l4q3fo.ttf') format('truetype');
    }
    .iconfont {
        font-family: "iconfont" !important;
        font-size: 24rpx;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    /*
    *当前vant-weapp版本: "version": "1.4.0-beta.3"
    *线上最低支持小程序基础库 1.9.9 版本
    *更新时间: 2020-7-15
    */
</style>
