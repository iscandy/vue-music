import * as types from './mutation-types'
import { type } from 'os';
const mutations={
    //歌手
    [types.SET_SINGER](state,singer){
        state.singer=singer
    },
    //改变播放的状态
    [types.SET_PLAYING](state,playing){
        state.playing=playing
    },
    //是否全屏
    [types.SET_FULLSCREEN](state,flag){
        state.fullScreen=flag
    },
    //播放模式
    [types.SET_MODE](state,mode){
        state.mode=mode
    },
    //播放的是哪一项
    [types.SET_CURRENTINDEX](state,index){
        state.currentIndex=index
    },
    [types.SET_PLAYLIST](state,list){
        state.playlist=list
    },
    //播放模式列表
    [types.SET_SEQUENCELIST](state,list){
        state.sequenceList=list
    }
}
export default mutations