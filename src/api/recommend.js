//在这份js里面写请求recommend的异步请求方法

//引入需要的config配置的参数
import {commonParams,options} from './config'
import jsonp  from 'common/js/jsonp.js'

//获取到推荐的信息谁
export function getRecommend(){
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data=Object.assign({},commonParams,{
        platfrom: 'h5',
        notice: 0,
        uin: 0,
        needNewCode: 1
    })   
   return jsonp(url,data,options)
}


//引入axios
import axios from 'axios'
export function getRecommendList(){
    return new Promise(function(resolve,reject){
        let url='/api/getRecomonList'
        let data=Object.assign({}, commonParams, {
            platform: 'yqq',
            hostUin: 0,
            sin: 0,
            ein: 29,
            sortId: 5,
            needNewCode: 0,
            categoryId: 10000000,
            rnd: Math.random(),
            format: 'json'
        })
        axios.get(url,{params:data}).then(res=>{
            resolve(res.data)
        }).catch(err=>{
            reject(err);
        })
    })
}


//获取到推荐的详情页面的数据
export const getSongList=function(disstid){
    return new Promise(function(resolve,reject){
        let url='/api/getSongList';
        let data=Object.assign({},commonParams,{
            uin: 0,
            format: 'json',
            notice: 0,
            needNewCode: 1,
            new_format: 1,
            pic: 500,
            disstid, //关键数据
            type: 1,
            json: 1,
            utf8: 1,
            onlysong: 0,
            picmid: 1,
            nosign: 1,
            song_begin: 0,
            platform: 'h5',
            song_num: 100,
            _: +new Date()
        })
        axios.get(url,{params:data}).then(res=>{
            resolve(res.data)
        }).then(err=>{
            reject(err)
        })
    })
}