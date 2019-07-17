<template>
     <div class="search-list">
        <ul>
            <li class="search-item" v-for="(item,index) in searches" :key="index"  @click="addquery(item)">
                <span class="text">{{item}}</span>
                <span class="icon"><i class="icon-delete" @click.stop="selectItem(item)"></i></span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:{
        searches:{
            type:Array,
            default:[]
        }
    },
    methods:{
        selectItem(item){
            this.$emit('delectOne',item)
        },
        addquery(item){
            this.$emit('addquery',item);
        }
    }
}
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
