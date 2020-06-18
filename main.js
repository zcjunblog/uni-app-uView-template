import Vue from 'vue'
import App from './App'
import api from '@/api'
import store from '@/stores'
import tools from '@/utils/tools'
import config from '@/utils/appConfig'

Vue.prototype.$api = api
Vue.prototype.$tools = tools
Vue.prototype.$store = store
Vue.prototype.$appConfig = config

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
