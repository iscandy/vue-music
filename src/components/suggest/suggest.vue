<template>
     <div   class="suggest">
            <ul   class="suggest-list">
                <li   class="suggest-item">
                <div   class="icon">
                    <i   class="icon-music"></i>
                </div>
                <div   class="name">
                    <p   class="text">
                        我们的爱-飞儿乐团
                    </p>
                </div>
                </li>
            </ul>
        </div>   
</template>

<script>
import {search} from '../../api/search'
import {ERR_OK} from '../../api/config'
const pageSize = 20 //抓取数据一页有多少数据
export default {
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            pageIndex:1,
            list:[]//当前的列表的数据
        }
    },
    methods:{
        //发送请求
        search(newQuery){
            //关键字,当前页(在data中维护当前页),一页多少条,是否展示歌手(根据props传递过来)
            search(newQuery,this.pageIndex,pageSize,this.showSinger).then(res=>{
                if(res.code==ERR_OK){
                    this.list=this._normalresizeResult(res)
                }
            })
        },
        _normalresizeResult(data){
            console.log(data);
            let ret=[];
            data.forEach(item => {
                
            });
            return ret
        }
    },
    watch: {
      query(newQuery) {
        //监听到query的变化，发送请求
        this.search(newQuery);
      }
    }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>