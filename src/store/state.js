
import {playMode}  from 'common/js/config'
const state={
    singer:{},//歌手
    disc:{},//推荐的歌单
    rank:{},//排行榜的歌单
    
    playing:true,//是否在播放
    fullScreen:true,//展开和隐藏
    mode:playMode.sequence,//播放的模式默认是顺序播放
    currentIndex:0,//当前播放的是哪一首歌
    playlist:[], //播放的列表
    sequenceList: [], //循环，随机或者顺序列表
}

export default state
