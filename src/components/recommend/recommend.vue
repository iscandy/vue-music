<template>
    <div>
        <slider v-if="recommend.length" >
            <div v-for="(item,index) in recommend" :key="index" class="slide-item">
                <a :href="item.linkUrl" target="_blank">
                    <img :src="item.picUrl">
                </a>
            </div>
        </slider>
        <!--轮播部分-->
        <slider></slider>

        <!-- 列表部分-->
        <div  class="recommend-list" style="pointer-events: auto;">
            <h1  class="list-title">热门歌单推荐</h1>
            <ul>
                <li class="item">
                    <div class="icon">
                        <img width="60" height="60" src="http://p.qpic.cn/music_cover/ibJJngZRP5m8ksRvDkGZxdcTjKvwic4LFLmx6NNVNRnXWDZXqLzFictBw/600?n=1" lazy="loaded">
                    </div>
                    <div class="text">
                        <h2 class="name">谈谈心恋恋爱 *</h2>
                        <p class="desc">
                            静心民谣：夏日清凉专享
                        </p>
                    </div>
                </li>
            </ul>
        </div>


    </div>
</template>

<script>
//引入异步请求函数
import {getRecommend,getListData} from 'api/recommend.js'
//引入常用的配置参数的ERR_OK
import {ERR_OK} from 'api/config.js'
//引入slider组件
import slider from 'components/base/slider/slider'

export default {
    created(){
        //用_开头的方法名
        this._getRecommend();
        this._getListData();
    },
    components:{
        slider
    },
    data:function () {
        return{
             recommend:[]
        }
    },
    methods: {
       //一般在methods里面写方法的具体实现，不要在created或者mounted等生命周期中写，方便管理
       _getRecommend(){
            getRecommend().then(res=>{
                if(res.code==ERR_OK){
                    this.recommend=(res.data.slider);
                }
            })
       },
       _getListData(){
           getListData().then(res=>{
               console.log(res);
           })
       }
    },
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
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
</style>
