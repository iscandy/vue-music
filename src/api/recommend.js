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

import axios  from 'axios'
//引入axios
export function getListData(){
    const url='/api'
    let data={
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'GB2312',
        notice: 0,
        platform:'yqq.json',
        needNewCode: 0,
        cmd: 'shoubo',
        lan: 'all',
    }
}