<template>
  <!-- 当有列表的时候才展示播放组件 -->
  <div class="player" v-if="playlist.length>0">

    <!-- 大播放器 -->
    <transition 
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
    <div class="normal-player" v-show="fullScreen" >
      <!-- 背景高斯模糊 -->
      <div class="background">
         <img  width="100%" height="100%" :src="currentSong.image">
      </div>
      <!--top标题部分 -->
      <div class="top">
          <div class="back" @click="close"><i class="icon-back"></i></div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <!-- 中间唱片转圈 -->
      <div class="middle"
           @touchstart.prevent="middleTouchStart"
           @touchmove.prevent="middleTouchMove"
           @touchend.prevent="middleTouchEnd"

      >


          <!-- 唱片下方带歌词 -->
          <div class="middle-l" ref="middleL">
              <div class="cd-wrapper"  ref="cdWrapper">
                <div class="cd"  :class="cdCls">
                  <img class="image" :src="currentSong.image">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
          </div>
          <!-- 展开全部歌词 -->
         <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                      <div v-if="currentLyric">
                            <p ref="lyricLine"
                                class="text"
                                :class="{'current': currentLineNum === index}"
                                v-for="(line, index) in currentLyric.lines" :key="index">
                                {{line.txt}}
                            </p>
                      </div>
                </div>
          </Scroll>
          
      </div>

      <!-- 底部控制部分 -->
      <div class="bottom">
        <!-- dot部分 -->
        <div class="dot-wrapper" >
          <span class="dot" :class="{active:currentShow=='cd'}"></span>
          <span class="dot" :class="{active:currentShow=='lyric'}"></span>
        </div>

        <!-- 进度条部分 -->
        <div  class="progress-wrapper">
          <span  class="time time-l">{{formate(currentTime)}}</span>
            <progressBar :percent="percent" @percentChange='percentChange'></progressBar>
          <span  class="time time-r">{{formate(currentSong.duration)}}</span>
      </div>
        <!-- 控制按钮部分 -->
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left"  :class="disableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center"  :class="disableCls">
            <!-- 根据播放的状态来控制图标 -->
            <i class="needsclick" :class="playIcon" @click="togglePlaying" ></i>
          </div>
          <div class="icon i-right"  :class="disableCls">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon icon-not-favorite"></i>
          </div>
      </div>
     </div>
    </div>
    </transition>

    <!--小播放器 -->
     <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
          <!--可以转动的icon -->
          <div class="icon">
            <div class="imgWrapper">
              <img  width="40" height="40" class="" :src="currentSong.image"  :class="cdCls">
            </div>
          </div>
          <!-- 歌曲信息部分 -->
          <div class="text">
            <h2  class="name" v-html="currentSong.name"></h2>
            <p  class="desc" v-html="currentSong.singer"></p>
          </div>
          <!-- 播放暂停歌曲 -->
          <div  class="control">
            <progressCircle :radius="radius" :percent="percent">
              <i  class="icon-mini icon-play-mini" @click.stop="togglePlaying"  :class="playIcon"></i>
            </progressCircle>
          </div>

          <div class="control">
            <i class="icon-playlist"></i>
          </div>

      </div>
     </transition>

    <!-- 加audio播放 -->
    <audio 
    :src="currentSong.url" 
    ref="audio" 
    @canplay="ready"
    @error="error"
    @timeupdate="timeupdate"
    @ended="end"
    ></audio>

  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '@/common/js/dom'
//引入进度条组件
import progressBar  from 'components/base/progress-bar/progress-bar'
//引入圆环进度条
import progressCircle from 'components/base/progress-circle/progress-circle.vue'
//引入工具函数打款当前的书序
import  {shuffle} from 'common/js/util'
//引入模式
import {playMode} from 'common/js/config'
//引入歌词解析库
import Lyric from 'lyric-parser'
//引入scroll组件
import Scroll from 'components/base/scroll/scroll'

const transform=prefixStyle('transform');
const transitionDuration=prefixStyle('transition-duration');

