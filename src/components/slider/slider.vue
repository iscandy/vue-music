<template>
    <div class="slider" ref="slider">
        <ul class="slider-group" ref="sliderGroup">
            <slot></slot>    
        </ul>
    </div>  
</template>

<script>
import BScroll from 'better-scroll'
export default {
    //可以接收父组件传递过来的数据
    props:{ 
        // 是否循环播放
        loop:{
            type:Boolean,
            default:true
        },
        // 是否自动播放
        autoPlay:{
            type:Boolean,
            default:true
        },
        // 播放间隔
        interval:{
            type:Number,
            default:3000
        }
    },
    mounted() {
        //设置轮播盒子的宽度
        this._setSliderWidth();
        //让页面轮播
        this._initSilder()
    },
    methods: {
        _setSliderWidth(){
            this.children = this.$refs.sliderGroup.children
            let width = 0
            let sliderWidth = this.$refs.slider.clientWidth
            for(let i=0; i < this.children.length; i++) {
                 let child = this.children[i]
                 child.style.width = sliderWidth + 'px'//不要忘记加单位！
                 width += sliderWidth
            }
            this.$refs.sliderGroup.style.width = width + 'px'//不要忘记加单位!
        },
        _initSilder(){
            new BScroll(this.$refs.slider,{
                scrollX: true, //横向滚动
                scrollY: false, //禁止纵向滚动
                momentum: false,//禁止惯性运动
            })
        }
    },
}
</script>

<style>
.slider-group::after{
    clear: both;
    content: "";
    display: block
}
.slider-group li{
    float: left;
}
.sliderGroup a{
  display: block
}

.sliderGroup img{
    width: 100%;
}
</style>


