
import {playMode}  from 'common/js/config'
const state={
    singer:{},//歌手
    playing:true,//是否在播放
    fullScreen:true,//展开和隐藏
    mode:playMode.sequence,//播放的模式默认是顺序播放
    currentIndex:0,//当前播放的是哪一首歌
    playlist:[], //当前的播放列表
    sequenceList: [], //存储歌曲原始列表（默认是顺序列表）
}

export default state
