//引入jsonp  https://github.com/webmodules/jsonp
import originjsonp  from 'jsonp'

//返回一个函数。传入url。data 和callback（放在option里面的callback）
export default function jsonp(url,data,option){
    //对url和data进行拼接，拼接成一个新的url
    //判断原来的url中是否包含有?号 ，有问号加上 & 没有 则加上? 并且拼接上data参数部分
    url+=(url.indexOf('?')>-1 ? '&' : '?')+param(data);

    //返回一个promise的实例。可以直接用这个实例的then方法来获取到resolve和reject状态的回调
    return new Promise(function(resolve,reject){
        //第一个参数是url，因为jsop是get请求，在此之前腰将基本的url和data进行拼接组成新的url
        //第二个参数，option是配置好的callback的参数
        //第三个参数，是回调函数
        originjsonp(url, option,(err, data)=>{
            if(!err){
                resolve(data);
            }else{
                reject(data);
            }
        })
    })

}

//对传进来的data做拼接处理
function param(data){
    let str='';
    // data.keys().forEach(key => {
    //     str+=`${key}=${data[key]}&`
    // });
    // str.substring(0,str.length-1)//从第一位开始截取到最后一位
    for(var key in data){
        let value=data[key] !== undefined ? data[key] : ''
        str+=`&${key}=${encodeURIComponent(value)}`
    }
    return str ? str.substring(1) :''
}




