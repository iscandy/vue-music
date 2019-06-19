import Vue from 'vue'
import Router from 'vue-router'
//引入路由组件

import recommend from 'components/recommend/recommend.vue'
import singer from 'components/singer/singer.vue'
import rank from 'components/rank/rank.vue'
import search from 'components/search/search.vue'
import singerDetail from 'components/singer-detail/singer-detail.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/recommend',
      component:recommend,
      name:'推荐'
    },
    {
      path:'/singer',
      component:singer,
      name:'歌手',
      children:[
        {
          path:'/singer/:id',
          component:singerDetail
        }
      ]
    },
    {
      path:'/rank',
      component:rank,
      name:'排行'
    },
    {
      path:'/search',
      component:search,
      name:'搜索'
    },
    {
      redirect:'/recommend',
      path:'/'
    }
  ]
})
