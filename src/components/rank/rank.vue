<template>
    <div>

        <div class="rank" ref='rank'>
            <scroll class="toplist"  :data="topList" ref="scroll">
                <ul>
                    <li   class="item" v-for="(item,index) in topList" :key='index'>
                        <div   class="icon">
                            <img   width="100" height="100"  v-lazy="item.picUrl">
                        </div>
                        <ul   class="songlist">
                            <li  class="song" v-for="(song,index) in item.songList" :key="index" @click="selectItem(item)">
                                <span>{{index+1}} </span><span>{{song.singername}}- {{song.songname}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </scroll>
        </div>

        <router-view></router-view>
    </div>
</template>
<script>


import {getRankList} from 'api/rank.js'
import {ERR_OK} from 'api/config'
import scroll from 'components/base/scroll/scroll'
import {mapMutations} from 'vuex'
import {playlistMixin} from '../../common/js/mixin'
export default {
    mixins:[playlistMixin],
    created(){
        this._getRankList()
    },
    data() {
        return {
            topList:[]
        }
    },
    components:{
        scroll
    },
    methods:{
        ...mapMutations({
            set_rank:'SET_RANK'
        }),
        _getRankList(){
            getRankList().then(res=>{
                if(res.code==ERR_OK){
                    this.topList=res.data.topList
                }
                
            })
        },
        selectItem(rank){
            this.$router.push({
                path:`/rank/${rank.id}`
            });
            this.set_rank(rank);
        },
        //底部自适应
        handlePlayList(playlist){
           let bottom=playlist.length ? '60' : 0;
           this.$refs.rank.style['bottom']=`${bottom}px`
           this.$refs.scroll.refresh();

        }
    }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
