// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'// 引入babel-polyfill
import fastclick from 'fastclick'// 引入fastclick
import 'common/stylus/index.styl'

fastclick.attach(document.body)// 使用fastclick
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
