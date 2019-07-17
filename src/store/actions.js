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


function findIndex(list, song) {
    return list.findIndex((item) => {
      return item.id === song.id
    })
  }
  

//在当前列表插入一首歌曲
 export const insert_song=function({commit,state},song){
     let playlist=state.playlist.slice(0);//当前的播放的列表
     let sequenceList=state.sequenceList.slice(0);//当前的播放默认的列表
     let currentIndex=state.currentIndex;//当前的播放歌曲的索引
     let playSong=playlist[currentIndex]//当前的播放的歌曲

     let findplayIndex=findIndex(playlist,song);//判断播放列表中是否有这首歌

     currentIndex++;//因为长度多了一首，让当前的索引++
     playlist.splice(currentIndex,0,song);//在当前的播放列表的位置插入一首歌
     //当播放列表中有这首歌,做删除重复歌曲操作
     if(findplayIndex >-1 ){
        //当播放列表中有这首歌
        if(currentIndex>findplayIndex){
            playlist.splice(findplayIndex,1)
            currentIndex--
        }else{
            playlist.splice(findplayIndex+1,1)
        }
     }

    //需要插入的位置
    let sequenceIndex=findIndex(sequenceList,playSong)+1;
    //判断是否有这首歌
    let findSequenceIndex=findIndex(sequenceList,song);
    sequenceList.splice(sequenceIndex,0,song)//插入一首歌

    if(findIndex>-1){//存在重复的歌曲
        if(findIndex < sequenceIndex){
            sequenceList.splice(findSequenceIndex,1);
        }else{
            sequenceList.splice(findSequenceIndex+1,1)
        }
    }
    //commit提交更改
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCELIST,sequenceList)
    commit(types.SET_CURRENTINDEX,currentIndex)
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, true)
 }



 //引入本地存储的方法
 import {saveSearch,deleteSearchOne,removeAllSearch} from '../common/js/cache'
 //对搜索列表进行修改并且保存在本地
 export function set_searchHistoty({commit,state},query){
     commit(types.SET_SEARCHHISTORY,saveSearch(query))
 }

//根据当前的值去删除相应的缓存数据
 export function delete_SearchOne({commit,state},item){
    commit(types.SET_SEARCHHISTORY,deleteSearchOne(item))
 }

 //删除所有的缓存的数据
 export function delete_SearchAll({commit,state}){
    commit(types.SET_SEARCHHISTORY,removeAllSearch())
 }
