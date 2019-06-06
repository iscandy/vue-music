![vue-music](https://note.youdao.com/yws/public/resource/9376252db181980ba0b71a3c4050d4bc/xmlnote/E6120C7E6B20404393490AFB838452E6/404)
## 第3章 页面骨架开发 
<p>包括页面入口、header 组件的编写、路由配置及顶导 tab 组件开发。</p>
<h3>需求分析：</h3>
<h5>m-header组件</h5>
<p>首先我们看到的是推荐页。我们点击推荐，歌手，排行，搜索的时候，标题部分和用户按钮是不变的，所以在这里我们先拆分出来一个组件 m-header
</p>
<h4>tab组件</h4>
<p>当我们点击推荐歌手，排行和搜索的。页面tab以下的展示各自相应的页面，同时路由页相应的变化。</p>
<img style="width:200px" src="https://note.youdao.com/yws/public/resource/2d220ebaf39f4d400e45968992d92bb2/xmlnote/054BFED168CD419EA597569EFB58AFBE/447"  alt="推荐页" align=center />
<h2> 路由配置</h2>
<img style="width:100%;" src="https://note.youdao.com/yws/public/resource/2d220ebaf39f4d400e45968992d92bb2/xmlnote/45B5CAF88D424D30B0A41ECEC5064F90/477"  alt="路由配置" align=center />

```
routes: [
    {
      path:'/recommend',
      component:recommend,
      name:'推荐'
    },
    {
      path:'/singer',
      component:singer,
      name:'歌手'
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
```
记得写当点击切换的时候，选中的样式

```css
.router-link-active
    .tab-link
      color: $color-theme
      border-bottom: 2px solid $color-theme
```

