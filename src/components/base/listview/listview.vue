<template>
    <scroll :data="data" class="listview" ref="listview" :probeType="probeType">
          <ul>
              <li  class="list-group" ref="listGroup"  v-for="(item,index) in data" :key="index">
                <h2 class="list-group-title">{{item.title}}</h2>
                <ul>
                    <li class="list-group-item" v-for="singer in item.items" :key="singer.id">
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
    </scroll>
</template>


<script>
import scroll from '../scroll/scroll'
import {getData}  from 'common/js/dom'
const CUTHEIGHT=18;//每个字母的高度
export default {
  props:{
    data:{
      type:Array,
      default:[]
    }
  },
  data(){
    return{
        listHeigth:[],
        currentIndex:0,
        probeType:3,
        touch:{}
    }
  },
  computed: {
    shortcut(){////得到title的集合数组，‘热门’取1个字
        let arr=[];
        this.data.forEach(item => {
          arr.push(item.title.substr(0,1));
        });
        return arr
    }
  },
  components:{
    scroll
  },
  methods: {
     onShortcutTouchStart(e) {
          //记录开始的位置
          let anchorIndex=getData(e.target,'index')
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
      //滑动到哪里
      _scollTo(index){
        this.$refs.listview.scrollTo(0,-this.listHeigth[index],0);
        this.currentIndex=index;
      }
  },
  watch: {
    data(){
      setTimeout(()=>{
          this.listHeigth=[];
          let height=0;
          this.listHeigth.push(0);
          let list=[...this.$refs.listGroup];
          for(let i=0;i<list.length;i++){
              height+=list[i].clientHeight;
              this.listHeigth.push(height);
          }
      },20)
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