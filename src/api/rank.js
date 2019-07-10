import { commonParams,options} from "api/config.js";
import jsonp from "common/js/jsonp.js";

export function getRankList(){
    const url = "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg"
    let data=Object.assign({},{
        platform: 'h5',
        needNewcode: 1
    },commonParams)
    return jsonp(url,data,options)
}

//获取排行绑的歌单
export function getRankDetail(topid){
    const url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg"
    let data=Object.assign({},commonParams,{
        topid,
        needNewCode: 1,
        uin: 0,
        tpl: 3,
        page: 'detail',
        type: 'top',
        platform: 'h5'
    })
    return jsonp(url,data,options)
}