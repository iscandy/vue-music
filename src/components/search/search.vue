<template>
    <div class="search">
       <!-- 搜索框-->
        <search-box ref="search" @query="onQueryChange"></search-box>
       <!-- 搜索框没有搜索关键之的展示-->
        <div class="shortcut-wrapper" >
            <div  class="shortcut">
                 <div  class="hot-key">
                    <h1  class="title">热门搜索</h1>
                    <ul v-show="hotKey">
                        <li  class="item" v-for="item in hotKey" :key="item.n" @click="selectItem(item)"><span>{{item.k}} </span></li>
                    </ul>
                </div>
            </div>
        </div>
       <!-- 搜索框有关键字的展示 -->
        <div class="search-result" style="display:none">
            <suggest :query="query" :showSinger="showSinger"></suggest>
        </div> 
    </div>
</template>

<script>
import searchBox from '../base/search-Box/search-Box'
import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config'
import suggest from '../../components/suggest/suggest'
export default {
    components:{
        searchBox,
        suggest
    },
    data() {
        return {
            hotKey:[],
            query:"",
            showSinger:true
        }
    },
    created(){
        this._getHotKey()
    },
    methods:{
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
            //根据得到的关键字，请求相关数据
            this.query=query
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
