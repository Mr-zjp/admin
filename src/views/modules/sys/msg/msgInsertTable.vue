<template>
    <div>
        <el-form :inline="true" :model="formObj" class="demo-form-inline">
            <div class="msgFlex">
                <el-form-item label="用户名">
                    <el-input size="medium" v-model="formObj.title" placeholder="消息标题"></el-input>
                </el-form-item>
                <el-form-item label="所属机构">
<!--                    <el-cascader-->
<!--                            v-model="formObj.context"-->
<!--                            clearable-->
<!--                            :options="orgNoOptions"-->
<!--                            @change="handleChange"></el-cascader>-->
                    <el-cascader v-model="formObj.context" :options="orgNoOptions" clearable>
                        <template slot-scope="{ node, data }">
                            <span class="textCon">{{ data.orgName }}</span>
                        </template>
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" size="medium"type="primary">搜索</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
                :data="dataList"
                border
                style="width: 100%;">
            <el-table-column
                    prop="userName"
                    header-align="center"
                    align="center"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    prop="sex"
                    header-align="center"
                    align="center"
                    label="性别">
                <template slot-scope="scope">
                    <span>{{transDict('SEX',scope.row.sex)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="realName"
                    header-align="center"
                    align="center"
                    width="150"
                    label="真实姓名">
            </el-table-column>
            <el-table-column
                    prop="orgNo"
                    header-align="center"
                    align="center"
                    width="200"
                    label="所属机构">
                <template slot-scope="scope">
                    <span class="textCon">{{transOrg(scope.row.orgNo)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="email"
                    header-align="center"
                    align="center"
                    width="160"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    header-align="center"
                    align="center"
                    width="160"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="status"
                    header-align="center"
                    align="center"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
                    <el-tag v-else-if="scope.row.status === 1" size="small" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    header-align="center"
                    align="center"
                    width="150"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="selPro(scope.row)">添加到发送人员</el-button>
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
        <span>已选中：{{selProList.length}}人</span>
        <el-button type="text" @click="$emit('toChild')">清空所选人员</el-button>
    </div>
</template>

<script>
    export default {
        name: "",
        props:['selProList'],
        data(){
            return{
                formObj:{
                    orgNo:'',
                    userName:'',
                },
                loading:false,
                dataList:[],
                multipleSelection:[],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dialogObj:{
                    type:0,//0无状态 1新增2修改
                    isShow:false,//
                },
                content:'',
                orgNoOptions: this.treeDataTranslate(JSON.parse(sessionStorage.getItem('orgList') || '[]'), 'orgNo', 'parentNo'),
            }
        },
        mounted(){
          this.getDataList()
        },
        methods:{
            // 获取数据列表
            getDataList (orgNo) {
                this.$http({
                    url: '/sys/user/list',
                    method: 'get',
                    params: {
                        'page': this.pageIndex,
                        'limit': this.pageSize,
                        'userName': this.formObj.userName,
                        'orgNo':this.formObj.orgNo,
                    }
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataList = data.page.records
                        this.totalPage = data.page.total
                    } else {
                        this.dataList = []
                        this.totalPage = 0
                    }
                })
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
            handleChange(value){
                console.log(value)
            },
            selPro(row){
                let obj={
                    id:row.userId,
                    name:row.userName,
                };
                let isTrue=0;
                this.selProList.filter(item=>{
                    if(item.id ===obj.id){
                        isTrue++;
                    }
                })
                if(isTrue===0){
                    this.selProList.push(obj)
                    // this.$emit('toChild',obj);
                }else {
                    this.$message({
                        message:'人员不可重复添加',
                        type:'warning'
                    })
                }
                console.log(this.selProList)
            }
        }
    }
</script>

<style scoped>
    .msgFlex{
        display: flex;
    }
    .msgFlex>div{
        margin-left: 20px;
    }
    .textCon{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 120px;
    }
</style>