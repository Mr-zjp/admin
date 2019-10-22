<template>
    <div>
        <div class="table">
            <el-table
                :data="tableData"
                style="width: 100%"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                border
            >
                <el-table-column prop="name" label="任务名称" align="center"></el-table-column>
                <el-table-column label="处理人" align="center" width="300">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.assignees" :key="index">
                            <span style="display:inline-block;height:40px;line-height:40px;">
                                <span :style="item.isExecutor?greenDot:greyDot"></span>
                                &nbsp;{{item.username}}
                            </span>&nbsp;
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="deleteReason" label="审批操作" align="center"></el-table-column>
                <el-table-column prop="comment" label="审批意见" align="center"></el-table-column>
                <el-table-column prop="duration" label="耗时(小时)" align="center">
                    <template slot-scope="scope">
                            <span>{{(scope.row.duration/1000/3600).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="完成时间" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.endTime!=null">已办理</span>
                        <span v-else style="color:#f47920">待办理</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-divider></el-divider>
        <div class="img">
            <div class="clearfixs">
                <span class="title">审批流程图查看</span>
            </div>
            <div class="img-region" align="center" >
                <img :src="url" alt />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            greenDot: {
                display: "inline-block",
                width: "6px",
                height: "6px",
                background: "green",
                borderRadius: "50%",
                verticalAlign: "middle",
                position: "relative",
                top: "-1px"
            },
            greyDot: {
                display: "inline-block",
                width: "6px",
                height: "6px",
                background: "#e6ebf1",
                borderRadius: "50%",
                verticalAlign: "middle",
                position: "relative",
                top: "-1px"
            },
            url: ""
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
        console.log("this.rowData",this.rowData)
        this.getList();
        this.getImg();
    },
    methods: {
        getList() {
            this.$http({
                url: `/actTask/historicFlow/${this.rowData.id}`,
                method: "get"
            })
                .then(result => {
                    console.log("result",result)
                    if (result.data.code === 0) {
                        this.tableData = result.data.data;
                        this.$message({
                            message: result.data.msg,
                            type: "success"
                        });
                        this.tableData.forEach(item => {});
                    }
                })
                .catch(err => {});
        },
        getImg() {
            this.$http({
                url: `/actProcess/getHighlightImg/${this.rowData.id}`,
                method: "get",
                responseType: "arraybuffer"
            })
                .then(result => {
                    return  this.url=(
                        "data:image/png;base64," +
                        btoa(
                            new Uint8Array(result.data).reduce(
                                (data, byte) =>
                                    data + String.fromCharCode(byte),
                                ""
                            )
                        )
                    );
                })
                .catch(result => {});
        }
    }
};
</script>

<style scoped >
.img {
    margin-top: -20px;
}
.clearfixs {
    border-bottom: 1px solid #e8eaec;
    padding: 14px 16px;
    line-height: 1;
    cursor: pointer;
    margin-bottom: 20px;
    display: -webkit-flex;
    display: flex;
    justify-content: space-around;
}
.clearfixs span {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #17233d;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.img-region{
    margin-left: -20px;

}
</style>
