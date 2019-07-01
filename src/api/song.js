import {commonParams} from './config'
import axios from 'axios'

//根据id去获取到歌词信息
export function getLyric(mid){
    const url = '/api/lyric'
    return new Promise((resolve,reject)=>{
        let data=Object.assgin({},commonParams,{
            songmid: mid,
            pcachetime: +new Date(),
            platform: 'yqq',
            hostUin: 0,
            needNewCode: 0,
            g_tk: 5381, //会变化，以实时数据为准
            format: 'json' //规定为json请求
        })
        axios.get(url,{params:data}).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err);
        })
    })
}