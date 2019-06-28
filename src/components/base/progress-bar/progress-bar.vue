<template>
    <!-- 进度条bar -->
          <div  class="progress-bar-wrapper"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
          >
            <div class="progress-bar" ref="progressBar" @click="progressClick"> 
                <!-- bar-inner 滚动条的黑色的背景部分 -->
              <div  class="bar-inner">
                  <!-- 黄色的滚动条-->
                <div  class="progress" ref="progress">
                </div>
                <!--progress-btn-wrapper 按钮部分 -->
                <div  class="progress-btn-wrapper" ref="progressBtn">
                  <div  class="progress-btn" ref="progressBtn">
                  </div>
                </div>
              </div>
            </div>
          </div>
         <!-- 进度条bar end -->
</template>



<script>
const progressBtnWidth = 16 //通过样式设置得到
let transform=prefixStyle('transform');
import {prefixStyle} from 'common/js/dom'
export default {
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    created() {
       this.touch = {}
    },
    methods: {
      progressTouchStart(e){
        this.touch.initiated=true;//表示已经开始初始化
        this.touch.x1=e.touches[0].pageX//获取到手指的距离屏幕左边的距离，当前拖动点X轴位置
        this.touch.progressWidth=this.$refs.progress.clientWidth //获取到当前进度条的宽度
    },
      progressTouchMove(e){
        if(this.touch.initiated){//如果为true的话
            //计算移动的距离
            let moveX=e.touches[0].pageX-this.touch.x1;
            //计算进度条的宽度
           let progressWidth=this.touch.progressWidth+moveX;
            //做边界处理，进度条的宽度，最小不能笑于0，最大不能大于progress-bar的宽度
            //首先先获取到progress-bar的宽度
            let barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth;
            //边界处理。
            let offsetWidth=Math.min(Math.max(0,progressWidth),barWidth)
            //把offsetWidth传入_offset方法里面做效果处理
            this._offset(offsetWidth);
        }
      },
      progressTouchEnd(e){//当移动完成的时候
           this.touch.initiated = false
           this._triggerPercent()
      },
      //改变小球的位置和进度条的宽度
      _offset(offsetWidth){
          this.$refs.progress.style.width=offsetWidth+'px';
          this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0, 0)`
      },
      //改变百分比
      _triggerPercent(){
         const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth;//进度条的总长度
         const percent=this.$refs.progress.clientWidth/barWidth;//百分比=进度条总长度/进度条的长度
         this.$emit('percentChange', percent)
      },
       //点击进度条改变进度
        //思路。点击位置/进度条的总长度=百分比，emit一个percent
        progressClick(e){
          //进度条的总长度
           const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth;
           //progressBar距离屏幕左边的距离
           let barLeft=this.$refs.progressBar.getBoundingClientRect().left;
           //点击的位置，距离左边
           let clickX=e.clientX-barLeft
           //做边界处理
           let progressWidth=Math.max(Math.min(clickX,barWidth),0)
           //改变进度条的位置
           this._offset(progressWidth);
           //emit派发percent 
           this._triggerPercent(progressWidth) 
        },
    },
   
    watch: {
        percent(newPercent){
          //当百分比大于等于0 并且 当前不是滑动的状态的时候
          if(newPercent >= 0 && !this.touch.initiated){
              //当前的进度条的宽度= 进度条背景的宽度-按钮的宽度
              const barWidth =this.$refs.progressBar.clientWidth-progressBtnWidth;
              //偏移的宽度
               const offsetWidth=newPercent*barWidth;
               this._offset(offsetWidth) 
          }
        }
    },
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>


