<template>
   <div ref="wrapper">
       <slot></slot>
   </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props: {
        //probeType: 1 滚动的时候会派发scroll事件，会截流。2 滚动的时候实时派发scroll事件，不会截流 。3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        probeType: { 
            type: Number, 
            default: 1
        },
        // click: true 是否派发click事件，通常判断浏览器派发的click还是betterscroll派发的click，可以用event._constructed，若是bs派发的则为true
        click: { 
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        },
        listenScroll:{
            type:Boolean,
            default:false
        },
        //是否需要上拉刷新
        pullup:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            scroll:null
        }
    },
    mounted(){
        setTimeout(() => { //确保DOM已经渲染
            this. _initScroll()
        }, 20)
    },
    methods:{
         _initScroll(){
            if(!this.$refs.wrapper){
                     return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                  probeType : this.probeType,
                  click: this.click
            })

            //判断是否需派发一个scroll事件
             if(this.listenScroll){//派发一个scroll事件
                let me=this;
                this.scroll.on('scroll',(pos)=>{
;
                    //给父组件分发一个getScrollY事件。并且传递pos.y参数
                    me.$emit('scroll',pos)
                })
             }

            //判断是否需要上拉刷新
            if(this.pullup){
                this.scroll.on('scrollEnd',(pos)=>{
                    if(this.scroll.y<=(this.scroll.maxScrollY+50)){//当滑动到底部50px处
                        this.$emit('scrollToEnd');//向外暴露一个scrollEnd 事件
                    }    
                })
            }
        },
        refresh() {
           // 强制 scroll 重新计算，当 better-scroll 中的元素发生变化的时候调用此方法
           this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            // 滚动到指定的位置；这里使用apply 将传入的参数，传入到this.scrollTo()
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    watch:{
          data() {
            setTimeout(() => {
                this.refresh()
            }, 20)
        }
    }
    
    
}
</script>