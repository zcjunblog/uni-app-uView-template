import Vue from 'vue'
import App from './App'
import api from '@/api'
import tools from '@/utils/tools'
import store from '@/store';
import config from '@/utils/appConfig'
import  l from '@/localization.json'

import uView from "uview-ui"
Vue.use(uView);

// 引入uView提供的对vuex的简写法文件
import vuexStore from '@/store/$u.mixin.js'
Vue.mixin(vuexStore);


Vue.prototype.$l = l
Vue.prototype.$api = api
Vue.prototype.$tools = tools
Vue.prototype.$appConfig = config

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
