<template>
    <div>
        <div class="normal-player" v-show="fullScreen">播放器</div>
        <div class="mini-player" v-show="!fullScreen">小的播放器</div>
    </div>
</template>

<script>
//在player中获取到vuex的数据 fullScreen控制是全屏还是mini
import {mapGetters} from 'vuex'
export default {    
    computed: {
        ...mapGetters(['fullScreen'])
    },   
}

</script>
