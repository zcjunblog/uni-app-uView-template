<script>
    export default {
        methods: {
            updateApp() {
                if (uni.canIUse('getUpdateManager')) {
                    const updateManager = uni.getUpdateManager()
                    updateManager.onCheckForUpdate((res) => {
                        // 请求完新版本信息的回调
                        if (res.hasUpdate) {
                            updateManager.onUpdateReady(() => {
                                this.$tools.alert({
                                    title: '更新提示',
                                    content: '新版本已经准备好，是否重启应用？',
                                    success: function (res) {
                                        if (res.confirm) {
                                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                            updateManager.applyUpdate()
                                        }
                                    }
                                })
                            })
                            updateManager.onUpdateFailed(() => {
                                // 新的版本下载失败
                                this.$tools.alert({
                                    title: '更新提示',
                                    content: '新版本已经上线啦！请退出小程序重新进入',
                                    showCancel: false,
                                    confirmText: '知道了'
                                })
                            })
                        }
                    })
                }
            }
        },
        onLaunch(launch) {
            this.updateApp()
            this.$tools.checkAppEnv()// 沙盒和正式服切换的时候清空用户信息
        },
        onShow: function () {
            // 更新缓存值到vuex
            this.$tools.updateStoreFromStorage()
            console.log('App Show')
        },
        onHide: function () {
            console.log('App Hide')
        }
    }
</script>

<style lang="scss">
    @import '@/static/style/global.scss';
</style>
