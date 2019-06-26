<template>
    <!-- 进度条bar -->
          <div  class="progress-bar-wrapper">
            <div   class="progress-bar">
                <!-- bar-inner 滚动条的黑色的背景部分 -->
              <div  class="bar-inner">
                  <!-- 黄色的滚动条
                   -->
                <div  class="progress" ref="progress">
                </div>
                <!--progress-btn-wrapper 按钮部分 -->
                <div  class="progress-btn-wrapper">
                  <div  class="progress-btn" ref="progressBtn">
                  </div>
                </div>
              </div>
            </div>
          </div>
         <!-- 进度条bar end -->
</template>



<script>
export default {
    props:{
        precent:{
            type:Number,
            default:0
        }
    },
    watch: {
        precent(newY){
            this.$refs.progress.style.width=''     
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


