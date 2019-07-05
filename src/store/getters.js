//歌手
export  const singer=state=>state.singer
//是否在播放
export const playing=state=>state.playing
//展开和隐藏
export const fullScreen=state=>state.fullScreen
//播放的模式
export const mode=state=>state.mode
//当前播放的是哪一首歌
export const currentIndex=state=>state.currentIndex
//播放的列表
export const playlist=state=>state.playlist
//存初始的列表的数据
export const sequenceList=state=>state.sequenceList
//当前播放的哪一首歌
export const currentSong = (state) => {
    //返回当前播放的结果
    return state.playlist[state.currentIndex] || {}
}

//推荐的歌单的
export const disc=(state)=>state.disc