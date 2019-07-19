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

    if(findSequenceIndex>-1){//存在重复的歌曲
        if(findSequenceIndex < sequenceIndex){
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
import { type } from 'os';
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



 //从当前的播放列表中删除其中一条数据
 export function deleteOne({commit,state},song){
    let playlist=state.playlist.slice(0);//当前的播放的列表
    let sequenceList=state.sequenceList.slice(0);//当前的播放默认的列表
    let currentIndex=state.currentIndex;//当前的播放歌曲的索引
    let index=findIndex(playlist,song)

    playlist.splice(index,1);
    if(playMode.random){
        let fs_index=findIndex(sequenceList,song)
        sequenceList.splice(fs_index,1);
    }else{
        sequenceList.splice(index,1)
    }

    currentIndex=index-1;


    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCELIST,sequenceList)
    commit(types.SET_CURRENTINDEX,currentIndex)
    
    commit(types.SET_PLAYING,true)
    commit(types.SET_SEARCHHISTORY,true)

 }


 //删除顺序列表中的其中某一项
 export function delectSequenceList({commit,state},song){
    let sequenceList=state.sequenceList.slice(0)
    let playlist=state.playlist.slice(0)
    let currentIndex=state.currentIndex
    let nowcurrent=currentIndex-1;
    
    let fs_index=findIndex(sequenceList,song)//找到顺序列表的项进行删除
    sequenceList.splice(fs_index,1);

    let fp_index=findIndex(playlist,song)//找到playlist的删除
    playlist.splice(fp_index,1);

    //当找到的项在currentIndex 之前。或者这个项是最后一个
    if(fp_index<currentIndex || fp_index===playlist.length){
        currentIndex--
    }
    

    if(playlist.length==0){
        currentIndex=-1
    }

    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCELIST,sequenceList)
    commit(types.SET_CURRENTINDEX,currentIndex)

    if(playlist.length){
        commit(types.SET_PLAYING,true)//每次删除都让当前的可以播放
    }
    

 }

//清除全部
 export function delectSequenceListAll({commit,state}){
     commit(types.SET_PLAYING,false)
     commit(types.SET_CURRENTINDEX,-1)
     commit(types.SET_PLAYLIST,[])
     commit(types.SET_SEARCHHISTORY,[])
 }
