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
                        v-if="isAuth('done:list:delete')"
                    >批量删除</el-button>
                    <el-button size="small" plain icon="el-icon-refresh" @click="getList">刷新</el-button>
                </div>
                <div class="table">
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%;margin-top:20px"
                        border
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column
                            prop="name"
                            label="任务名称"
                            show-overflow-tooltip
                            align="center"
                             width="120"
                        ></el-table-column>
                        <el-table-column
                            prop="processName"
                            label="所属流程"
                            show-overflow-tooltip
                            align="center"
                             width="120"
                        ></el-table-column>
                        <el-table-column
                            prop="owner"
                            label="委托代办人"
                            show-overflow-tooltip
                            align="center"
                             width="120"
                        ></el-table-column>
                        <el-table-column
                            prop="applyer"
                            label="流程发起人"
                            show-overflow-tooltip
                            align="center"
                             width="120"
                        ></el-table-column>
                        <el-table-column
                            prop="priority"
                            label="优先级"
                            show-overflow-tooltip
                            align="center"
                             width="120"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.priority==0">普通</span>
                                <span v-if="scope.row.priority==1" style="color:orange">重要</span>
                                <span v-if="scope.row.priority==2" style="color:red">紧急</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="deleteReason"
                            label="审批操作"
                            show-overflow-tooltip
                            align="center"
                             width="120"
                        ></el-table-column>
                        <el-table-column
                            prop="comment"
                            label="审批意见"
                            show-overflow-tooltip
                            align="center"
                             width="120"
                        ></el-table-column>
                        <el-table-column
                            prop="duration"
                            label="耗时"
                            show-overflow-tooltip
                            align="center"
                        >
                            <template slot-scope="scope">
                                <span>{{(scope.row.duration/1000/3600).toFixed(2)}}小时</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="创建时间"
                            show-overflow-tooltip
                            align="center"
                        ></el-table-column>
                        <el-table-column label="操作" align="center" fixed="right" width="250">
                            <template slot-scope="scope">
                                <div>
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
                                        v-if="isAuth('done:list:delete')"
                                    >删除</el-button>
                                </div>
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
                .get("/actTask/doneList", {
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
            this.rowData = row;
            this.flag = 2;
        },
        colseHistory() {
            this.flag = 0;
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
                    url: `/actTask/deleteHistoric/${ids}`,
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
