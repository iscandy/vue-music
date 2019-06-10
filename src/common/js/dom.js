//判断元素中是否有className
export function hasClass(el,className){
    let reg=new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}

//如果没有类添加类
export function addClass(el,className){
    if(hasClass(el,className)){
        return 
    }
    //将el的className拆开
   let newClass= el.className.split(' ');
   //去除空格之后将新的类参加的newClass的数组中
   newClass.push(className);
   //给el加上类
   el.className=newClass.join(' ');
}

