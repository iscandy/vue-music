import  {mapGetters} from 'vuex'
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