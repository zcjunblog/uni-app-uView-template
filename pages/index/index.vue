<template>
    <div>
        <van-icon name="thumb-circle-o" /> 创建完毕
    </div>
</template>

<script>
    import {mapState} from 'vuex'


    export default {
        components: {

        },
        data() {

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

    .page-main {
        background-color: $page-bg;
        min-height: 100vh;
        padding-bottom: 2vw;
        box-sizing: border-box;
    }

    $slide-height: 340rpx;

    .swiper-main {
        height: $slide-height;
        overflow: hidden;
        position: relative;
        margin-bottom: 10rpx;

        .swiper {
            height: $slide-height;
        }

        .slide-image {
            height: 100%;
            width: 100%;
            display: block;
        }

        .user-info-bar {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 60rpx;
            line-height: 60rpx;
            background-color: rgba(0, 0, 0, .3);
            text-indent: 26rpx;
            color: #fff;
            font-size: 28rpx;
        }
    }

    .tab-main {
        margin-top: 10rpx;

    }
    .tab-item{

    }
    .statis-card {
        width: 91.5vw;
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        margin-right: 2.7vw;
        margin-left: 2.7vw;
        background: #fff;
        height: 80rpx;
        line-height: 80rpx;
        padding: 0 1.7vw;
        /*box-shadow: 0 3px 23px 0 rgba(174, 56, 56, .08);*/
        border-radius: 1vw;
    }

    .statis-card .statis-title {
        font-size: $font-size;
        font-weight: 600;
        color: #333;
        margin-left: 6vw;
        position: relative;
        display: inline-block;
    }

    .statis-card .statis-title:before {
        content: "";
        width: 10rpx;
        background: #cd2c1f;
        left: -5vw;
        border-radius: 6rpx;
        position: absolute;
        top: 2.5vw;
        bottom: 2.5vw;
    }

    .starDetai {
        display: inline-block;
        /*font-size: 6vw;*/
        text-align: center;
        width: 55%;
    }

    .starScore {
        color: $theme;
        display: inline-block;
        padding-left: 1vw;

        span {
            font-size: 3vw;
        }
    }

    .tab-header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 94.6vw;
        height: 80rpx;
        background: #fff;
        text-align: center;
        margin: auto;
        border-radius: 1vw;
        font-size: $font-size;

        .tab-title {
            flex: 1;
            height: 100%;
            border-radius: 1vw;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
    }

    .tab-active {
        background: $theme-dark;
        color: #fff;
    }

    .tag-icon {
        position: absolute;
        right: 0.8vw;
        top: 0.8vw;
        width: 3vw;
        height: 3vw;
        background-color: $red;
        border-radius: 50%;
        font-size: 2.3vw;
        color: #fff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.6vw;
    }
</style>
