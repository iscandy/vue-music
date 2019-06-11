<template>
    <listview></listview>
</template>

<script>
import listview from 'components/base/listview/listview'
import {getsingerList} from 'api/singer.js'
export default {
    components:{
        listview
    },
    created(){
        this._getsingerList()  
    },
    methods:{
         _getsingerList(){
            this.getsingerList();
        }
    }
}
</script>

