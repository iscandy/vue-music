<template>
    <musicList :bgImage='bgImage' :songs='songs' :title='title' ></musicList>
</template>

<script>
import {mapGetters}  from 'vuex'
import {getSingerDetail,getMusicVkey}  from 'api/singer.js'
import {ERR_OK}  from 'api/config.js'
import createSong  from 'common/js/song.js'
import musicList from '../music-list/music-list'
export default {
    computed: {
        ...mapGetters([
            'singer'
        ]),
        bgImage(){
            return this.singer.avatar
        },
        title(){
            return this.singer.name
        }
    },
    data(){
        return{
            songs:[]
        }
    },
    created() {
        this._getSingerDetail();
    },
    components:{
        musicList  
    },
    methods: {
        _getSingerDetail(){
            //当在当前页面刷新的时候，跳转回singer页
            if(!this.singer.id){
                this.$router.push('/singer')
                return
            }
            //获取到列表
            getSingerDetail(this.singer.id).then(res=>{
               if(res.code==ERR_OK){
                   //对得到的数据进行处理
                  this.songs=this._normallizeSingerDetail(res.data.list)
               }
            }).catch(err=>{
                console.log(err);
            })
        },
        _normallizeSingerDetail(list){
            let ret=[];//返回值
            list.forEach(item => {
                let {musicData} = item   //得到每一项的musicData对象
                if(musicData.songid && musicData.albummid){ 
                    //在这里要获取到valkey
                    getMusicVkey(musicData.songmid).then(res=>{
                        if(res.code==ERR_OK){
                             let vkey=res.data.items[0].vkey
                             //传入musicData和vkey
                             ret.push(createSong(musicData,vkey))
                        }
                    })
                }
            });
            return ret
        }
    },
}
</script>
