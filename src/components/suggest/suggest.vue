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
                <!-- <li class="suggest-list-loading" v-show="isLoading">
                    <loading :title=title></loading>
                </li> -->
            </ul>
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

export default {
    components:{
        scroll,
        loading
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
            hasMore:true,//是否还可展示更多的数据
            zhida:{},//zhida
            searchSongs:[],//song类集合
            pushOver:[],//标记是否异步结束了
            firstList:[]
        }
    },
    methods:{
        //发送请求
        search(newQuery){
            //关键字,当前页(在data中维护当前页),一页多少条,是否展示歌手(根据props传递过来)
            //异步1
            search(newQuery,this.pageIndex,PAGESIZE,this.showSinger).then(res=>{
                if(res.code==ERR_OK){
                    this.zhida = res.data.zhida;//将zhida存起来
                    this.firstList=res.data.song.list;
                    this.searchSongs =this._nomalizeSong(res.data.song.list)//把song列表部分的存起来，并且转化成一个song类的集合
                }
            })
        },
         //将data.song.list转化成一个歌曲类
        _nomalizeSong(list){
             let ret=[];
             let pushIndex =0  //判断是否是最最后一次push 
             list.forEach(musicData => {
                if(musicData.songid && musicData.songmid){
                    getMusicVkey(musicData.songmid).then(res=>{
                        if(res.code==ERR_OK){
                            ret.push(createSong(musicData,res.data.items[0].vkey));
                        }
                        pushIndex++
                        this.pushOver = list.length===pushIndex//是否加载完成了
                    })
                }
             });
             return ret
         },
        _genResult(zhida,newValue){
            let ret = []
            //push歌手进空数组
            if(zhida.singerid){
                ret.push({...zhida,...{type:SINGER_TYPE}})  //es6语法，对象拓展符。等同于object.assign()新建对象
            }
            //合并歌曲进数组
            if (newValue) {
                ret = ret.concat(newValue)
            }
            let last_list=this.list.slice(0);
            this.list=last_list.concat(ret.slice(0));
           // this.list =this.list.push(ret)
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
        searchMore(){
           if(!this.hasMore){//是否还可以展示更多的数据
               return
           }
           this.pageIndex++;//当前页+1
          search(this.query,this.pageIndex,PAGESIZE,this.showSinger).then(res=>{
                if(res.code==ERR_OK){
                   //将下一页数据拼接上上一条的数据
                   this.pushOver=false
                   this.searchSongs =this._nomalizeSong(res.data.song.list)
                }
            })

        },
        _checkMore(data){
            console.log(data);
            //当当前的this.list.length为空，并且  当页的条数+当前页*一页多少条
            if(!this.list.length || (data.curnum+data.curpage*PAGESIZE) >=data.totalnum){
                 this.hasMore = false
            }
        }
    },
    watch: {
      query(newQuery) {
        //监听到query的变化，发送请求
        this.search(newQuery);
      },
      searchSongs(newValue){
           //判断异步完成后合并zhida和当前的song类数组
            if(this.pushOver){     
                this._genResult(this.zhida,newValue)
            }   
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