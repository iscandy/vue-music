<template>
    <div class="loading">
       <img width="24" height="24" src="./loading.gif">
       <p class="desc">{{title}}</p>
    </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:'加载中'
        }
    }
}
</script>


<style scoped>
.loading img{
    text-align: center;
    margin: 10px auto;
    display: block;
}
.desc{
    font-size: 14px;
    text-align: center;
}
</style>

