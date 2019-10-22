<template>
    <div>
        <el-card>
            <div class="list" v-if="flag===0">
                <div class="btn">
                    <el-button
                        size="small"
                        plain
                        icon="el-icon-close"
                        @click="handleDelete()"
                        :disabled="multipleSelection.length<=0"
                        v-if="isAuth('startup:list:delete')"
                    >批量删除</el-button>
                    <el-button size="small" plain icon="el-icon-refresh" @click="getList">刷新</el-button>
                </div>
                <div class="table">
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="margin-top:20px"
                        border
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column
                            prop="id"
                            label="流程实例ID"
                            show-overflow-tooltip
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            prop="name"
                            label="流程名称"
                            show-overflow-tooltip
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            prop="applyer"
                            label="申请人"
                            show-overflow-tooltip
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            prop="key"
                            label="标识Key"
                            show-overflow-tooltip
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            prop="version"
                            label="版本"
                            show-overflow-tooltip
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            prop="currTaskName"
                            label="当前环节"
                            show-overflow-tooltip
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            prop="isSuspended"
                            label="状态"
                            show-overflow-tooltip
                            align="center"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.isSuspended==false" style="color:red">已挂起</span>
                                <span v-else style="color:green">已激活</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" align="center" width="340">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-button
                                        v-if="isAuth('startup:list:update')&&scope.row.isSuspended===false"
                                        type="primary"
                                        size="small"
                                        @click="updateHandle(scope.row.id,true)"
                                    >激活</el-button>
                                    <el-button
                                        v-if="isAuth('startup:list:update')&&scope.row.isSuspended===true"
                                        type="warning"
                                        size="small"
                                        @click="updateHandle(scope.row.id,false)"
                                    >挂起</el-button>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="seeDetails(scope.row)"
                                    >详情</el-button>
                                    <el-button size="mini" @click="seeHistory(scope.row)">审批历史</el-button>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.row.id)"
                                        v-if="isAuth('startup:list:delete')"
                                    >删除</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="page">
                    <el-pagination
                        @size-change="sizeChangeHandle"
                        @current-change="currentChangeHandle"
                        :current-page="pageIndex"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        :total="totalPage"
                        layout="total, sizes, prev, pager, next, jumper"
                    ></el-pagination>
                </div>
            </div>
            <div class="details" v-else-if="flag===1">
                <div class="clearfixs">
                    <span>查看请假申请详情</span>
                </div>
                <leave :rowData="rowData" :noAdd="noAdd" :btnFlag="btnFlag" @backList="backList" />
            </div>
            <div class="history" v-else-if="flag===2">
                <div class="clearfixs">
                    <span>流程审批进度历史</span>
                    <el-button size="small" @click="colseHistory" style="margin-right:20px;">返回</el-button>
                </div>
                <seeHistory :rowData="rowData" />
            </div>
        </el-card>
    </div>
</template>

<script>
import leave from "../apply/leave";
import seeHistory from "../apply/seeHistory";
export default {
    data() {
        return {
            multipleSelection: [],
            tableData: [],
            pageIndex: 1, //当前页
            pageSize: 10, //每页几条
            totalPage: 0, //总条数
            flag: 0,
            rowData: {},
            noAdd: false,
            btnFlag: false
        };
    },
    props: {},
    components: {
        /*组件*/
        leave,
        seeHistory
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
        this.getList();
    },
    methods: {
        //列表
        getList() {
            this.$http
                .get("/actProcess/getRunningProcess", {
                    params: {
                        pageNumber: this.pageIndex,
                        pageSize: this.pageSize
                    }
                })
                .then(res => {
                    if (res.data && res.data.code == 0) {
                        console.log(res);
                        this.tableData = res.data.data.content;
                        this.totalPage = res.data.data.totalElements;
                    }
                })
                .catch(res => {});
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getList();
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //详情
        seeDetails(row) {
            this.rowData = row;
            this.flag = 1;
            this.noAdd = true;
            this.btnFlag = true;
        },
        backList() {
            this.flag = 0;
            this.noAdd = false;
            this.btnFlag = false;
        },
        //历史
        seeHistory(row) {
            console.log(row);
            this.rowData = row;
            this.flag = 2;
        },
        colseHistory() {
            this.flag = 0;
        },
        updateHandle(id, state) {
            this.$http({
                url: "/actProcess/updateInsStatus?id=" + id + "&status=" + state,
                method: "post"
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.$message({
                        message: data.msg,
                        type: "success",
                        duration: 2000
                    });
                    this.getList();
                }
            });
        },
        //删除
        handleDelete(id) {
            let selectIds = this.multipleSelection
                .map(item => {
                    return item.id;
                })
                .join(",");
            let ids = id ? id : selectIds;
            this.$confirm("此操作将永久删除信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$http({
                    url: `/actProcess/delInsByIds/${ids}`,
                    method: "delete"
                })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.getList();
                        }
                    })
                    .catch(res => {});
            });
        }
    }
};
</script>

<style scoped >
</style>
