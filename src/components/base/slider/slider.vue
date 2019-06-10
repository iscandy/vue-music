<template>
  <div class="slide-banner">
    <div class="banner-wrapper">
      <div class="slide-banner-scroll" ref="slide">
        <div class="slide-banner-wrapper"  ref="slideContent">
          <!-- <div class="slide-item page1">page 1</div>
          <div class="slide-item page2">page 2</div>
          <div class="slide-item page3">page 3</div>
          <div class="slide-item page4">page 4</div> -->
          <slot></slot>
        </div>
      </div>
      <div class="docs-wrapper">
        <span
          class="doc"
          v-for="(item, index) in dotLen"
          :key="index" @click="_goToPage(index)"
          :class="{'active': currentPageIndex === index}"></span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  //按需引入
  import BScroll from '@better-scroll/core'
  import Slide from '@better-scroll/slide'
  BScroll.use(Slide)
  //引入dom.js
  import {addClass} from 'common/js/dom'
  export default {
    //设置props:
    props:{
        loop:{
            type:Boolean,
            default:true,//是否无缝滚动
        },
        autoPlay: {
          type: Boolean,
          default: true
        },
        interval: {
            type: Number,
            default: 3000
        }

    },
    data() {
      return {
        slide: null,//slide组件
        currentPageIndex: 0,//当前页
        playTimer: 0,//定时器
        dotLen:0
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      clearTimeout(this.playTimer)
      this.slide.destroy()
    },
    methods: {
     //为每一进来的项添加slide-item类
      _addClass(){
        let children=[...this.$refs.slideContent.children];
        this.dotLen=children.length;
        children.forEach((item)=>{
            addClass(item,'slide-item');
        })
      },
      //初始化一个btscroll
      init() {
        clearTimeout(this.playTimer)
        //为每一进来的项添加slide-item类
        this._addClass();
        let loop=this.loop
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          slide: {
            loop:loop,//是否自动滚动
            threshold: 100// 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页  
          },
          useTransition: true,//是否使用CSS3的Transition属性
          momentum: false,//关掉惯性
          bounce: false,//当自动滚动的时候需要设置这个伪false，否则会在循环衔接的时候出现闪烁。
          stopPropagation: true,//阻止事件冒泡
          click:true
        })
        //滑动结束
        this.slide.on('scrollEnd', this._onScrollEnd)
        // user touches the slide area
        //开始滑动之前
        this.slide.on('beforeScrollStart', () => {
          clearTimeout(this.playTimer)
        })
        // user touched the slide done
        //自动滑到下一页
        this.slide.on('scrollEnd', () => {
          this.autoGoNext()
        })
        window.bs = this.slide
        this.autoGoNext()
      },
      nextPage() {
        this.slide.next()
      },
      prePage() {
        this.slide.prev()
      },
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        this.autoGoNext()
      },
      autoGoNext() {
        if(this.autoPlay){
            let interval=this.interval;
            clearTimeout(this.playTimer)
            this.playTimer = setTimeout(() => {
            this.nextPage()
            },interval);
        }
      },
      //点击dot测时候去到某一页
      _goToPage(index){
          this.slide.goToPage(index)
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">
.slide-banner
  .banner-wrapper
    position relative
  .slide-banner-scroll
    min-height 1px
    overflow hidden
  .slide-banner-wrapper
    white-space nowrap
    font-size 0
    .slide-item
      display inline-block
      width 100%
      text-align center
      font-size 26px
      a
       display block
       width 100%
       img
          display block
          width 100%
  .docs-wrapper
    position absolute
    bottom 4px
    left 50%
    transform translateX(-50%)
    .doc
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background #eee
      &.active
        width 20px
        border-radius 5px
  .btn-wrap
    margin-top 20px
    display flex
    justify-content center
    button
      margin 0 10px
      padding 10px
      color #fff
      border-radius 4px
      background-color #666

</style>