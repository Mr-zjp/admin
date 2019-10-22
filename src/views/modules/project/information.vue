<template>
    <div>
        <el-card>
            <div v-if="flag">
                <div style="margin-top:10px;">
                    <el-row>
                        <el-button type="primary" class="btn-focus" @click="add()">添加</el-button>
                        <el-button type="primary" class="btn-focus" @click="edit()">编辑</el-button>
                        <el-button type="danger"  class="btn-focus" @click="deleteRows()">删除</el-button>
                        <el-button type="primary" class="btn-focus" @click="submitProject()">提交项目</el-button>
                        <el-button type="primary" class="btn-focus" @click="throughProject()">通过项目</el-button>
                        <el-button type="warning" class="btn-focus" @click="closeProject()">关闭项目</el-button>
                        <el-button type="warning" class="btn-focus" @click="rejectProject()">驳回项目</el-button>
                        <el-button type="primary" class="btn-focus" @click="_initList()">刷新</el-button>
                    </el-row>
                </div>
                <div>
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        :default-sort="{prop: 'date', order: 'descending'}"
                        stripe
                        style="width:100%;margin-top:10px"
                        @selection-change="handleSelectionChange"
                        border
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="status" label="当前状态" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status==1">审核中</span>
                                <span v-if="scope.row.status==2" style="color:green">实施中</span>
                                <span v-if="scope.row.status==3" style="color:red">驳回</span>
                                <span v-if="scope.row.status==4" style="color:#999d9c">已关闭</span>
                                <span v-if="scope.row.status==0">草稿</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="工程编号" align="center"></el-table-column>
                        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
                        <el-table-column prop="address" label="工程地点" align="center"></el-table-column>
                        <el-table-column prop="type" label="工程类型" align="center"></el-table-column>
                        <el-table-column prop="startTime" label="开工日期" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.startTime|formatterDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="endTime" label="竣工日期" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.endTime|formatterDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="replyCode" label="批复文号" align="center"></el-table-column>
                        <el-table-column prop="replyGaisuan" label="批复概算" align="center"></el-table-column>
                        <el-table-column prop="totalInvestment" label="总投资" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-else>
                <projectTabs @goBack="tableHome" @update="changeMyData" :operate="operate" />
            </div>
        </el-card>
    </div>
</template>

<script>
import projectTabs from "./projectTabs";
var addZero = function(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
};
export default {
    data() {
        return {
            tableData: [],
            flag: true,
            operate: {},
            multipleSelection: []
        };
    },
    props: {},
    components: {
        /*组件*/
        projectTabs
    },
    watch: {
        /*监听*/
    },
    computed: {
        /*计算属性*/
    },
    filters: {
        /*过滤器*/
        formatterDate(date) {
            if (date != null) {
                const dateMat = new Date(date * 1000);
                const year = dateMat.getFullYear();
                const month = dateMat.getMonth() + 1;
                const day = dateMat.getDate();
                const timeFormat =
                    year + "-" + addZero(month) + "-" + addZero(day);
                return timeFormat;
            }
            return "";
        }
    },
    created() {},
    mounted() {
        this._initList();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //新增
        add() {
            this.flag = false;
        },
        goback() {
            this.flag = false;
        },
        //编辑
        edit() {
            if (this.multipleSelection.length !== 1) {
                this.$message.info({
                    message: "请选择一条数据",
                    type: "warning"
                });
                return;
            }
            this.operate = this.multipleSelection[0];
            this.flag = false;
        },
        tableHome() {
            this.flag = true;
            this.operate = {};
            this.multipleSelection=[];
        },
        changeMyData() {
            this.flag = true;
            this._initList();
        },
        //驳回项目
        rejectProject() {
            let params = [];
            this.multipleSelection.filter((item, index) => {
                params.push(item.id);
            });
            let id = params.join();
            this.$http
                .get(this.$api.rejectProject + "?id=" + id)
                .then(res => {
                    if (res.data.success) {
                        this.$message.success({
                            message: res.data.msg
                        });
                        this._initList();
                    }
                })
                .catch(res => {
                    this.$message.error({
                        message: res.msg || res.message
                    });
                });
        },
        //项目通过
        throughProject() {
            let params = [];
            this.multipleSelection.filter((item, index) => {
                params.push(item.id);
            });
            let id = params.join();
            this.$http
                .get(this.$api.throughProject + "?id=" + id)
                .then(res => {
                    if (res.data.success) {
                        this.$message.success({
                            message: res.data.msg
                        });
                        this._initList();
                    }
                })
                .catch(res => {
                    this.$message.error({
                        message: res.msg || res.message
                    });
                });
        },
        //关闭项目
        closeProject() {
            let params = [];
            this.multipleSelection.filter((item, index) => {
                params.push(item.id);
            });
            let id = params.join();
            this.$http
                .get(this.$api.cosleProject + "?id=" + id)
                .then(res => {
                    if (res.data.success) {
                        this.$message.success({
                            message: res.data.msg
                        });
                        this._initList();
                    }
                })
                .catch(res => {
                    this.$message.error({
                        message: res.msg || res.message
                    });
                });
        },
        //提交项目
        submitProject() {
            let params = [];
            this.multipleSelection.filter((item, index) => {
                params.push(item.id);
            });
            let id = params.join();
            this.$http
                .get(this.$api.submitStatus + "?id=" + id)
                .then(res => {
                    if (res.data.success) {
                        this.$message.success({
                            message: res.data.msg
                        });
                        this._initList();
                    }
                })
                .catch(res => {
                    this.$message.error({
                        message: res.msg || res.message
                    });
                });
        },
        //列表查询
        _initList() {
            this.$http
                .get(this.$api.getEnfineeringList)
                .then(res => {
                    if (res.data.success) {
                        this.tableData = res.data.data;
                    }
                })
                .catch(res => {});
        },
        startTimes(row, column) {
            if (row.startTime != null) {
                return _$.timestamp_format(row.startTime);
            }
        },
        endTimes(row, column) {
            if (row.endTime != null) {
                return _$.timestamp_format(row.endTime);
            }
        },
        deleteRows() {
            if (this.multipleSelection.length <= 0) {
                this.$message.info({
                    message: "请选择一条数据",
                    type: "warning"
                });
                return;
            } else {
                this.$confirm("此操作将永久删除信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    //删除
                    this.loading = true;
                    let params = [];
                    this.multipleSelection.filter((item, index) => {
                        params.push(item.id);
                    });
                    this.$http
                        .post(this.$api.delEngineering, params)
                        .then(res => {
                            if (res.data.success) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this._initList();
                            } else {
                                this.$message.error({
                                    message: res.data.msg
                                });
                            }
                        })
                        .catch(res => {
                            this.$message.error({
                                message: res.msg || res.message
                            });
                        });
                    this.loading = false;
                });
            }
        }
    }
};
</script>

<style scoped >
</style>
