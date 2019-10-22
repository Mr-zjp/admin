<template>
    <div>
        <div v-if="flag==null">
            <div class="btn-row">
                <el-row>
                    <el-button
                        icon="el-icon-check"
                        @click="batchAdopt()"
                        :disabled="multipleSelection.length <= 0"
                        v-if="isAuth('apply:manage:batchAdopt')"
                    >批量通过</el-button>
                    <el-button
                        icon="el-icon-close"
                        :disabled="multipleSelection.length <= 0"
                        @click="batchReject()"
                        v-if="isAuth('apply:manage:batchReject')"
                    >批量驳回</el-button>
                    <el-button type="el-icon-refresh" icon="el-icon-refresh" @click="getList">刷新</el-button>
                </el-row>
            </div>
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
                <el-table-column prop="name" label="任务名称" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column
                    prop="processName"
                    label="所属流程"
                    show-overflow-tooltip
                    align="center"
                ></el-table-column>
                <el-table-column prop="owner" label="委托代办人" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="applyer" label="流程发起人" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="priority" label="优先级" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.priority==0">普通</span>
                        <span v-if="scope.row.priority==1" style="color:orange">重要</span>
                        <span v-if="scope.row.priority==2" style="color:red">紧急</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isSuspended" label="状态" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isSuspended==true" style="color:green">已激活</span>
                        <span v-if="scope.row.isSuspended==false" style="color:grey">已挂起</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    show-overflow-tooltip
                    align="center"
                ></el-table-column>
                <el-table-column label="操作" align="center" width="400" fixed="right">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="primary" size="mini" @click="seeDetails(scope.row)">详情</el-button>
                            <el-button
                                type="primary"
                                size="mini"
                                @click="adopt(scope.row)"
                                v-if="isAuth('apply:manage:adopt')"
                            >通过</el-button>
                            <el-button
                                type="warning"
                                size="mini"
                                @click="reject(scope.row)"
                                v-if="isAuth('apply:manage:reject')"
                            >驳回</el-button>
                            <el-button
                                size="mini"
                                @click="entrust(scope.row)"
                                v-if="isAuth('apply:manage:entrust')"
                            >委托</el-button>
                            <el-button size="mini" @click="seeHistory(scope.row)">审批历史</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
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
        <div v-else-if="flag==0">
            <div class="clearfixs">
                <span>查看请假申请详情</span>
            </div>
            <leave :rowData="rowData" :noAdd="noAdd" :btnFlag="btnFlag" @backList="backList" />
        </div>
        <div v-if="history">
            <div class="clearfixs">
                <span>流程审批进度历史</span>
                <el-button size="small" @click="colseHistory" style="margin-right:20px;">返回</el-button>
            </div>
            <seeHistory :rowData="rowData" />
        </div>
        <el-dialog :visible.sync="adoptDialog" width="30%" title="审核通过">
            <el-form :model="form" label-width="80px">
                <el-form-item label="审批意见">
                    <el-input type="textarea" v-model="form.comment" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="submitAdopt">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="委托他人代办" :visible.sync="entrustDialog" width="30%">
            <el-form :model="entrustForm" label-width="100px">
                <el-form-item label="审批意见">
                    <el-input type="textarea" v-model="entrustForm.comment" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="选择委托人">
                    <el-select v-model="entrustForm.userId" filterable placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="submitEntrust()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="审批驳回" :visible.sync="rejectDialog" width="40%">
            <reject :rowData="rowData" @colseDailog="colseDailog" v-if="rejectFlag" />
        </el-dialog>
    </div>
</template>

