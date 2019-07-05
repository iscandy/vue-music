<template>
    <musicList :songs="songs" :bgImage="bgImage" :title="title"></musicList>
</template>


<script>
import musicList  from 'components/music-list/music-list'
import {rank} from 'vuex'
import {getRankDetail}  from 'api/rank'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
export default {
    components:{
        musicList
    },
    data() {
        return {
            songs:[]
        }
    },
    created(){
        this._getTopListDetail();
    },
    computed:{
        ...mapGetters(['rank']),
        bgImage(){
            return this.rank.id
        },
        title(){
            return this.rank.id
        }
    },
    methods:{
       _getTopListDetail(){
           getRankDetail(this.rank.id).then(res=>{
               console.log(res);
           })
       }
    }

}
</script>


