<template>
    <musicList :songs="topList" :bgImage="bgImage" :title="title" :rank="isrank"></musicList>
</template>


<script>
import musicList  from 'components/music-list/music-list'
import {rank} from 'vuex'
import {getRankDetail}  from 'api/rank'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import createSong from 'common/js/song.js'
import {getMusicVkey} from 'api/singer.js'
export default {
    components:{
        musicList
    },
    data() {
        return {
            topList:[],
            isrank:true
        }
    },
    created(){
        if(!this.rank.id){
            this.$router.push({
                path:'/rank'
            })
        }else{
            this._getTopListDetail()
        }
        
    },
    computed:{
        ...mapGetters(['rank']),
        bgImage(){
            //让第一首歌作为封面
            if(this.topList.length){
               return this.topList[0].image
            }
            
            return this.rank.picUrl
        },
        title(){
            return this.rank.topTitle
        }
    },
    methods:{
       _getTopListDetail(){
           getRankDetail(this.rank.id).then(res=>{
             if( res.code==ERR_OK){
                 this.topList=this._normalrezie(res.songlist);
             }
           })
       },
       _normalrezie(list){
           let ret = []
           list.forEach(item => {
              let musicData=item.data;
              if(musicData.songid && musicData.songmid){
                ////同歌手详情页，歌曲的播放url中的vkey需要发送请求获取，同时将处理好的数据封装新的Song实例
                getMusicVkey(musicData.songmid).then((res)=>{
                    if(res.code==ERR_OK){
                       let songVkey=res.data.items[0].vkey
                       ret.push(createSong(musicData,songVkey));
                    }
                })
              }
           });
           return ret;
       }
    }

}
</script>


