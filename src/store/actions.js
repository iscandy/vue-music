import * as types from './mutation-types'
import {playMode} from 'common/js/config.js'
import {shuffle}  from 'common/js/util.js'

export  const selectPlay=function({commit,state},{list,index}){
     commit(types.SET_PLAYING,true)
     commit(types.SET_FULLSCREEN,true)
     commit(types.SET_CURRENTINDEX,index)
     commit(types.SET_PLAYLIST,list)
     commit(types.SET_SEQUENCELIST,list)
 }


 export  const  setRandomPlay=function({commit},{list}){
       //将当前的播放状态设置为播放
        commit(types.SET_PLAYING,true)
        //设置当前的索引为0.默认播放第一个
        commit(types.SET_CURRENTINDEX,0)
        //设置当前的播放的列表
        commit(types.SET_PLAYLIST,shuffle(list.slice()))
        //设置当前的顺序列表
        commit(types.SET_SEQUENCELIST,list)
        //设置当前的播放的模式
        commit(types.SET_MODE,playMode.random)
        //设置为全屏
        commit(types.SET_FULLSCREEN, true)
 }
