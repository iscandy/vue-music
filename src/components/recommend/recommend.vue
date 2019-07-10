<template> 
    <div>
        <div  class="recommend" ref='recommend'>
            <scroll class="recommend-content" :data="recommendList" ref="scroll">
                <div>
                    <!--轮播部分-->
                    <slider v-if="recommend.length" >
                        <div v-for="(item,index) in recommend" :key="index">
                            <a :href="item.linkUrl" target="_blank">
                                <img :src="item.picUrl" @load="loadImage" class="needsclick">
                            </a>
                        </div>
                    </slider>
                    <!-- 列表部分-->
                    <div  class="recommend-list" style="pointer-events: auto;">
                        <h1  class="list-title">热门歌单推荐</h1>
                        <ul>
                            <li class="item" v-for='(item,index) in recommendList' :key="index" @click="selectItem(item)">
                                <div class="icon">
                                    <img width="60" height="60" v-lazy="item.imgurl">
                                </div>
                                <div class="text">
                                    <h2 class="name">{{item.creator.name}}</h2>
                                    <p class="desc">
                                        {{item.dissname}}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!--loading -->
                    <loading v-if="!recommendList.length"></loading>
                </div> 
            </scroll>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
//引入异步请求函数
import {getRecommend,getRecommendList} from 'api/recommend.js'
//引入常用的配置参数的ERR_OK
import {ERR_OK} from 'api/config.js'
//引入slider组件
import slider from 'components/base/slider/slider'
//引入scrollvew组件
import  scroll  from 'components/base/scroll/scroll'
//引入loading组件
import loading from 'components/base/loading/loading'

//引入minxin
import {playlistMixin} from 'common/js/mixin'

//引入mutations
import{mapMutations} from 'vuex'
export default {
    mixins:[playlistMixin],
    created(){
        //用_开头的方法名
         this._getRecommend();

         this._getRecommendList();
    },
    components:{
        slider,
        scroll,
        loading
    },
    data:function () {
        return{
             recommend:[],
             recommendList:[]
        }
    },
    methods: {
        ...mapMutations({
            set_disc:'SET_DISC'
        }),
       //一般在methods里面写方法的具体实现，不要在created或者mounted等生命周期中写，方便管理
       _getRecommend(){
            getRecommend().then(res=>{
                if(res.code==ERR_OK){
                    this.recommend=(res.data.slider);
                }
            })
       },
       _getRecommendList(){
           let that=this;
           getRecommendList().then(res=>{
               if(res.code==ERR_OK){
                   that.recommendList=res.data.list
               }
           })
       },
       loadImage(){
           //因为有多张图片，但是我们只需要当只有一张图片撑开的时候才做一下操作
          if(!this.checkloaded){ //添加一个标志位，如果load一次了，就不再执行onload事件了
                this.checkloaded = true
                this.$refs.scroll.refresh()
            }
          
       },
       //mixin
       handlePlayList(playlist){
           let bottom=this.playlist.length ? `60` :`0`
           this.$refs.recommend.style['bottom']=`${bottom}px`
           this.$refs.scroll.refresh();
       },
       //修改详情页的数据
       selectItem(item){
           this.$router.push(`/recommend/${item.dissid}`);
           this.set_disc(item);
       }
    },
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
</style>
