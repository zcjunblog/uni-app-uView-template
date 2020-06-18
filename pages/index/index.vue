<template>
    <div>
        <div style="margin-top: 180rpx;text-align: center"><van-icon name="thumb-circle-o" size="70" /></div>
        <div style="font-size: 80rpx;text-align: center">{{msg}}</div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'


    export default {
        components: {

        },
        data() {
            return{
                msg:'创建完毕'
            }
        },
        computed: {
            ...mapState({

            }),

        },
        onReachBottom(){

        },
        methods: {

        },
        onShow() {

        },
        onShareAppMessage() {

        }
    }
</script>

<style lang="scss" scoped>
    @import '@/static/style/reference.scss';
</style>
