<template>
    <div class="search">
       <!-- 搜索框-->
        <search-box ref="search" @query="onQueryChange"></search-box>
       <!-- 搜索框没有搜索关键之的展示-->
        <div class="shortcut-wrapper" v-show="!query" ref="shortcut_wrapper" >
            <scroll  class="shortcut" ref="shortcut" :data="shortcut">
              <div>
                <!--热门搜索部分 -->
                 <div  class="hot-key">
                    <h1  class="title">热门搜索</h1>
                    <ul v-show="hotKey">
                        <li  class="item" v-for="item in hotKey" :key="item.n" @click="selectItem(item)"><span>{{item.k}} </span></li>
                    </ul>
                </div>

                <!-- 搜索历史部分-->
                <div class="search-history" v-show="searchHistory.length">
                  <h1 class="title">
                    <span class="text">搜索历史</span>
                    <span class="clear" @click="delectAll"><i class="icon-clear"></i></span>
                  </h1>
                  <!--这里是搜索列表组件 -->
                  <search-list :searches='searchHistory' @delectOne="delectOne" @addquery="addquery"></search-list>
                </div>
              </div>
            </scroll>
        </div>


       <!-- 搜索框有关键字的展示 -->
        <div class="search-result"  v-show="query" ref="search_result">
            <suggest :query="query" ref="suggest" :showSinger="showSinger" @beforeScrollStart="beforeScrollStart" @saveSearch="saveSearch" ></suggest>
        </div>


        <!-- 展示子路由 -->
        <router-view></router-view>

        <!-- 引入确定的弹窗 -->
        <confirm text="您确定删除全部吗？"  ref="confirm"  @confirm="confirm" ></confirm>


    </div>
</template>

<script>
import searchBox from '../base/search-Box/search-Box'
import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config'
import suggest from '../../components/suggest/suggest'
//做底部处理
import {playlistMixin} from 'common/js/mixin.js'
//引入搜索列表
import searchList from 'components/base/search-list/search-list'

import {mapGetters,mapActions}  from 'vuex'

//引入确定弹窗组件
import confirm from 'components/base/confirm/confirm'

//引入滚动组件
import scroll  from 'components/base/scroll/scroll'

export default {
   mixins:[playlistMixin],
    components:{
        searchBox,
        suggest,
        searchList,
        confirm,
        scroll
    },
    data() {
        return {
            hotKey:[],
            query:"",
            showSinger:true
        }
    },
    computed:{
      ...mapGetters(['searchHistory']),
      shortcut(){
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created(){
        this._getHotKey()
    },
    methods:{
      ...mapActions(
        {
          'delete_SearchOne':'delete_SearchOne',
          'delete_SearchAll':'delete_SearchAll'
        }
      ),
      //删除一个
      delectOne(item){
        this.delete_SearchOne(item);
      },
      //删除全部
      delectAll(){
        this.$refs.confirm.show()
      },
      confirm(){
        this.delete_SearchAll()
      },
      //根据搜索项去重新搜索
      addquery(query){
        this.$refs.search.set_query(query);
      },
        _getHotKey(){
             getHotKey().then(res=>{
                if(ERR_OK==res.code){
                    this.hotKey=res.data.hotkey.slice(0,10);//取得前面十条数据
                }
            })
        },
        selectItem(item){
            //那么我们需要像searchBox传递我们想要搜索的值
            this.$refs.search.set_query(item.k);
        },
        onQueryChange(query){
            //根据得到的关键字
            this.query=query
        },
        //滚动的时候让input框失去焦点
        beforeScrollStart(){
          this.$refs.search.inputBlur()
        },
        ...mapActions(['set_searchHistoty']),
        //保存搜索关键字
        saveSearch(query){
          //改变vuex的searchHistory数组
          //将searchHistory存入本地
          //因为进行了多个操作，这里我们需要在actions里面写
          this.set_searchHistoty(query)
        },
        //做底部自适应
        handlePlayList(playlist){
          let bottom= playlist.length ?  60 :0
          this.$refs.shortcut_wrapper.style.bottom = `${bottom}px`
          this.$refs.search_result.style.bottom = `${bottom}px`
          this.$refs.shortcut.refresh()
          this.$refs.suggest.refresh()
        }
    },
    watch:{
      query(newsong){
          if(!newsong){//当从搜索列表切换到热门搜索页面，shortcut从display:none变成display:block从无到有的过程
            setTimeout(() => {
              this.$refs.shortcut.refresh()
            }, 20)
          }
      }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
