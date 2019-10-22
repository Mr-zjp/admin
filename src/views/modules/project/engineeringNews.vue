<template>
    <div>
        <el-row :gutter="24">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="150px"
                class="demo-ruleForm"
            >
                <el-col :offset="1" :span="10">
                    <el-form-item label="工程编号：" prop="code">
                        <el-input v-model="ruleForm.code" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="工程地点：" prop="address">
                        <el-input v-model="ruleForm.address" placeholder></el-input>
                    </el-form-item>
                    <el-form-item prop="startTime" label="开工日期：">
                        <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            value-format="timestamp"
                            v-model="ruleForm.startTime"
                            style="width: 100%;"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="批复文号：" prop="replyCode">
                        <el-input v-model="ruleForm.replyCode" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="总投资：" prop="totalInvestment">
                        <el-input v-model="ruleForm.totalInvestment" placeholder></el-input>
                    </el-form-item>
                </el-col>
                <el-col :offset="2" :span="10">
                    <el-form-item label="工程名称：" prop="name">
                        <el-input v-model="ruleForm.name" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="工程规模：" prop="scale">
                        <el-input v-model="ruleForm.scale" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="竣工日期：" prop="endTime">
                        <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            value-format="timestamp"
                            v-model="ruleForm.endTime"
                            style="width: 100%;"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="工程类型：" prop="type">
                        <el-input v-model="ruleForm.type" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="批复概算（元）：" prop="replyGaisuan">
                        <el-input v-model="ruleForm.replyGaisuan" placeholder></el-input>
                    </el-form-item>
                </el-col>
                <el-col :offset="1" :span="22">
                    <el-form-item label="立项说明与概况：" prop="descriptionExplain">
                        <el-input
                            type="textarea"
                            v-model="ruleForm.descriptionExplain"
                            placeholder
                            :autosize="{ minRows: 6, maxRows: 8}"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :offset="1" :span="22">
                    <div class="table-css">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div class="font-color">工程投资明细：</div>
                        <div>
                            <div style="margin-bottom:10px;">
                                <el-button type="primary" size="small" @click.prevent="addRow()">添加</el-button>
                            </div>
                            <el-table
                                :data="investmentModelListArray"
                                style="width:641px;margin-bottom:10px;"
                                ref="tables"
                                border
                            >
                                <el-table-column label="施工单位" width="180" align="center">
                                    <template slot-scope="scope">
                                        <el-input type="text" v-model="scope.row.constructionUnit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="内容" width="180" align="center">
                                    <template slot-scope="scope">
                                        <el-input type="text" v-model="scope.row.content"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="合同金额" width="180" align="center">
                                    <template slot-scope="scope">
                                        <el-input
                                            type="text"
                                            v-model="scope.row.contractAmount"
                                            id="contractAmount"
                                            @blur="check('contractAmount')"
                                        ></el-input>
                                        <div v-if="flag" class="regTip">tip：只能输入数字</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDelete(scope.$index, scope.row)"
                                        >删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
                <el-col :offset="2" :span="22">
                    <div class="zijin font-color">
                        资金来源情况
                        <el-button type="primary" size="small" @click.prevent="addRows()">添加</el-button>
                    </div>
                    <el-table :data="fundsSourceModelListArray" border style="width: 100%">
                        <el-table-column prop="date" label="来源渠道" width="180" align="center">
                            <template slot-scope="scope">
                                <el-input type="text" v-model="scope.row.channel"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="计划拨入资金（元）" width="180" align="center">
                            <template slot-scope="scope">
                                <el-input
                                    type="text"
                                    v-model="scope.row.plan"
                                    id="plan"
                                    @blur="check('plan')"
                                ></el-input>
                                <div v-if="flag" class="regTip">tip：只能输入数字</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="已到位资金（元）" align="center">
                            <template slot-scope="scope">
                                <el-input
                                    type="text"
                                    v-model="scope.row.inPlace"
                                    id="inPlace"
                                    @blur="check('inPlace')"
                                ></el-input>
                                <div v-if="flag" class="regTip">tip：只能输入数字</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="已支付（元）" align="center">
                            <template slot-scope="scope">
                                <el-input
                                    type="text"
                                    v-model="scope.row.paid"
                                    id="paid"
                                    @blur="check('paid')"
                                ></el-input>
                                <div v-if="flag" class="regTip">tip：只能输入数字</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="danger"
                                    size="mini"
                                    @click="handleDeletes(scope.$index, scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :offset="1" :span="22">
                    <el-form-item label="附件">
                        <upLoad
                            :success-list="fileList"
                            @upload-success="upLoadSuccess"
                            @remove-file="removeList"
                        />
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-col :offset="12" style="margin-top:20px">
            <!-- <el-button ref="submitBtn" size="small" class="btn-focus" @click.stop="submitButton">提交</el-button>
            <el-button size="small" @click.stop="saveValidate">保存</el-button>-->
        </el-col>
    </div>