<script>
import leave from "../apply/leave";
import seeHistory from "../apply/seeHistory";
import reject from "./rejectForm";
export default {
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            pageIndex: 1, //当前页
            pageSize: 10, //每页几条
            totalPage: 0, //总条数
            adoptDialog: false,
            entrustDialog: false,
            rejectDialog: false,
            adoptData: {}, //通过按钮获取行信息,
            flag: null,
            form: {
                comment: "",
                assignees: [],
                id: "",
                priority: "",
                procInstId: ""
            },
            entrustForm: {
                comment: "",
                userId: "",
                id: "",
                procInstId: ""
            },

            rowData: {}, //一条完整的数据，详情，审批历史
            noAdd: false,
            btnFlag: false,
            history: false,
            options: [],
            rejectFlag: false
        };
    },
    props: {},
    components: {
        /*组件*/
        leave,
        seeHistory,
        reject
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
        this.getList(); //主页列表
        this.getUserList(); //用户信息
    },
    methods: {
        getList() {
            this.$http({
                url: "/actTask/todoList",
                method: "get",
                params: {
                    pageNumber: this.pageIndex,
                    pageSize: this.pageSize
                }
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.tableData = data.data.content;
                    this.totalPage = data.data.totalElements;
                }
            });
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
        //批量通过
        batchAdopt() {
            let ids = this.multipleSelection
                .map(item => {
                    return item.id;
                })
                .join(",");
            this.$confirm(
                "您确认要通过所选的数据? 注意：将默认分配给节点设定的所有可审批用户",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).then(() => {
                this.$http({
                    url: `/actTask/passAll/${ids}`,
                    method: "post"
                })
                    .then(res => {
                        if (res.data && res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                        }
                        this.getList();
                    })
                    .catch();
            });
        },
        //批量驳回
        batchReject() {
            let seletIds = this.multipleSelection
                .map(item => {
                    return item.procInstId;
                })
                .join(",");
            this.$confirm("此操作将驳回申请, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$http({
                    url: `/actTask/backAll/${seletIds}`,
                    method: "post"
                })
                    .then(res => {
                        if (res.data && res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.getList();
                        }
                    })
                    .catch();
            });
        },
        //返回列表页面
        backList() {
            this.flag = null;
        },
        //关闭历史页面
        colseHistory() {
            this.history = false;
            this.flag = null;
        },
        //所有的弹框关闭
        cancel() {
            this.adoptDialog = false;
            this.entrustDialog = false;
            this.form = {};
            this.entrustForm = {};
        },
        //单个通过
        adopt(row) {
            console.log(row);
            this.adoptDialog = true;
            this.adoptData = row;
        },
        submitAdopt() {
            this.form.id = this.adoptData.id;
            this.form.priority = this.adoptData.priority;
            this.form.procInstId = this.adoptData.procInstId;
            if (this.adoptData.assignees != null) {
                this.form.assignees = this.adoptData.assignees;
            } else {
                this.form.assignees = [];
            }

            this.$http
                .post(
                    "/actTask/pass?id=" +
                        this.form.id +
                        "&priority=" +
                        this.form.priority +
                        "&procInstId=" +
                        this.form.procInstId +
                        "&assignees=" +
                        this.form.assignees +
                        "&comment=" +
                        this.form.comment
                )
                .then(res => {
                    if (res.data && res.data.code == 0) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.adoptDialog = false;
                        this.getList();
                        this.form = {};
                    }
                })
                .catch(res => {});
        },
        //单个驳回
        reject(row) {
            console.log(row);
            this.rowData = row;
            this.rejectDialog = true;
            this.rejectFlag = true;
        },
        colseDailog() {
            this.rejectDialog = false;
            this.rejectFlag = false;
            this.getList();
        },
        //查看详情
        seeDetails(row) {
            this.flag = 0;
            this.rowData = row;
            this.noAdd = true;
            this.btnFlag = true;
        },
        //查看历史
        seeHistory(row) {
            this.rowData = row;
            this.history = true;
            this.flag = "ss";
        },
        //查询用户
        getUserList() {
            this.$http({
                url: "/sys/user/list",
                method: "get"
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.options = data.page.records;
                } else {
                    this.options = [];
                }
            });
        },
        //委托
        entrust(row) {
            this.rowData = row;
            this.entrustDialog = true;
        },
        //委托提交
        submitEntrust() {
            this.entrustForm.id = this.rowData.id;
            this.entrustForm.procInstId = this.rowData.procInstId;
            this.$http
                .post(
                    "/actTask/delegate?id=" +
                        this.entrustForm.id +
                        "&procInstId=" +
                        this.entrustForm.procInstId +
                        "&comment=" +
                        this.entrustForm.comment +
                        "&userId=" +
                        this.entrustForm.userId
                )
                .then(res => {
                    if (res.data && res.data.code == 0) {
                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });
                        this.entrustForm = {};
                        this.entrustDialog = false;
                        this.getList();
                    }
                })
                .catch(res => {});
        }
    }
};
</script>

<style scoped >
.el-dialog__header {
    padding: 20px 20px 10px;
}
</style>
