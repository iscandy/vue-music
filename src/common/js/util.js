function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//洗牌: 遍历arr， 从0-i 之间随机取一个数j，使arr[i]与arr[j]互换
export function shuffle(arr){
   let _arr = arr.slice() //改变副本，不修改原数组 避免副作用
   for(let i = 0; i<_arr.length; i++){
        let j = getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
   }
   return _arr
}