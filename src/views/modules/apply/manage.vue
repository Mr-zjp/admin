<template>
    <div>
        <el-card>
            <div v-if="key==null">
                <div class="btn-row">
                    <el-row>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            @click="ChangeProcess=true"
                            v-if="isAuth('apply:manage:save')"
                        >新增</el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete-solid"
                            :disabled="multipleSelection.length <= 0"
                            @click="deleteHandle()"
                            v-if="isAuth('apply:manage:delete')"
                        >批量删除</el-button>
                        <el-button
                            type="el-icon-refresh"
                            icon="el-icon-refresh"
                            @click="getDataList"
                        >刷新</el-button>
                    </el-row>
                </div>
                <div class="table-row">
                    <el-table
                        :data="tableData"
                        border
                        style="width: 100%;margin-top:10px;"
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="title"
                            label="标题"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="processName"
                            label="所属流程"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="currTaskName"
                            label="当前审批环节"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="status" label="状态" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status===0">草稿</span>
                                <span v-if="scope.row.status===1" style="color:#f47920">处理中</span>
                                <span v-if="scope.row.status===2" style="color:#009ad6">已结束</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="result" label="结果" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.result===0">未提交</span>
                                <span v-if="scope.row.result===1" style="color:#f47920">处理中</span>
                                <span v-if="scope.row.result===2" style="color:green">通过</span>
                                <span v-if="scope.row.result===3" style="color:red">驳回</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="创建时间"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="applyTime"
                            label="提交时间"
                            align="center"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column fixed="right" label="操作" align="center" width="300">
                            <template slot-scope="scope">
                                <div>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        @click="subApply(scope.row)"
                                        v-if="scope.row.status===0 && scope.row.result===0"
                                    >提交申请</el-button>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        @click="subApply(scope.row)"
                                        v-if="scope.row.result===3"
                                    >重新申请</el-button>
                                    <el-button
                                        size="small"
                                        v-if="((scope.row.status===0 && scope.row.result===0)|| scope.row.result===3)&& isAuth('apply:manage:update')"
                                        @click="editApply(scope.row)"
                                    >编辑</el-button>
                                    <el-button
                                        type="danger"
                                        size="small"
                                        v-if="(scope.row.status===0 && scope.row.result===0)&& isAuth('apply:manage:delete')"
                                        @click="deleteHandle(scope.row.id)"
                                    >删除</el-button>
                                    <el-button
                                        size="small"
                                        v-if="(scope.row.status===1 && scope.row.result===1)||(scope.row.status===2 && scope.row.result===2)"
                                        @click="seeDetails(scope.row)"
                                    >表单数据</el-button>
                                    <el-button
                                        type="success"
                                        plain
                                        size="small"
                                        @click="seeHistory(scope.row)"
                                        v-if="(scope.row.status===1 && scope.row.result===1) ||(scope.row.status===2 && scope.row.result===2)"
                                    >审批历史</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-row">
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
            <div v-else-if="key=='declare'">
                <div class="clearfixs">
                    <span>项目申报流程</span>
                    <el-button size="small" @click="colseHistory" style="margin-right:20px;">返回</el-button>
                </div>
            </div>
            <div v-else-if="key=='leave'">
                <div class="clearfixs">
                    <span v-if="addTitle">新增请假申请</span>
                    <span v-if="editTitle">编辑请假申请</span>
                    <span v-if="seeTitle">查看请假申请详情</span>
                </div>
                <leave
                    @backList="updataKey"
                    :procDefId="procDefId"
                    :rowData="rowData"
                    :noAdd="noAdd"
                    :seeTitle="seeTitle"
                />
            </div>
            <div v-if="history">
                <div class="clearfixs">
                    <span>流程审批进度历史</span>
                    <el-button size="small" @click="colseHistory" style="margin-right:20px;">返回</el-button>
                </div>
                <seeHistory :rowData="rowData" />
            </div>
        </el-card>
        <el-drawer title="选择流程" :visible.sync="ChangeProcess" direction="rtl" size="50%">
            <div class="population">
                <el-card
                    shadow="hover"
                    v-for="(item,index) in processName"
                    :key="index"
                    class="card-css"
                    @click.native="handleCard(item.key,item.id)"
                >
                    <div class="div1">
                        <span>{{index+1}}.{{item.name}}</span>
                    </div>
                    <div class="div2">
                        <span>版本：{{item.version}}&nbsp;&nbsp;描述：{{item.description}}</span>
                    </div>
                </el-card>
            </div>
        </el-drawer>
        <el-dialog title="提交申请" :visible.sync="applicationSubmission" width="30%">
            <applyForm :rowData="rowData" v-if="flag" @cancel="updataKey" />
        </el-dialog>
    </div>
