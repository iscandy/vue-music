//引入获取歌词的接口
import {getLyric}  from 'api/song.js'
import {ERR_OK} from 'api/config'
import { Base64 } from 'js-base64';

class Song{
    //因为参数过多，我们把参数放在一个对象中去
    constructor({id, mid, singer, name, album, duration, image, url}){
        this.id=id,
        this.mid=mid,
        this.singer=singer,
        this.name=name,
        this.album=album,
        this.duration=duration,
        this.image=image,
        this.url=url
    }
    //获取到歌词的函数
    getLyric(){
        if(this.lyric){
            Promise.resolve(this.lyric);
        }else{
            return new Promise((resolve,reject)=>{
                getLyric(this.mid).then(res=>{
                    if(res.retcode ==ERR_OK){
                        this.lyric = Base64.decode(res.lyric);
                        resolve(this.lyric);
                    }else{
                        reject('error lyric');
                    }
                }).catch(err=>{
                    reject('error lyric');
                })
            })
        }
    }
}


//抽象出一个工厂方法：传入musicData对象参数，实例化一个Song
export default function createSong(musicData,songVkey){
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval, //歌曲时长
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        //播放源这里的songVkey需要动态获取。
        url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=6319873028&uin=0&fromtag=66`
    })
}


//格式化处理singer数据
function filterSinger(singer) {
    let ret=[]
    if(!singer){
        return ''
    }else{
        singer.forEach(item => {
            ret.push(item.name);
        });
    }
    return ret.join('/');
    
}




