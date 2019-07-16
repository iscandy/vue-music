// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'// 引入babel-polyfill
import fastclick from 'fastclick'// 引入fastclick
import 'common/stylus/index.styl'
import  vulazyload from 'vue-lazyload'
import store  from './store/index'

Vue.use(vulazyload,{
  loading: require('./common/image/default.png') //loading时默认显示的图片
})

fastclick.attach(document.body)// 使用fastclick
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

