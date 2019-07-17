import storage from 'good-storage'

const SEARCH_KEY='_search_' //双划线避免与外部冲突
const MAXLENGTH=15 //最大的长度

//插入搜索历史的方法
//参数：当前的数组，插入的值，比较方法（目的在于获取到之前搜索过的那个val的位置），最大长度
function insertArray(arr,val,compare,maxlength){
    let index=arr.findIndex(compare)//获取到之前搜索的index（要是之前搜索过了index为-1）

    if(index==0){//当当前的是第一项，之前的也是在第一项，那么就不做任何添加操作
        return
    }

    arr.unshift(val) //将我们需要插入的项插第一位

    //之前有搜索过的记录
    if(index>0){
        arr.splice(index+1,1)//将之前的删除
    }

    if(maxlength && arr.length>maxlength){
        arr.pop();
    }

}

export function saveSearch(val) { 
    //取出来
    let searchArr= storage.get(SEARCH_KEY,[])//获取到内存中的_search_。找不到的话就给默认值为[]
    
    //得到要存的数据（直接对searchArr做插入操作）
    insertArray(searchArr,val,(item)=>{
        return item==val
    },MAXLENGTH)
    //存进去（得到新的searchArr，存进本地）
    storage.set(SEARCH_KEY,searchArr) 
    
    //将searchArr返回
    return searchArr
}

//获取到key为_search_本地缓存
export function getSearchStorage(){
   return  storage.get(SEARCH_KEY,[])
}


//删除当前项的本地缓存
export function deleteSearchOne(val){
    //获取到当前的
    let searchArr= storage.get(SEARCH_KEY,[])//获取到内存中的_search_。找不到的话就给默认值为[]
    let index=searchArr.findIndex((item)=>{
        return val==index
    })
    searchArr.splice(index,1);
    //将当前的存进去
    storage.set(SEARCH_KEY,searchArr) 
    return searchArr;
}

//删除所有的本地缓存
export function removeAllSearch(){
    storage.remove(SEARCH_KEY)
    return []
}

