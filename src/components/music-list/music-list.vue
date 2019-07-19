<template>
   <div class="music-list" >
        <div class="back" @click="back">
                <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title">{{title}}</h1>

        <div class="bg-image" :style="bgStyle"  ref="bgImage">
            <!-- iphone手机下高斯模糊效果 -->
            <div class="filter" ref="filter"></div>
                <!-- 播放按钮 -->
                <div class="play-wrapper" v-show="songs.length" ref="playBtn">
                    <div class="play" @click="random">
                        <i class="icon-play"></i>
                        <span class="text">随机播放全部</span>
                    </div>
                </div>
        </div>

        <!-- 加上黑色的层 -->
        <div class="bg-layer" ref="layer"></div>

        <scroll :data="songs" class="list" ref="list" :probeType='probeType' :listenScroll='listenScroll' @scroll="scroll">
           
            <div class="song-list-wrapper">
                    <song-list :songs="songs" :rank="rank" @select='selectItem'></song-list>
            </div>
            
            <!-- loading部分 -->
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
    
</template>

<script>
import SongList  from 'components/base/song-list/song-list'
import scroll from 'components/base/scroll/scroll'
import {prefixStyle}  from 'common/js/dom'
import loading from 'components/base/loading/loading'
const RESERVED_HEIGHT=40 //滚动偏移距离
import {mapActions}  from 'vuex'
//引入mixin
import {playlistMixin} from "common/js/mixin";

export default {
    //注册minxins
    mixins:[playlistMixin],
    props:{
        bgImage:{
            type:String,
            default:'' 
        },
        songs:{
            type:Array,
            default:[]
        },
        title:{
            type:String,
            default:''
        },
        rank:{
            type:Boolean,
            default: false
        }
    },
    components:{
        SongList,
        scroll,
        loading,
    },
    data() {
        return {
            scrollY:-1
            
        }
    },
    computed: {
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    created() {
        this.probeType =3,
        this.listenScroll =true
    },
    mounted() {
        

        //因为这个得到的是VueComponent，而不是元素，所以我们这里还需要加上$el
        this.$refs.list.$el.style.top=this.$refs.bgImage.clientHeight+'px'
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT //最远滚动位置，不超过
       
    },
    methods: {
         ...mapActions(['selectPlay','setRandomPlay']),
        scroll(pos){
            this.scrollY=pos.y//获取都爱滚动的值s
        },
        back(){
            this.$router.back()
        },
        //当收到emit的时候，立即改变vuex中的数据
        //需要改变当前的playing
        //需要改变当前的fullScreen
        //需要改变当前的currentIndex
        //需要改变当前的playlist
         //需要改变当前的sequenceList
         //所以我们需要派发一个action。让action改变多个mutation
        selectItem(song,index){
            //获取到当前的列表
            this.selectPlay({
                list:this.songs,
                index:index
            })
        },
        random(){
            //因为这里需要改变多个状态
            //改变当前的播放状态
            //改变当前的currentIndex
            //改变当前的playList
            //所以在这里我们需要定义一个randomPlay 的mutation
           this.setRandomPlay({list:this.songs});
        },
         //mixins部分
        handlePlayList(playlist){
            let bottom= playlist.length ? `60px` : `0px`;
            this.$refs.list.$el.style['bottom']=`${bottom}`//底部播放器适配
            this.$refs.list.refresh();//强制刷新滚动条
        }
    },
    watch: {
        //监听scrollY的变化
        scrollY(newY){
            const transform = prefixStyle('transform')
            const backdrop = prefixStyle('backdrop-filter')
            //让文字底部黑色的层跟着滚动
            let translateY=Math.max(newY,this.minTranslateY)//获取到最大滚动量
            this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`
            //对顶部样式进行处理
             let zIndex=0;//对图片的zindex做处理
             if(newY<this.minTranslateY){
                 zIndex=10;//让z-index变大
                 this.$refs.bgImage.style['paddingTop']='0%'
                 this.$refs.bgImage.style['height']=`${RESERVED_HEIGHT}px`
                 this.$refs.playBtn.style['display']='none'
             }else{
                 this.$refs.bgImage.style['paddingTop']='70%'
                 this.$refs.bgImage.style['height']=`0`
                 this.$refs.playBtn.style['display']='block'
             }
             this.$refs.bgImage.style['z-index']=zIndex;

            // //当往下拖的时候，让图片跟着等比放大
            let scale=1;
            let percent=Math.abs(newY/this.$refs.bgImage.clientHeight)//计算比例
            if(newY>0){
                scale=1+percent
                zIndex = 10
            }

            this.$refs.bgImage.style[transform]=`scale(${scale})`
            this.$refs.bgImage.style['z-index']=zIndex

            //当往上推的时候，希望图片出现高斯模糊效果，给ref="filter"加上高斯模糊效果
            //backdrop-filter CSS 属性可以让你为一个元素后面区域添加图形效果（如模糊或颜色偏移）。 因为它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明。
            let blur = 0
           if(newY<0){
                 blur = Math.min(20 * percent, 20) 
            }
            this.$refs.filter.style[backdrop]=`blur(${blur}px)`

        }
    },      

}
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list 
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>