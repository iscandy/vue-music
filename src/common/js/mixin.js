import  {mapGetters,mapMutations} from 'vuex'
export const playlistMixin={
    computed: {
        ...mapGetters([`playlist`])
    },
    mounted() {
        this.handlePlayList(this.playlist)
    },
    activated() {//keep-alive 组件切换的时候会触发activated
        this.handlePlayList(this.playlist)
    },
    watch: {
        playlist(newval){
            this.handlePlayList(newval)
        }
    },
    methods: {//组件中定义handlePlaylist，就会覆盖这个,否则没有定义的，就会抛出异常
        handlePlayList(){
            throw new Error("component must implement handlePlaylist method")
        }
    },
}




//引入工具函数打乱当前的顺序
import  {shuffle} from 'common/js/util'
//引入模式
import {playMode} from 'common/js/config'


export const playerMixin={
    computed: {
        ...mapGetters([
          'playlist',
          'currentSong',
          'mode',
          'sequenceList',
          'playing',
        ]),
        //模式播放按钮
        modeIcon(){
            return this.mode===playMode.sequence ? 'icon-sequence' : this.mode===playMode.loop ? 'icon-loop' : 'icon-random'
        }
    },
    methods: {
        ...mapMutations({
            setPlaying:'SET_PLAYING',
            setCurrentIndex:'SET_CURRENTINDEX',
            setMode:'SET_MODE',
            setPlayList:'SET_PLAYLIST'
        }),
         //改变歌曲的模式
        changeMode(){
            const mode = (this.mode + 1) % 3
            this.setMode(mode)
            let list = null
            if(mode === playMode.random){
            list = shuffle(this.sequenceList)
            }else{
            list = this.sequenceList
            }
            this.resetCurrentIndex(list) 
            this.setPlayList(list)
        },
         //重置当前的索引
            resetCurrentIndex(list){
                let index = list.findIndex((item) => { //es6语法 findIndex
                    return item.id === this.currentSong.id
                })
                this.setCurrentIndex(index)
            },


    }
    
}