<template>
    <div>
        <el-form :model="rejectForm" label-width="140px">
            <el-form-item label="审批意见">
                <el-input type="textarea" v-model="rejectForm.comment" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="驳回至" v-if="node.length>0">
                <el-select v-model="rejectForm.reject" placeholder="请选择" @change="handleChange">
                    <el-option
                        v-for="(item,index) in reject"
                        :key="index"
                        :label="item.name"
                        :value="item.key"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="驳回至" v-else>
                <el-select v-model="rejectForm.region">
                    <el-option label="发起人" value="发起人"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="指定原节点审批人" v-if="flag">
                <el-select v-model="rejectForm.assignees" multiple style="width:300px;">
                    <el-option
                        v-for="(item,index) in nodeUser"
                        :key="index"
                        :label="item.userName"
                        :value="item.userId"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div align="center">
            <el-button type="primary" @click="submitReject()">确 定</el-button>
            <el-button @click="cancel()">取 消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rejectForm: {
                region: "",
                reject: "",
                comment: "",
                id: "",
                procInstId: "",
                assignees: [],
                backTaskKey: "",
                priority: 0,
                procDefId: ""
            },
            reject: [{ id: "010101a", name: "发起人", key: "x010101a" }],
            node: [],
            nodeUser: [],
            flag: false,
            nodeId: ""
        };
    },
    props: { rowData: Object },
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
        this.getNode();
    },
    methods: {
        getNode() {
            this.$http({
                url: "/actTask/getBackList",
                method: "get",
                params: { procInstId: this.rowData.procInstId }
            })
                .then(res => {
                    console.log("getNode", res);
                    this.node = res.data.data;
                    this.node.forEach(item => {
                        this.reject.push(item);
                    });
                })
                .catch(res => {});
        },
        handleChange(key) {
            this.rejectForm.assignees=[];
            this.rejectForm.backTaskKey=key;
            if (key != "x010101a") {
                this.flag = true;
                this.$http({
                    url: `/actProcess/getNode/${key}`,
                    method: "get"
                })
                    .then(result => {
                        this.nodeUser = result.data.data.users;
                        this.nodeUser.forEach(item => {
                            this.rejectForm.assignees.push(item.userId);
                        });
                    })
                    .catch(err => {});
            } else {
                this.flag = false;
            }
        },
        cancel() {
            this.$emit("colseDailog");
        },
        submitReject() {
            if (!this.flag) {
                console.log("返回至发起人");
                this.rejectForm.id = this.rowData.id;
                this.rejectForm.procInstId = this.rowData.procInstId;
                let initiator = {
                    procInstId: this.rejectForm.procInstId,
                    id: this.rejectForm.id,
                    comment: this.rejectForm.comment
                };
                this.$http
                    .post(
                        "/actTask/back?id=" +
                            initiator.id +
                            "&procInstId=" +
                            initiator.procInstId +
                            "&comment=" +
                            initiator.comment
                    )
                    .then(res => {
                        if (res.data && res.data.code == 0) {
                            this.$message({
                                message: res.data.code,
                                type: "success"
                            });
                            this.cancel();
                        }
                    })
                    .catch(res => {});
            } else {
                console.log("返回审批人");
                this.rejectForm.id=this.rowData.id
                this.rejectForm.priority=this.rowData.priority
                this.rejectForm.procDefId=this.rowData.procDefId
                this.rejectForm.procInstId=this.rowData.procInstId
                let node = {
                    backTaskKey: this.rejectForm.backTaskKey,
                    id: this.rejectForm.id,
                    priority: this.rejectForm.priority,
                    procDefId: this.rejectForm.procDefId,
                    procInstId: this.rejectForm.procInstId,
                    comment: this.rejectForm.comment,
                    assignees: this.rejectForm.assignees
                };
                this.$http
                    .post(
                        "/actTask/backToTask?id=" +
                            node.id +
                            "&backTaskKey=" +
                            node.backTaskKey +
                            "&priority=" +
                            node.priority +
                            "&procDefId=" +
                            node.procDefId +
                            "&procInstId=" +
                            node.procInstId +
                            "&comment=" +
                            node.comment +
                            "&assignees=" +
                            node.assignees
                    )
                    .then(res => {
                        if (res.data && res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                            this.cancel();
                        }
                    })
                    .catch(res => {});
            }
        }
    }
};
</script>

<style scoped >
</style>
