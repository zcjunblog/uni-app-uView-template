<template>
    <div class="main" :class="vuex_theme_name" :style="{backgroundColor: bgColor}">
        <slot></slot>
        <login></login>
        <u-no-network></u-no-network>
    </div>
</template>

<script>
    export default {
        props:['bgColor'],
        data() {
            return {

            }
        },
    }
</script>

<style scoped lang="scss">
    .main{
        min-height: 100%;
        width: 100%;
        color: $text-color-base;
        box-sizing: border-box;
        background-color: $bg-color;
        overflow-x: hidden;  /* 防止ios出现横向滚动轴 */
        font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
    }
</style>
