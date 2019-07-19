<template>

    <div>
    <transition name="list-fade">
    <div  class="playlist" v-show="showFlag" @click="hide" >
        <div class="list-wrapper" @click.stop>
            <div class="list-header">
                <h1 class="title">
                  <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
                  <span class="text">{{modeText}}</span>
                <span class="clear" @click="delectAll">
                  <i class="icon-clear"></i>
                </span>
                </h1>
            </div>

              <scroll :data="sequenceList" ref="scroll" class="list-content">
                <transition-group tag="ul" name="list">
                    <li class="item" :key="item.id" v-for="(item,index) in sequenceList" ref="item" @click="playSong(item,index)">
                        <i class="current" :class="currentPlayIcon(item)"></i>
                        <span class="text">{{item.name}}</span>
                        <span class="like">
                            <i class="icon-not-favorite"></i>
                        </span>
                        <span class="delete" @click.stop="delectme(item)">
                            <i class="icon-delete"></i>
                        </span>
                    </li>
                </transition-group>
              </scroll>


            <div class="list-operate">
                <div class="add">
                    <i class="icon-add"></i>
                    <span class="text">添加歌曲到队列</span>
                </div>
            </div>
            <div class="list-close" @click="hide">
                <span>关闭</span>
            </div>
        </div>
    </div>
    </transition>

    <confirm  ref="confirm" confirmBtnText="清除全部" text="您确定清除全部吗" @confirm="confirmDeleteAll"></confirm>
    </div>


</template>

<script>
import {mapMutations,mapActions} from 'vuex'
import scroll from 'components/base/scroll/scroll'

import confirm  from '../base/confirm/confirm'
import {playerMixin} from 'common/js/mixin.js'
import {playMode} from 'common/js/config'

export default {
  mixins:[playerMixin],
   data(){
       return{
           showFlag:false
       }
   },
   computed:{
     modeText(){
       return this.mode===playMode.sequence ? '顺序播放' : this.mode===playMode.loop ? '循环播放' : '随机播放'
     }
   },
   components:{
     scroll,
     confirm
   },
   methods:{
     ...mapActions({
       'delectSequenceList':'delectSequenceList',
       'delectSequenceListAll':'delectSequenceListAll'
     }),
    show(){
    this.showFlag=true;
    setTimeout(()=>{
        this.$refs.scroll.refresh()
          this.listScrollToElement()
    },200)
    },
    hide(){

        this.showFlag=false
    },
      currentPlayIcon(song){
          return  song.id==this.currentSong.id ? 'icon-play' : ''
      },
      selectItem(item){
          this.$refs.item
          this.$refs.scroll.scrollToElement();
      },
      //滚动到指定的元素
      listScrollToElement(){
        let fd_index =this.sequenceList.findIndex((item)=>{
          return item.id===this.currentSong.id
        })
        this.$refs.scroll.scrollToElement(this.$refs.item[fd_index],300);
      },
      //点击播放列表
      playSong(item,index){
          if(this.mode==playMode.random){ //当是随机播放的时候，需要找到相关的项
             index=this.playlist.findIndex((song)=>{
                  return song.id==item.id
              })
          }
          this.setCurrentIndex(index);
          this.setPlaying(true);
          this.listScrollToElement()
      },
      //点击删除当前项
      delectme(song){
        //需要改playlist
        //需要改sequenceList
        //需要改currentIndex
        //需要改playing
        this.delectSequenceList(song);
      },
      confirmDeleteAll(){
          this.delectSequenceListAll();
      },
      delectAll(){
        this.$refs.confirm.show();
      }
   }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>