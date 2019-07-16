<template>
     <scroll   class="suggest" :data="list" @scrollToEnd='searchMore' :pullup="pullup">
            <ul   class="suggest-list">
                <li   class="suggest-item" v-for="(item,index) in list" :key="index">
                <div   class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div   class="name">
                    <p  class="text" v-html="getDisplayName(item)"></p>
                </div>
                </li>

                <li class="suggest-list-loading" v-show="hasMore">
                    <loading :title=title></loading>
                </li>
            </ul>
            <!-- 展示暂无数据-->
            <div v-show="!hasMore && !list.length" class="no-result-wrapper">
                <noResult title="暂无数据"></noResult>
            </div>
        </scroll>   
</template>

<script>
import {search} from '../../api/search'
import {ERR_OK} from '../../api/config'
const PAGESIZE = 20 //抓取数据一页有多少数据
const SINGER_TYPE="singer"

import createSong from '../../common/js/song'
import {getMusicVkey} from '../../api/singer'
//上拉加载功能
import scroll from 'components/base/scroll/scroll'
import loading from 'components/base/loading/loading'
//展示暂无数据
import noResult from 'components/base/no-result/no-result'


export default {
    components:{
        scroll,
        loading,
        noResult
    },
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            pageIndex:1,
            list:[],//当前的列表的数据
            title:'',
            pullup:true,
            hasMore:false,//是否还可展示更多的数据
        }
    },
    methods:{
        //发送请求
        async search(newQuery){
            this.pageIndex=1;
            this.list=[];
            //关键字,当前页(在data中维护当前页),一页多少条,是否展示歌手(根据props传递过来)
            let result=await search(newQuery,this.pageIndex,PAGESIZE,this.showSinger)
            if(result.code==ERR_OK){
                if(result.data.zhida && result.data.zhida.albumid){
                    this.list.push({...result.data.zhida,...{type:SINGER_TYPE}});
                }
               // console.log(result.data.song.list)
                if(result.data.song.list){
                    let res=await this._nomalizeSong(result.data.song.list);
                    this.list=this.list.concat(res)
                    this._checkMore(result.data.song);
                }
            }
        },
         //将data.song.list转化成一个歌曲类
       async  _nomalizeSong(list){
            let ret=[];
            for(let item of list){
                if(item.songid && item.songmid){
                    let result=await getMusicVkey(item.songmid);
                    if(result.code==ERR_OK){
                        ret.push(createSong(item,result.data.items[0].vkey))
                    }
                }
            }
            return ret
        },
        //做图标处理
        getIconCls(item){
            if(item.type==SINGER_TYPE){
                 return 'icon-mine'
            }else{
                 return 'icon-music'
            }
        },
        //做文本处理
        getDisplayName(item){
            if(item.type === SINGER_TYPE) {
                return item.singername
            }else{
                 return `${item.name}-${item.singer}`
            }
        },
        async searchMore(){//加载更多
            if(!this.hasMore){
                return 
            }
            this.pageIndex++;
            //关键字,当前页(在data中维护当前页),一页多少条,是否展示歌手(根据props传递过来)
            let result=await search(this.query,this.pageIndex,PAGESIZE,this.showSinger)
            if(result.code==ERR_OK){
                if(result.data.song.list){
                    let res=await this._nomalizeSong(result.data.song.list);
                    this.list=this.list.concat(res)
                    this._checkMore(result.data.song);
                }
            }
        },
        _checkMore(data){
           // console.log("当前页："+data.curpage,"当前条数"+data.curnum,'总数'+data.totalnum);
            if(!data.list || (data.curpage-1)*PAGESIZE+data.curnum>=data.totalnum){
                this.hasMore=false
            }else{
                this.hasMore=true
            }
        }
    },
    watch: {
      query(newQuery) {
        //监听到query的变化，发送请求。需要做节流处理。。。
        this.search(newQuery);
      }
    }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .suggest-list-loading
        padding-bottom:20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>