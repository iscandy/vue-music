<template>
    <div>
        <musicList :bgImage="bgImage" :songs="songs" :title="title" ></musicList>
    </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'

//引入歌曲类
import  {creatSongList} from 'common/js/song.js'
//引入getMusicVkey
import {getMusicVkey} from 'api/singer'


//引入musiclist
import musicList from 'components/music-list/music-list.vue'



export default {
    data() {
        return {
            songs:[] 
        }
    },
    components:{
        musicList
    },
    computed:{
        ...mapGetters(['disc']),
        bgImage(){
             return this.disc.imgurl
        },
        title(){
            return this.disc.dissname 
        }
    },
    created(){
        this._getSongList()
    },
    methods: {
        _getSongList(){
            if(!this.disc.dissid){
                this.$router.push('/recommend');
            }
           getSongList(this.disc.dissid).then(res=>{
               if(res.code==ERR_OK){
                   //做数据处理
                   this.songs=this._normalrizeSongs(res.cdlist[0].songlist)
               }
            })
        },
        //同歌手详情页，歌曲的播放url中的vkey需要发送请求获取，同时将处理好的数据封装新的Song实例
        _normalrizeSongs(list){
            let ret = []
            list.forEach(musicData => {
                 if(musicData.id && musicData.album) {
                    getMusicVkey(musicData.mid).then(res=>{
                        if(res.code===ERR_OK){
                            ret.push(creatSongList(musicData,res.data.items[0].vkey)) 
                        }
                    })
                 }
            });
            return ret
        }   
    },
}
</script>


