<template>
    <scroll 
      class="listview" 
      ref="listview" 
      :data="data"
      :probeType="probeType" 
      :listenScroll="listenScroll"
      @scroll="scroll"
     >
          <ul>
              <li  class="list-group" ref="listGroup"  v-for="(item,index) in data" :key="index">
                <h2 class="list-group-title">{{item.title}}</h2>
                <ul> 
                    <li class="list-group-item" v-for="singer in item.items" :key="singer.id"  @click="selectItem(singer)">
                      <img class="avatar" v-lazy="singer.avatar">
                      <span class="name">{{singer.name}}</span>
                    </li>
                </ul>
              </li>
          </ul>
          <!-- 右侧点点部分-->
          <div class="list-shortcut">
              <ul  @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
                <li 
                    v-for="(item,index) in shortcut" 
                    :key="index"
                    :data-index="index" class="item"
                    :class="{current:index==currentIndex}"
                >
                  {{item}}
                </li>
              </ul>
          </div>
          <!-- 头部固定处理 -->
          <div class="list-fixed" v-show="fixedTitle" ref="fixedTitle">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>

        <!-- loading部分 -->
        <div class="loading-container" v-show="!data.length">
          <loading></loading>
        </div>
        
    </scroll>
</template>


<script>
import scroll from '../scroll/scroll'
import {getData}  from 'common/js/dom'
import loading from '../loading/loading'
const CUTHEIGHT=18;//每个字母的高度
const TITLE_HEIGHT = 30;//浮动的标题的高度
export default {
  props:{
    data:{
      type:Array,
      default:[]
    }
  },
  data(){
    return{
        currentIndex:0,
        probeType:3,
        touch:{},//放右侧的字母的touchmove的事件
        scrollY:-1,
        diff: -1 //fixed title的偏移位置
    }
  },
  components:{
    scroll,
    loading
  },
  created(){
      //当不需要渲染到dom上，不需要实时监听的，我们不必要放在data上
      this.listenScroll=true;//是否监听滚动事件
      this.listHeight=[]
  },
  computed: {
    shortcut(){////得到title的集合数组，‘热门’取1个字
        let arr=[];
        this.data.forEach(item => {
          arr.push(item.title.substr(0,1));
        });
        return arr
    },
    fixedTitle(){
      //做边界处理
      if(this.scrollY>0){
          return ''
      }
      return this.data[this.currentIndex] ?  this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    //常见习惯：私有方法如_scrollTo()一般放在下面，公共方法或绑定事件的方法如scroll()放在上面
     onShortcutTouchStart(e) {
          //记录开始的位置
          let anchorIndex=getData(e.target,'index')
          if(!anchorIndex && anchorIndex !== 0){
            return
          }
          this.touch.y1=e.touches[0].pageY;//开始的y坐标

          this.touch.anchorIndex=anchorIndex;
          //去到listHeigth数组的某一项
          this._scollTo(anchorIndex);
      },
      //计算手机放下的位置，和move之后的位置，比较，让左边的滚动，用this.touch来记录位置信息
      onShortcutTouchMove(e){
           this.touch.y2=e.touches[0].pageY;//开始的y坐标
           let delta=(this.touch.y2-this.touch.y1)/CUTHEIGHT | 0//向下取整。获取到最接近的值
           let anchorIndex=parseInt(this.touch.anchorIndex)+delta
           this._scollTo(anchorIndex);
      },
      selectItem(singer){
        this.$emit('select',singer)
      },
      //接受到子组件的pos.y
      scroll(pos){
          this.scrollY=pos.y;//获取到y值。并且给了scrollY
      },
      //滑动到哪里
      _scollTo(index){
        //做边界处理
        //当点击的不是右侧的热门和字母块，
        if(!index && index !== 0){
          return
        }
        //当touchmove一直在执行
        if(index < 0){
          index = 0
        }else if(index > this.listHeight.length - 2){
          index = this.listHeight.length - 2
        }
        this.$refs.listview.scrollTo(0,-this.listHeight[index],0);
        this.currentIndex=index;
      },
      _calculateHeight(){
          this.listHeight=[];
          let height=0;
          this.listHeight.push(0);
          let list=[...this.$refs.listGroup];
          for(let i=0;i<list.length;i++){
              height+=list[i].clientHeight;
              this.listHeight.push(height);
          }
      }
  },
  watch: {
    data(){
      setTimeout(()=>{
          this._calculateHeight()
      },20)
    },
    //监听scrollYDE变化
   scrollY(newY) {
          const listHeight = this.listHeight
          if(!listHeight){
            return
          }
          //当滚动到顶部，newY>0
          if(newY > 0) {
            this.currentIndex = 0
            return
          }
          //在中间部分滚动，遍历到最后一个元素，保证一定有下限，listHeight中的height比元素多一个
          for(let i = 0; i < listHeight.length-1; i++){
            let height1 = listHeight[i]
            let height2 = listHeight[i+1]

            //diff=下项+已经移动的距离
            //得到fixed title上边界距顶部的偏移距离 = 歌手列表title height下限 + newY（上拉为负值）
            this.diff = height2 + newY;

            if(-newY >= height1 && -newY < height2) { 
                this.currentIndex = i
                //  console.log(this.currentIndex)
                return
            }
          }
          //当滚动到底部，且-newY大于最后一个元素的上限
          //currentIndex 比listHeight中的height多一个, 比元素多2个
          this.currentIndex = listHeight.length - 2
    },
    //监听固定的标题的底部距离下一项的距离
    diff(newVal){
      //当距离大于0，并且当前的距离小于30，即下一项还没完全和固定标题粘合。
        let fixedTop=(newVal>0 && newVal<TITLE_HEIGHT) ?　newVal - TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop){
            return 
        }
        this.fixedTop = fixedTop
         this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>