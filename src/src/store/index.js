import Vue from 'vue'
import Vuex  from 'vuex'
Vue.use( Vuex)
import * as getters from './getters'
import * as actions from './actions'
import state  from './state'
import mutations from './mutations'


export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})
