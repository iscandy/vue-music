import  {options,commonParams} from '../api/config';
import  jsonp from '../common/js/jsonp';
export function getHotKey(params) {
    let url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    let data=Object.assign({},commonParams,{
        g_tk: '1928093487',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        uin: 0,
        needNewCode: 1,
        platform:'h5'
    })
    return jsonp(url,data,options)
}


import axios from 'axios'
//列表的搜索处理(需要传入参数 keyworld:关键字，pageIndex:当前第几页，pageSize:一页多少条数据，isShowSinger是否需要展示歌手),
export  function search(keyworld,pageIndex,pageSize,isShowSinger){
    const url = '/api/search'
    let data=Object.assign({},commonParams,{
            w: keyworld,
            p: pageIndex,
            perpage:pageSize,
            n:pageSize,
            catZhida:  isShowSinger? 1 : 0,
            g_tk: '1928093487',
            inCharset:' utf-8',
            outCharset: 'utf-8',
            notice: 0,
            format: 'json',
            zhidaqu: 1,
            t: 0,
            flag: 1,
            ie: 'utf-8',
            sem: 1,
            aggr: 0,
            remoteplace: 'txt.mqq.all',
            uin: 0,
            needNewCode: 1,
            platform: 'h5',
    })
    return new Promise(function(resolve,reject){
            axios.get(url,{params:data}).then(res=>{
                resolve(res.data)
            }).catch(err=>{
                reject(err)
            })
    })
}





