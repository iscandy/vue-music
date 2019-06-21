import {playMode}  from 'common/js/config'
const state={
    singer:{},//歌手
    playing:false,//是否在播放
    fullScreen:false,//展开和隐藏
    mode:playMode.sequence,//播放的模式默认是顺序播放
    currentIndex,//当前播放的是哪一首歌
    playlist:[], //播放的列表
    sequenceList: [], //顺序播放列表
    
}
export default state
