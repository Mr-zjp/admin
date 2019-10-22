<template>
    <div>
        <div class="zijin font-color">
            <el-button  @click.prevent="addRows()" type="primary" size="small" >添加</el-button>
        </div>
        <el-table :data="gaisuanModelList" border style="width: 100%;margin-top:10px;">
            <el-table-column prop="date" label="序号"  align="center">
                <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.sequence"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="工程项目或费用名称"  align="center">
                <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.name"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="概算金额" align="center">
                <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.gaisuanAmount"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        type="danger"
                        size="mini"
                        @click="handleDeletes(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            gaisuanModelList:this.$store.state.formObject.gaisuanModelList,
        };
    },
    props: {},
    components: {
        /*组件*/
    },
    watch: {
        /*监听*/
    },
    computed: {
        /*计算属性*/
    },
    filters: {
        /*过滤器*/
    },
    created() {},
    mounted() {
        
    },
    methods: {
        addRows() {
            let list = {
              gaisuanAmount:this.gaisuanAmount,
              name : this.name,
              sequence :this.sequence,
            };
            this.gaisuanModelList.push(list);
        },
        //工程投资明细，表格行删除
        handleDelete(index, row) {
            this.gaisuanModelList.splice(index, 1);
        },
    }
};
</script>

<style scoped >
.zijin{
    margin-left:10px;
}
</style>
