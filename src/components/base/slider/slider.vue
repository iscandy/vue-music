<template>
  <div class="slider" ref="slider">
      <div class="slider-content"  ref="slidergroup">
        <slot></slot>
      </div> 
      <div class="dots">
	      <span class="dot" :class="{active:index===currentPageIndex}" v-for="(item,index) in dots" :key="index" @click="_gotopage(index);"></span>
    </div>
  </div>
</template>

<script>
import {addClass} from 'common/js/dom'
import BTscroll from 'better-scroll'
export default {
  props:{
      autoplay:{//是否自动播放
        type:Boolean,
        default:true
      },
      loop:{//是否无缝滚动
        type:Boolean,
        default:true
      },
      intervalTime:{
        type:Number,
        default:4000
      }
  },
  data(){
    return{
      dots:0,
      currentPageIndex:0
    }
  },
  mounted() {
    this._getSliderWidth();
    this._initSlider();
    this._windowresize();
  },
  methods: {
    _initSlider(){
        let me=this;
        this.slider=new BTscroll(this.$refs.slider,{
          scrollX: true,
          scrollY: false,
          slide: {
            loop: me.loop,
            threshold: 100//可滚动到下一个或上一个的阈值。
          },
          momentum: false,
          bounce: false,
          stopPropagation: true,
          click:true
        })
        //当滚动结束的时候，派发一个scrollEnd事件，我们获取到当前的index给currentpageindex
        this.slider.on('scrollEnd', ()=>{
          this._scrollEnd()
        })

        this._autoGoNext()
    },
    _getSliderWidth(isresize){
        let sliderWidth=this.$refs.slider.clientWidth;
        let children=[...this.$refs.slidergroup.children];
        if(!isresize){
            this.dots=children.length;
        }
        let width=0;
        children.forEach((item,index)=>{
          width+=sliderWidth;
          item.style.width=sliderWidth+'px'
          //给每个children加上类
          addClass(item,'slider-item')
        })
        
        if(!isresize && this.loop){
          //当是无缝滚动的时候加上两个
          width+=2*sliderWidth
        }
        
        this.$refs.slidergroup.style.width=width+'px'
    },
    //重刷新
     refresh(){
      this.slider && this.slider.refresh()
    },
    //滑动结束的时候
     _scrollEnd(){
          //当滚动结束的时候，派发一个scrollEnd事件，我们获取到当前的index给currentpageindex
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex
          this._autoGoNext()
    },
    //自动播放
    _autoGoNext(){
      if(!this.autoplay){
          return
      }
      clearTimeout(this.playTimer)
      this.playTimer = setTimeout(() => {
        this.slider.next()
      }, this.intervalTime)
    },
    //去到下一页
     _gotopage(index){
        this.slider.goToPage(index,0)
        this._autoGoNext()
    },
    //当窗口发生变化的时候
    _windowresize(){
      window.addEventListener('resize',()=>{
        this._getSliderWidth(true);
        this.refresh()
      })
    }
  
   
  }
}
</script>

<style scoped>
.slider{ position: relative}
.slider-content:after{content:""; display:block; clear: both;}
.slider-item{float:left}
.slider-item a{width: 100%;}
.slider-item img{ width: 100%;}

.dots{position: absolute;
 right: 0;
    left: 0;
    bottom: 12px;
    -webkit-transform: translateZ(1px);
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;}
.dots .dot{
  display: inline-block;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    background: hsla(0,0%,100%,.5);
    border-radius:50%;
} 
.dots .dot.active{ width: 20px;background: #fff; border-radius: 20px;}
</style>