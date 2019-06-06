<template>
    <div  data-v-bd551172="" class="tab">
	<router-link to="/recommend" tab="div"  class="tab-item">
		<span  class="tab-link">推荐</span>
	</router-link>
	<router-link to="/singer" tab="div"  class="tab-item">
		<span  class="tab-link">歌手</span>
	</router-link>
	<router-link to="/rank" tab="div"  class="tab-item">
		<span  class="tab-link">排行
		</span>
	</router-link>
	<router-link to="/search" tab="div"  class="tab-item">
		<span  class="tab-link">搜索</span>
	</router-link>
</div>
</template>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>