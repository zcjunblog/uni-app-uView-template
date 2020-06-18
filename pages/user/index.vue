<template>
  <div>
    user page..
    {{user.name}}
  </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
  data () {
    return {

    }
  },
  mounted() {
    this.$tools.setStorage('user',{name:'vuex测试'})
    console.log(this.user)
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '@/static/style/reference.scss';

</style>
