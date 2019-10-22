<template>
    <div>
        <template v-if="contentIsShow">
            <el-page-header @back="reLoad" content="详情页面"></el-page-header>
            <msgContent :rowCon="rowCon" @reLoad="reLoad"></msgContent>
        </template>
        <template v-if="!contentIsShow">
            <div class="tableDiv">
                <el-table
                        :data="currentIndex"
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="title">
                    </el-table-column>
                    <el-table-column
                            width="200"
                            prop="createTime">
                    </el-table-column>
                    <el-table-column
                            width="300"
                            prop="createTime">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="operFun(0,scope.row)">查看</el-button>
                            <el-button v-if="tabsType==='recycle'" size="mini" @click="operFun(1,scope.row)">还原</el-button>
                            <el-button v-if="tabsType!=='recycle'" type="danger" size="mini" @click="operFun(2,scope.row)">删除</el-button>
                            <el-button v-if="tabsType==='recycle'" type="danger" size="mini" @click="operFun(3,scope.row)">彻底删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </template>
    </div>
</template>

<script>
    import msgContent from './msgContent'

    export default {
        name: "",
        props:['msgList','tabsType'],
        components:{
            msgContent
        },
        data(){
            return{
                pageIndex: 1,//当前页
                pageSize: 10,//每页多少条
                totalPage: 0,//总数量
                contentIsShow:false,
                rowCon:{},
            }
        },
        computed:{
            currentIndex() {
                this.totalPage=this.msgList.length;
                // 计算当前页的数据
                return this.msgList.filter((item, index) => {
                    return (
                        Math.floor(index / this.pageSize) ===
                        this.pageIndex - 1
                    );
                });
            },
            msgNum: {
                get () {
                    return this.$store.state.user.msgNum
                },
                set (val) {
                    this.$store.commit('user/updateMsgNum', val)
                }
            },
        },
        mounted(){

        },
        methods:{
            // 每页数
            sizeChangeHandle (val) {
                this.pageSize = val
                this.pageIndex = 1
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
            },
            reLoad(){
                this.contentIsShow=false;
            },
            operFun(type,row){
                this.rowCon={}
                let url='/messageSend/update',
                    obj={
                        id:row.id,
                    };
                if(type==3 || type==2){
                    if(type==2){//删除
                        obj.status=2;
                    }
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        url='/messageSend/delete/'+row.id;
                        obj=null;
                        this.$http({
                            url:url,
                            method: 'post',
                            data: obj
                        }).then(({data}) => {
                            if (data && data.code === 0) {
                                this.$emit('reLoad')
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                    return;
                }
                if(type==0){//查看
                    this.contentIsShow=true;
                    this.rowCon=row;
                    if(this.tabsType!='unread'){
                        return;
                    }
                    obj.status=1;
                }else if(type==1){//还原
                    obj.status=1;
                }
                this.$http({
                    url:url,
                    method: 'post',
                    data: obj
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.$emit('reLoad')
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .tableDiv{
        height: 740px;
        overflow-y: auto;
    }
</style>