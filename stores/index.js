import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    rules:[]
  },
  mutations: {
    setData (state, { dataName, data }) {
      state[dataName] = data
    }
  }
})
