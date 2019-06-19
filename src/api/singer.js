import {commonParams,options} from './config'
import jsonp  from 'common/js/jsonp.js'

//获取到歌手页面列表数据
export function getsingerList(){
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data=Object.assign({},commonParams,{
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        g_tk: 1664029744, 
    })   
   return jsonp(url,data,options)
}


//获取到歌手详情页面列表数据,根据id来获取数据，所以要传入singerId
export function getSingerDetail(singerId){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data=Object.assign({},commonParams,{
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1,
        singermid: singerId
    })
    return jsonp(url,data,options)
}


//获取到播放源的url
import axios  from 'axios'
export function getMusicVkey(songmid) {
    const url = '/api/getMusicVkey'
    const data = Object.assign({}, commonParams, {
          songmid: songmid,
          filename: 'C400' + songmid + '.m4a',
          guid: 6319873028, //会变，以实时抓取的数据为准
          platform: 'yqq',
          loginUin: 0,
          hostUin: 0,
          needNewCode: 0,
          cid:205361747,
          uin: 0,
          format: 'json'
   })
   return new Promise(function(resolve,reject){
        axios.get(url,{ params: data}).then(res=>{
            resolve(res.data)
        }).catch(err=>{
            reject(err)
        })
   })   
}