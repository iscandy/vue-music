<template>
    <!-- 进度条bar -->
          <div  class="progress-bar-wrapper"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
          >
            <div   class="progress-bar" ref="progressBar"> 
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
        this.touch.initiated = true //标志位 表示初始化
        this.touch.x1 = e.touches[0].pageX //当前拖动点X轴位置
        this.touch.progressWidth = this.$refs.progress.clientWidth //当前进度条的宽度
    },
      progressTouchMove(e){
        if(this.touch.initiated){
            //滚动条的最大距离
            const barWidth =this.$refs.progressBar.clientWidth-progressBtnWidth;
            //当前拖动到的X轴位置
            this.touch.x2 = e.touches[0].pageX
            //移动的距离为x2-x1
            let moveX=this.touch.x2- this.touch.x1
            //移动的宽度为进度条的宽度+当前的移动的距离
            let moveWidth=this.touch.progressWidth+moveX;
            //Math.min 去向右边的时取小值，Math.max向左边时，取最大值（移动边界处理，当移动到最右端的时候，当前的宽度等于进度条的最大宽度）
            //当移动到最左端的时候，最大值为0
            let offsetWidth=Math.max(0,Math.min(moveWidth,barWidth))
            //移动
            this._offset(offsetWidth)
        } 
      },
      progressTouchEnd(e){//当移动完成的时候
          this.touch.initiated = false
          this._triggerPercent()
      },
      //改变小球和进度条的位置
      _offset(offsetWidth){
        this.$refs.progress.style.width=offsetWidth+'px';
        this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
      },
      //改变八分比
      _triggerPercent(){
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const percent = this.$refs.progress.clientWidth / barWidth
          this.$emit('percentChange', percent)
      }
    },
    watch: {
        percent(newPercent){
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


