<script>
    export default {
        onLaunch(launch) {
            this.$tools.updateApp() // 检测更新
            this.$tools.checkAppEnv() // 沙盒和正式服切换的时候清空用户信息(开发用)
        },
        onShow() {
            // 更新缓存值到vuex 这个必须放onshow 不能改动
            this.$tools.updateStoreFromStorage()
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    }
</script>

<style lang="scss">
    /*
    *当前vant-weapp版本: "1.4.0-beta.3"
    *线上最低支持小程序基础库: 1.9.9 版本
    *最后更新时间: 2020-7-15
    *注意:uni.scss里面变量可以保留，而其他的css都放到app.vue里 否则编译后会导致每个wxss文件重复加载样式
    */
    @import './style/global.scss';
    @font-face {
        font-family: 'iconfont';
        src: url('//at.alicdn.com/t/font_1921111_h14b9qc74zm.ttf') format('truetype');
    }
    .iconfont {
        font-family: "iconfont" !important;
        font-size: 24rpx;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

</style>
