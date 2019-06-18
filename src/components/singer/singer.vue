<template>
    <div class="listview-wrap">
        <listview :data="singerList" @select="selectSinger"></listview>
        <transition name="slide">
        <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import listview from 'components/base/listview/listview'
import {getsingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'

//引入歌手类文件
import Singer from 'common/js/singer'
//常量配置
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
    components:{
        listview
    },
    data() {
        return {
            singerList:[]
        }
    },
    created(){
        setTimeout(()=>{
            this._getsingerList()  
        },3000)
    },
    methods:{
         _getsingerList(){
            getsingerList().then(res=>{
                if(res.code===ERR_OK){
                    //将数据做过滤，过滤出我们需要的数据，我们将前10当是热门的数据
                    this.singerList=this._normalizeSinger(res.data.list)
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        //对歌手数据进行处理
        _normalizeSinger(list){
            //首先我们先对数据进行分类
            let map={
                hot:{
                   title: HOT_NAME,
                   items: []
                }
            }
            //首先我们先得到热门的歌曲,我们将得到的数据的前十条作为热门数据
            list.forEach((item,index) => {
                //在这里我们得到了热门的歌手
                if(index<HOT_SINGER_LEN){
                  map.hot.items.push(new Singer({
                       id: item.Fsinger_mid,
                       name: item.Fsinger_name,
                    })
                  );
                }
                //在这里我们得到各个字母的的分类的歌手
                let key=item.Findex;
                if(!map[key]){
                    //当没有当前的字母项,我们创建一个
                    map[key]={
                        title: key,
                        items: []
                    }
                }
                //把相应的项添加到map[key]中
                map[key].items.push(new Singer({
                       id: item.Fsinger_mid,
                       name: item.Fsinger_name,
                    })
                )

            });

            let hot=[]
            let ret=[]
            //对数据进行分类，分成字母类数组和热门类数组
            for(let key in map){
                let val=map[key];
                if(val.title.match(/[a-zA-Z]/)){
                      ret.push(val);
                }else if(val.title===HOT_NAME){
                    hot.push(val);
                }
            }
            //数组的字母类数组进行排序
            ret.sort((a,b)=>{
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret);
        },
        //监听到点击的事件，改变路由
        selectSinger(singer){
             this.$router.push({
                 path:`/singer/${singer.id}`
             })
        }
    }
}
</script>


<style scoped>
.listview-wrap{
    position: fixed;
    top: 88px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}
.slide-enter-active,.slide-leave-active{
    transition: all .3s
}
.slide-enter,.slide-leave-to{
    transform: translate3d(-100%,0,0)
}

</style>