</template>

<script>
import leave from "./leave"; //请假表单
import applyForm from "./subApplyForm"; //提交申请表单
import seeHistory from "./seeHistory"; //审批历史页面
export default {
    data() {
        return {
            tableData: [], //表格数据
            multipleSelection: [], //选中的表格数据
            pageIndex: 1, //当前页
            pageSize: 10, //每页几条
            totalPage: 0, //总条数
            ChangeProcess: false, //流程选择
            processName: [], //流程信息
            key: null,
            procDefId: "",
            applicationSubmission: false, //提交申请弹窗
            rowData: {},
            flag: false,
            noAdd: true,
            addTitle: false,
            editTitle: false,
            seeTitle: false,
            history: false
        };
    },
    props: {},
    components: {
        /*组件*/
        leave,
        applyForm,
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
        this.getDataList();
        this.getName();
    },
    activated() {},
    methods: {
        //表格的多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //控制组件
        updataKey() {
            this.key = null;
            this.flag = false;
            this.applicationSubmission = false;
            this.addTitle = false;
            this.editTitle = false;
            this.seeTitle = false;
            this.getDataList();
        },
        //获取流程信息
        getName() {
            this.$http({
                url: "/act/reprocdef/list",
                method: "get"
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.processName = data.page.records;
                }
            });
        },
        //初始化申请列表
        getDataList() {
            let userId = this.$store.state.user.id;
            console.log("userId", userId);
            this.$http({
                url: "/actBusiness/getByCondition",
                method: "get",
                params: {
                    page: this.pageIndex,
                    limit: this.pageSize,
                    userId: userId
                }
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.tableData = data.data.records;
                    this.totalPage = data.data.total;
                } else {
                    this.tableData = [];
                    this.totalPage = 0;
                }
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        //删除
        deleteHandle(id) {
            let selectId = this.multipleSelection
                .map(item => {
                    return item.id;
                })
                .join(",");
            debugger;
            let ids = id ? id : selectId;
            this.$confirm("此操作将永久删除信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$http({
                    url: `/actBusiness/delByIds/${ids}`,
                    method: "delete"
                })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.getDataList();
                        }
                    })
                    .catch(res => {});
            });
        },
        //选择流程
        handleCard(key, id) {
            this.ChangeProcess = false;
            this.key = key;
            this.noAdd = false;
            this.addTitle = true;
            this.procDefId = id;
        },
        editApply(row) {
            this.editTitle = true;
            this.noAdd = true;
            this.rowData = row;
            this.key = row.procDefId.split(":")[0];
        },
        seeDetails(row) {
            this.seeTitle = true;
            this.noAdd = true;
            this.rowData = row;
            this.key = row.procDefId.split(":")[0];
        },
        subApply(row) {
            this.applicationSubmission = true;
            this.flag = true;
            this.rowData = row;
        },
        seeHistory(row) {
            console.log(row);
            this.history = true;
            this.rowData = row;
            this.key = 0;
        },
        colseHistory() {
            this.history = false;
            this.key = null;
        }
    }
};
</script>

<style scoped >
.population {
    display: -webkit-flex;
    margin-left: 40px;
    display: flex;
    flex-wrap: wrap;
}
.card-css {
    height: 150px;
    width: 45%;
    margin-top: 20px;
    margin-right: 20px;
    cursor: pointer;
}
.div1 {
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
}
.card-css :hover .div1 {
    color: #1890ff;
}
.div2 {
    margin-top: 80px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
}
</style>
