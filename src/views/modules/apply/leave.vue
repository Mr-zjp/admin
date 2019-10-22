<template>
    <div>
        <div class="form">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-form-item label="请假申请人" v-if="seeTitle">{{applyUserName}}</el-form-item>
                <el-col :span="8">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="原因" prop="description">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-form-item>
                    <el-form-item label="请假类型">
                        <el-select v-model="form.type" placeholder="请假类型">
                            <el-option
                                v-for="(item,index) in types"
                                :key="index"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间范围">
                        <el-date-picker
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="timeFrame"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="isChange"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="请假时长">{{flag?duration:timeLang}}&nbsp;小时</el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')" v-if="!seeTitle&&!btnFlag">保存并关闭</el-button>
                        <el-button @click="colseForm">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            types: [
                "婚假",
                "产假",
                "陪产假",
                "哺乳假",
                "事假",
                "病假",
                "调休",
                "年假",
                "丧假"
            ],
            form: {
                description: "", //原因
                duration: "", //请假时长
                endDate: "", //结束时间
                startDate: "", //开始时间
                title: "", //标题
                type: "", //类型
                procDefId: ""
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入标题",
                        trigger: "blur"
                    }
                ],
                description: [
                    {
                        required: true,
                        message: "请添加请假原因",
                        trigger: "change"
                    }
                ]
            },
            timeFrame: [],
            timeLang: null,
            flag: false,
            applyUserName: ""
        };
    },
    props: {
        procDefId: String,
        rowData: Object,
        noAdd: Boolean,
        seeTitle: Boolean,
        btnFlag:Boolean
    },
    components: {
        /*组件*/
    },
    watch: {
        /*监听*/
    },
    computed: {
        /*计算属性*/
        duration() {
            if (this.timeFrame.length != 0) {
                let start_str = this.timeFrame[0].replace(/-/g, "/");
                let start_data = new Date(start_str);
                let end_str = this.timeFrame[1].replace(/-/g, "/");
                let end_data = new Date(end_str);
                let duration = (end_data - start_data) / (1000 * 3600 * 24);
                let num = parseInt(Math.ceil(duration)) * 24;
                this.timeLang = num;
                return num;
            }
        }
    },
    filters: {
        /*过滤器*/
    },
    created() {},
    mounted() {
        if (this.noAdd) {
            this.getDetails();
            this.applyUserName = this.rowData.applyUserName;
        }
    },
    methods: {
        //编辑查询
        getDetails() {
            this.$http({
                url: `/leave/get/${this.rowData.tableId}`,
                method: "get"
            }).then(res => {
                console.log(res);
                this.form = res.data.user;
                this.timeLang = this.form.duration;
                let dateArr = [];
                dateArr.push(
                    new Date(this.form.startDate),
                    new Date(this.form.endDate)
                );
                this.timeFrame = dateArr;
            });
        },
        //新增or查询
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.form.startDate = this.timeFrame[0];
                    this.form.endDate = this.timeFrame[1];
                    this.form.duration = this.timeLang;
                    if (!this.noAdd) {
                        this.form.procDefId = this.procDefId;
                        this.$http
                            .post("/leave/add", this.form)
                            .then(res => {
                                this.$message({
                                    message: "新增成功",
                                    type: "success"
                                });
                                this.colseForm();
                            })
                            .catch(res => {});
                    } else {
                        this.form.businessId = this.rowData.id;
                        this.$http
                            .post("/leave/update", this.form)
                            .then(res => {
                                console.log("编辑表单", this.form);
                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                                this.colseForm();
                            })
                            .catch(res => {});
                    }
                } else {
                    return false;
                }
            });
        },
        isChange() {
            this.flag = true;
        },
        colseForm() {
            this.$emit("backList");
        }
    }
};
</script>

<style scoped >
</style>
