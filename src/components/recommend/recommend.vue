<template>
    <div>
        <slider v-if="recommend.length">
            <li v-for="(item,index) in recommend" :key="index">
                <a :href="item.linkUrl" target="_blank">
                    <img :src="item.picUrl">
                </a>
            </li>
        </slider>
    </div>
</template>

<script>
//引入异步请求函数
import {getRecommend} from 'api/recommend.js'
//引入常用的配置参数的ERR_OK
import {ERR_OK} from 'api/config.js'
//引入slider组件
import slider from 'components/slider/slider'


export default {
    created(){
        //用——开头的方法名
        this._getRecommend();
    },
    components:{
        slider
    },
    data:function () {
        return{
             recommend:[]
        }
    },
    methods: {
       //一般在methods里面写方法的具体实现，不要在created或者mounted等生命周期中写，方便管理
       _getRecommend(){
            getRecommend().then(res=>{
                if(res.code==ERR_OK){
                    this.recommend=(res.data.slider);
                }
            })
       }
    },
}
</script>