export default {
  data() {
    return {
      songReady: false,//标识歌曲是否准备好了
      currentTime:0,
      radius:32,
      currentLyric:[],//歌词数组
      currentLineNum:[],//当前播放的歌词的索引
      currentShow:'cd',
      playingLyric: ''//当前播放的歌词
    }
  },
  components:{
    progressBar,
    progressCircle,
    Scroll
  },
  created() {
    this.touch={},
    this.currentLyric=null
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    //播放或者暂停按钮
    playIcon(){
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    cdCls(){
       return this.playing ? 'play' : 'pause'
    },
    disableCls(){
      return this.songReady ? '' : 'disable'
    },
    percent(){
      return this.currentTime /  this.currentSong.duration
    },
    //模式播放按钮
    modeIcon(){
      //icon-sequence
      return this.mode===playMode.sequence ? 'icon-sequence' : this.mode===playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
        setFullScreen:'SET_FULLSCREEN',
        setPlaying:'SET_PLAYING',
        setCurrentIndex:'SET_CURRENTINDEX',
        setMode:'SET_MODE',
        setPlayList:'SET_PLAYLIST'
    }),
   open(){
     this.setFullScreen(true)
   },
    close(){
      this.setFullScreen(false)
    },
    //播放和暂停,
    togglePlaying(){
       if(!this.songReady){
          return
        }
        //解决当歌曲暂停的时候，歌词还在跳动
        if(this.currentLyric){
            this.currentLyric.togglePlay()//歌词切换播放暂停
        }
      //发起一个playing 的 mutation
      this.setPlaying(!this.playing)
    },
    //上一首歌
    prev(){
      if(!this.songReady){
        return
      }

      if(this.playlist.length==1){
          this.loop()
          return
      }

      
      let index=this.currentIndex;
      index--;
      if(index==-1){
        index=this.playlist.length-1; 
      }
      this.setCurrentIndex(index)
      if(!this.playing){
        this.setPlaying(true);
      }
      this.songReady=false
    },
    //下一首歌
    next(){
        if(!this.songReady){
          return
        }

        if(this.playlist.length==1){
          this.loop()
          return
        }

        let index=this.currentIndex;
        index++;
        if(index==this.playlist.length){
          index=0
        }
        this.setCurrentIndex(index);
        if(!this.playing){
          this.setPlaying(true);
        }
        this.songReady=false
    },
    //改变歌曲的模式
   changeMode(){
          const mode = (this.mode + 1) % 3
          this.setMode(mode)
          let list = null
          if(mode === playMode.random){
            list = shuffle(this.sequenceList)
          }else{
            list = this.sequenceList
          }
          this.resetCurrentIndex(list) 
          this.setPlayList(list)
    },
    //重置当前的索引
    resetCurrentIndex(list){
        let index = list.findIndex((item) => { //es6语法 findIndex
            return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
    },
    //切换歌词和唱片
    middleTouchStart(e){
        //是否开始滑动
        this.touch.initiated=true//初始化标志
        this.touch.x1=e.touches[0].pageX;//初始化位置
        this.touch.y1=e.touches[0].pageY;//初始化的y的位置
    },  
    middleTouchMove(e){
      if(!this.touch.initiated){
              return 
      }
      let deltaX =e.touches[0].pageX- this.touch.x1;//x的横向的滑动的距离
      let deltaY =e.touches[0].pageY- this.touch.y1;//x的横向的滑动的距离
      
      //判断两个距离，如果是纵向滑动的时候，不做任何处理
      if(Math.abs(deltaY)-Math.abs(deltaX) >0){
        return 
      }else{
        //参考位置 歌词的左边相对页面的偏移
       let offsetLeft= this.currentShow==='cd' ? 0 : -window.innerWidth
       //向左边滑动不能小于 -window.innerWidth  向右边滑动不能大于 window.innerWidth
         //滑入歌词offsetWidth = 0 + deltaX(负值)  歌词滑出offsetWidth = -innerWidth + delta(正值)
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth,offsetLeft+deltaX))
        this.touch.percent=Math.abs(offsetWidth/window.innerWidth);
        //  console.log(offsetWidth, this.touch.percent);
        //记住这里 this.$refs.lyricList得到的是一个component组件，当操作这个组件的元素需要用this.$refs.lyricList.$el
        this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`

        //唱片部分渐隐
        this.$refs.middleL.style['opacity']=1-this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
        this.$refs.lyricList.$el.style[transitionDuration] = 0
      }
    },
    middleTouchEnd(){
        this.touch.initiated=false//初始化标志
        let offsetWidth;
        let opacity;
        //当当前的是cd唱片
        if(this.currentShow === 'cd'){
            if(this.touch.percent>0.1){ 
                offsetWidth=-window.innerWidth;
                opacity=0
                this.currentShow = 'lyric'
            }else{
              offsetWidth = 0
              opacity = 1
            }
      //当当前的是歌词
       }else if(this.currentShow === 'lyric'){
          if(this.touch.percent<0.9){ 
              offsetWidth=0;
              opacity=1
              this.currentShow = 'cd'
          }else{
              offsetWidth=-window.innerWidth;
              opacity=0
          }
         
       }
      const time = 300
      this.$refs.middleL.style['opacity']=opacity
      this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.$refs.lyricList.$el.style[transitionDuration] =`${time}ms`

    },
    ready(){
        this.songReady=true
    },
    error(){
      this.songReady=true
    },
    timeupdate(e){
      this.currentTime=e.target.currentTime
    },
    //当歌曲播放完成的时候
    end(){
      //判断当前的播放模式
      if(this.mode==playMode.loop){
        this.loop()
      }else{
        this.next();
      }
    },
    loop(){
      //设置当前的currentTime
      this.currentTime=0;
      //设置自动播放下一首歌
      this.$refs.audio.play()
      //解决当是单曲循环的时候，播放完成之后歌曲并没有回到开头
      if(this.currentLyric){
        this.currentLyric.seek(0) //歌词偏移到一开始
      }
    },
    //将时间戳转换
    formate(interval){
      interval = interval | 0 //向下取整
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2){ //用0补位，补2位字符串长度
        let len = num.toString().length
        while(len < n){
            num = '0' + num
            len++
        }
        return num
    },
    //动画一进入的时候
    enter(el,done){
      let {x,y,scale}=this._getPosAndScale();
      let animation={
        0:{
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60:{
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100:{
           transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // this creates the animation above
      animations.registerAnimation({
        name: 'move',
        // the actual array of animation changes
        animation,
        // optional presets for when actually running the animation
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      //then run it 当执行done函数的时候自动到afterEnter钩子
     animations.runAnimation(this.$refs.cdWrapper, 'move', done)

    },
    //进入之后
    afterEnter(){
      animations.unregisterAnimation('move')
      //当动画结束之后清除cd-wrapper的style属性。因为当runAnimation的时候默认胡加上style=“transform: xxxx”行内样式
      this.$refs.cdWrapper.style.animation=''
      
    },
    //离开的时机，从大的cd到小的cs的重点
    leave(el, done){
        let transform=prefixStyle('transform');
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0)`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    //离开之后
    afterLeave(){
        let transform=prefixStyle('transform');
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
    },
  //首先需要获取到初始距离和比例
  _getPosAndScale(){
    const miniWidth=40;//mini-player的小cd的宽度
    const normalWidth=window.innerWidth * 0.8;//打的cs的宽度
     const normalpaddingTop=80;//大的cd顶部距离最上边界

    //小cd的中心点的坐标
    const minipaddingLeft=40;//小的cd的中心距离左边
    const minipaddingBottom=30;//小的cd的中心点距离底部的距离

    //小的cd到大的cs的中心点的距离
    const x=-window.innerWidth*0.5 - minipaddingLeft;//(有负号)
    const y=window.innerHeight-normalpaddingTop-minipaddingBottom-0.5*normalWidth

    //小的cs和大的cd的比例
    const scale=miniWidth/normalWidth;//比例取整
    
    return {
      x,
      y,
      scale
    }

  },
  //当改变的时候，改变当前的播放的时间
   percentChange(percent){
     //当前的播放时长=总时长*百分比
     this.$refs.audio.currentTime = this.currentSong.duration * percent
      //如果当前不是播放状态的，让播放器播放
      if(!this.playing){
          this.togglePlaying()
      }
      if(this.currentLyric){
          //让歌曲进行偏移
          let currentTime=this.currentSong.duration * percent
          this.currentLyric.seek(currentTime * 1000)
      }
    },
    handleLyric({lineNum, txt}){
      this.currentLineNum = lineNum
      if(lineNum>5){
         let lineeEl = this.$refs.lyricLine[lineNum - 5] //保证歌词在中间位置滚动
        //让滚动滚动到指定的位置减去5行
        this.$refs.lyricList.scrollToElement(lineeEl)
      }else{
        //滚动回到顶部
        this.$refs.lyricList.scrollTo(0,0,1000)
      }
      this.playingLyric=txt
    },
    getLyric(){
        this.currentSong.getLyric().then(lyricStr=>{
            //对当前的歌词进行解析
            this.currentLyric= new Lyric(lyricStr,this.handleLyric)
            //当歌曲播放的时候，调用Lyric实例 的 play()方法
            if(this.playing){
                this.currentLyric.play()
            } 
        }).catch(err=>{//当请求失败时处理
            this.currentLyric = null
            this.playingLyric = ''
            this.currentLineNum = 0
        })
    }
  
  },
  watch: {
    //监听currentSong的变化
    currentSong(newSong, oldSong){ //确保DOM已存在
        if(newSong.id === oldSong.id) {
          return
        }

        if(this.currentLyric){
          this.currentLyric.stop() //切换歌曲后，清空前一首歌歌词Layric实例中的定时器
        }
        //手机微信处理
        setTimeout(()=>{
          this.$refs.audio.play();
          this.getLyric()
        },1000)
    },
    playing(isplay){
      this.$nextTick(()=>{
        isplay ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }  
  },
}
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all .4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position absolute
          left 0px
          top  0px

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

</style>