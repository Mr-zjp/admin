<template>
    <div>
        <div class="from-region">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="审批人">
                    <el-select v-model="form.assignees" multiple style="width:300px;">
                        <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.userName"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优先级">
                    <el-select v-model="form.priority" placeholder="请选择优先级" style="width:300px;">
                        <el-option
                            v-for="(item,index) in level"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="btn-region">
            <div class="btn" align="right">
                <el-button @click="backList">取 消</el-button>
                <el-button type="primary" @click="submit">提 交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                assignees: [],
                priority: 0,
                procDefId: "",
                id: "",
                title: ""
            },
            options: [],
            level: ["普通", "重要", "紧急"],
            userIds: []
        };
    },
    props: ["rowData"],
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
        console.log("shuju", this.rowData);
        this.$http({
            url: `/actProcess/getFirstNode/${this.rowData.procDefId}`,
            method: "get"
        })
            .then(result => {
                this.options = result.data.data.users;
                this.options.forEach(item => {
                    this.form.assignees.push(item.userId);
                });
               // this.userIds = this.form.assignees;
            })
            .catch(err => {});
    },
    methods: {
        backList() {
            this.$emit("cancel");
        },
        submit() {
            this.form.id = this.rowData.id;
            this.form.title = this.rowData.title;
            this.form.procDefId = this.rowData.procDefId;
            this.$http
                .post("/actBusiness/apply", this.form)
                .then(res => {
                    console.log(res);
                    this.backList();
                })
                .catch(err => {});
        }
    }
};
</script>

<style scoped >
.from-region {
    height: auto;
    width: 100%;
    border-top: 1px solid #a1a3a6;
    border-bottom: 1px solid #a1a3a6;
    padding: 5px 0;
}
.btn-region {
    height: auto;
    margin-top: 20px;
}
</style>
