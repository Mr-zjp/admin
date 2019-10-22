<template>
    <el-card class="box-card">
        <!--msgListView-->
        <div v-if="!dialogObj.isShow">
            <el-form :inline="true" :model="formObj" class="demo-form-inline">
                <div class="msgFlex">
                    <el-form-item label="消息标题">
                        <el-input size="medium" v-model="formObj.title" placeholder="消息标题"></el-input>
                    </el-form-item>
                    <el-form-item label="消息内容">
                        <el-input size="medium" v-model="formObj.content" placeholder="消息内容"></el-input>
                    </el-form-item>
                    <el-form-item label="消息类型">
                        <el-select size="medium" v-model="formObj.type" clearable placeholder="消息类型">
                            <el-option label="系统公告" value="0"></el-option>
                            <el-option label="提醒" value="1"></el-option>
                            <el-option label="私信" value="2"></el-option>
                            <el-option label="工作流" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                                size="medium"
                                v-model="formObj.time"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" size="medium" @click="operBut(4)" type="primary">搜索</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <div class="marBom">
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="operBut(1)">发送新消息</el-button>
                <el-button :disabled="multipleSelection.length===0" size="medium" type="danger" icon="el-icon-delete" @click="operBut(3)">删除撤回</el-button>
            </div>
            <el-table
                    :data="dataList"
                    border
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="title"
                        show-overflow-tooltip
                        label="消息标题">
                </el-table-column>
                <el-table-column
                        prop="content"
                        show-overflow-tooltip
                        label="消息内容">
                </el-table-column>
                <el-table-column
                        width="140px"
                        label="消息类型">
                    <template slot-scope="scope">
                        {{scope.row.type|filterType}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="140px"
                        label="新创建账号推送">
                    <template slot-scope="scope">
                        {{scope.row.createSend}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="200px"
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="operBut(0,scope.row)">查看</el-button>
                        <el-button size="small" @click="operBut(2,scope.row)">撤销信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!--msgInsertView-->
        <div v-else>
            <el-page-header @back="reLoad" :content="dialogObj.type===1?'发送消息':'编辑消息'"></el-page-header>
            <insertForm :rowCon="rowCon" @reLoad="reLoad"></insertForm>
        </div>
    </el-card>
</template>

<script>
    import insertForm from './msg/msgInsert'
    export default {
        name: "",
        components:{
            insertForm,
        },
        filters:{
          filterType(val){
              if(val==0){
                  return '系统公告'
              }else if(val==1){
                  return '提醒'
              }else if(val==2){
                  return '私信'
              }else if(val==3){
                  return '工作流'
              }else {
                  return val;
              }

          }
        },
        data(){
            return{
                formObj:{
                    title:'',
                    time:[],
                    content:'',
                    type:'',
                    startDate:'',
                    endDate:'',
                },
                loading:false,
                dataList:[],
                multipleSelection:[],
                currentPage:0,
                dialogObj:{
                    type:0,//0无状态 1新增2修改
                    isShow:false,//
                },
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                rowCon:{},
            }
        },
        mounted(){
            this.getDataList();
        },
        methods:{
            getDataList (content,title,type,startDate,endDate) {
                this.$http({
                    url: '/message/getByCondition',
                    method: 'get',
                    params: {
                        page: this.pageIndex,
                        limit: this.pageSize,
                        content:content==''?null:content,
                        title: title==''?null:title,
                        type:type==''?null:type,
                        startDate:startDate==''?null:startDate,
                        endDate:endDate==''?null:endDate,
                    }
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataList = data.data.records
                        this.totalPage = data.data.total
                    } else {
                        this.dataList = []
                        this.totalPage = 0
                    }
                    console.log(data)
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 每页数
            sizeChangeHandle (val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
                this.getDataList()
            },
            operBut(type,row){
                this.rowCon={};
                if(type===0){//查看
                    console.log(row)

                    this.rowCon=row;
                    this.dialogObj.isShow=true;
                }else if(type===1){//新增
                    this.dialogObj.isShow=true;
                    this.dialogObj.type=1;
                }
                else if(type===2){//撤销删除
                    console.log(row)
                    if(row.type==3){
                        this.$message({
                            type: 'warning',
                            message: '工作流消息不允许删除！'
                        });
                        return;
                    }
                    this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let list=[row.id];
                        this.$http({
                            url: '/message/delByIds/'+list,
                            method: 'delete',
                        }).then(({data}) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success',
                                })
                                this.getDataList();
                            }
                            console.log(data)
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }
                else if(type===3){//删除
                    let list=[];
                    this.multipleSelection.filter(item=>{
                        list.push(item.id);
                        return item;
                    })
                    this.$http({
                        url: '/message/delByIds/'+list,
                        method: 'delete',
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: data.msg,
                                type: 'success',
                            })
                            this.getDataList();
                        }
                        console.log(data)
                    })
                }
                else if(type==4){//搜索
                    console.log(this.formObj)
                    if(this.formObj.time && this.formObj.time.length!==0){
                        this.formObj.startDate=this.formObj.time[0]
                        this.formObj.endDate=this.formObj.time[1]
                    }
                    this.getDataList(this.formObj.content,this.formObj.title,this.formObj.type,this.formObj.startDate,this.formObj.endDate)
                }

            },
            reLoad(){
                this.dialogObj.isShow=false;
                this.dialogObj.type=0;
                this.getDataList();
            },

        },
    }
</script>

<style scoped>
    .msgFlex{
        display: flex;
    }
    .msgFlex>div{
        margin-left: 20px;
    }
    .marBom{
        margin-bottom: 10px;
    }
</style>