</template>

<script>
import upLoad from "@/components/upLoad/upLoad";
export default {
    name: "engineeringNews",
    data() {
        return {
            flag: false,
            ruleForm: {
                address: this.operate.address || "", //工程地址
                annexFileIds: this.operate.annexFileIds || "", //文件id
                code: this.operate.code || "", //工程编码
                endTime: this.operate.endTime, //竣工时间
                descriptionExplain: this.operate.descriptionExplain || "", //立项说明与概况
                annexFileModelList: this.operate.annexFileModelList || [], //文件数组
                fundsSourceModelList: this.operate.fundsSourceModelList || [], //资金来源情况
                investmentModelList: this.operate.investmentModelList || [], //工程明细
                gaisuanModelList: this.operate.gaisuanModelList || [], //概算
                name: this.operate.name || "", //工程名称
                replyCode: this.operate.replyCode || "", //批复文号
                replyGaisuan: this.operate.replyGaisuan, //批复概算（元）
                scale: this.operate.scale || "", //工程规模
                startTime: this.operate.startTime, //开工时间
                status: null, //状态
                totalInvestment: this.operate.totalInvestment, //总投资
                type: this.operate.type || "", //工程类型
                id: this.operate.id || "", //工程ID
                //整体结算，
                engineeringjie: {
                    type: 0,
                    annexFileIds: "", //文件id
                    settleAccountsReport: "", //结算报告文件id
                    annexFileModelList: [], //附件文件model
                    reportFileModeList: [] //报告结算
                },
                //竣工决算
                engineeringjue: {
                    type: 1,
                    annexFileIds: "", //文件id
                    settleAccountsReport: "", //结算报告文件id
                    annexFileModelList: [], //附件文件model
                    reportFileModeList: [] //报告结算
                },
                //人员和机构分配
                memberModelList: []
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入工程名称",
                        trigger: "blur"
                    }
                ],
                code: [
                    {
                        required: true,
                        message: "请输入工程编码",
                        trigger: "blur"
                    }
                ],
                endTime: [
                    {
                        type: "date",
                        required: true,
                        message: "请选择日期",
                        trigger: "change"
                    }
                ],
                startTime: [
                    {
                        type: "date",
                        required: true,
                        message: "请选择日期",
                        trigger: "change"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "请输入工程地点",
                        trigger: "blur"
                    }
                ],
                replyCode: [
                    {
                        required: true,
                        message: "请输入批复文号",
                        trigger: "blur"
                    }
                ],
                totalInvestment: [
                    {
                        required: true,
                        message: "请输入总投资",
                        trigger: "blur"
                    },
                    {
                        pattern: /^\d+(?:\.\d{1,4})?$/,
                        message: "金额必须是数字且只能是四位小数"
                    }
                ],
                replyGaisuan: [
                    {
                        required: true,
                        message: "请输入批复概算",
                        trigger: "blur"
                    },
                    {
                        pattern: /^\d+(?:\.\d{1,4})?$/,
                        message: "批复概算是数字且只能有四位小数"
                    }
                ],
                descriptionExplain: [
                    {
                        required: true,
                        message: "请输入立项说明与概况",
                        trigger: "blur"
                    }
                ]
            },
            fundsSourceModelListArray: [], //资金来源情况
            investmentModelListArray: [], //工程投资明细
            fileList: [],
            fileArray: []
        };
    },
    props: {
        //工程信息
        operate: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    components: {
        /*组件*/
        upLoad
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
        this.$nextTick(() => {
            if (Object.keys(this.operate).length > 0) {
                this._initfileList();
            }
        });
        if (this.operate.id) {
            this.ruleForm.endTime = new Date(
                this.ruleForm.endTime * 1000
            ).getTime();
            this.ruleForm.startTime = new Date(
                this.ruleForm.startTime * 1000
            ).getTime();
            //资金来源
            this.fundsSourceModelListArray = this.operate.fundsSourceModelList;
            //工程明细
            this.investmentModelListArray = this.operate.investmentModelList;
            //整体结算
            this.ruleForm.engineeringjie = this.operate.engineeringjie;
            //竣工决算
            this.ruleForm.engineeringjue = this.operate.engineeringjue;
        }
        this.$store.state.investmentModelListArray = this.investmentModelListArray;
        this.$store.state.formObject = this.ruleForm;
        this.$store.state.fundsSourceModelListArray = this.fundsSourceModelListArray;
    },
    methods: {
        check(id) {
            let reg = /^\d+(?:\.\d{1,4})?$/;
            let val = document.getElementById(id).value;
            if (!reg.test(val)) {
                  this.$message('只能输入数字');
            }
        },
        //工程投资明细，表格行添加
        addRow() {
            let list = {
                constructionUnit: this.constructionUnit, //施工单位
                content: this.content, //内容
                contractAmount: this.contractAmount, //合同金额
                decreaseAccounting: this.decreaseAccounting, //核减
                increaseAccounting: this.increaseAccounting, //核增
                scAmount: this.scAmount, //送审金额
                authorizeAmount: this.authorizeAmount, //审定金额
                type: 0
            };
            this.investmentModelListArray.push(list);
        },
        //工程投资明细，表格行删除
        handleDelete(index, row) {
            this.investmentModelListArray.splice(index, 1);
        },
        //资金来源情况，表格行添加
        addRows() {
            let list = {
                inPlace: this.inPlace,
                paid: this.paid,
                plan: this.plan,
                channel: this.channel
            };
            this.fundsSourceModelListArray.push(list);
        },
        //资金来源情况，表格行删除
        handleDeletes(index, row) {
            this.fundsSourceModelListArray.splice(index, 1);
        },
        _initfileList() {
            if (
                this.operate.annexFileModelList &&
                this.operate.annexFileModelList.length > 0
            ) {
                this.operate.annexFileModelList.filter(item => {
                    console.log("item", item);
                    this.fileList.push({
                        name: item.proFileName,
                        id: item.proFileId
                    });
                });
            }
        },
        removeList(fileId) {
            // 移除文件
            let index = this.fileArray.findIndex(item => {
                return item === fileId;
            });
            this.fileArray.splice(index, 1);
        },
        upLoadSuccess(fileId) {
            let fileIds = this.ruleForm.annexFileIds;
            if (
                null != this.ruleForm.annexFileIds &&
                "" !== this.ruleForm.annexFileIds
            ) {
                this.ruleForm.annexFileIds += "," + fileId;
            } else {
                this.ruleForm.annexFileIds = fileId;
            }
            this.fileArray = fileIds.split(",");
        }
    }
};
</script>

<style scoped >
.zijin {
    width: 99.5%;
    height: 40px;
    padding-left: 10px;
    line-height: 40px;
    background: #f3f3f3;
}

.table-css {
    display: flex;
}
.font-color {
    color: #606266;
    font-size: 14px;
}
.regTip {
    color: red;
    font-size: 12px;
    transform: 1s;
}
</style>