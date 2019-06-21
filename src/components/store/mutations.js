import * as types from './mutation-types'

const mutations={
   //改变singer
   [types.SET_SINGER](state,singer){
        state.singer=singer
   },
   //改变是否在播放
   [types.SET_PLAYING](state,flag){
      state.fullScreen=flag
   },
   //改变是否缩小和展开
   [types.SET_FULLSCREEN](state,flag){
      state.fullScreen=flag
   },
   //当前的播放模式
   [types.SET_MODE](state,mode){
      state.mode=mode
   },
   //当前播放的是第几首歌曲
   [types.SET_CURRENTINDEX](state,index){
      state.currentindex=index
   },
   //当前的播放列表
   [types.SET_PLAYLIST](state,list){
      state.playlist=list
   },
   //当前的模式的播放的模式的列表
   [types.SET_SEQUENCELIST](start,sequenceList){
      state.sequenceList=list
   }
}



export default mutations
