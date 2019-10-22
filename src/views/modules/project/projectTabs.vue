<template>
    <div>
        <div slot="header" class="clearfix">
            <span>{{headerName}}</span>
            <el-button @click="goBackList" size="mini" style="float: right;" class="btn-focus">返回</el-button>
        </div>
        <div class="radio-wrap">
            <div class="radio-group">
                <span
                    v-for="(tab ,index) in tabs"
                    :class="{cur:iscur==index}"
                    :key="index"
                    class="span-btn"
                    :style="index==iscur ? bgcolor : '' "
                    @click="iscur=index,tabChange('select' + (index + 1))"
                >{{tab.name}}</span>
            </div>
            <div style="margin:10px 0;"></div>
            <keep-alive>
                <component v-bind:is="tabView" v-bind="$attrs" v-on="$listeners"></component>
            </keep-alive>
            <el-col :offset="12" style="margin-bottom:20px">
                <div v-if="this.active!=5">
                    <el-button style="margin-top: 12px;" @click="next('select' + (active + 1))">下一步</el-button>
                </div>
            </el-col>
        </div>
    </div>
</template>

<script>

import select1 from "./engineeringNews"; //工程信息
import select2 from "./budgetEstimate"; //概算信息
export default {
    data() {
        return {
            headerName: "工程信息",
            bgcolor: { background: "white", color: "#409eff" },
            tabView: "select1",
            iscur: 0,
            active: 1,
            tabs: [
                { name: "工程信息" },
                { name: "概算信息" },
            ]
        };
    },
    props: {},
    components: {
        /*组件*/
        select1,
        select2,
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
    mounted() {},
    methods: {
        changeName(name){
            switch (name) {
                case "select1":
                    this.headerName = "工程信息";
                    break;
                case "select2":
                    this.headerName = "概算信息";
                    break;
                default:
                     this.headerName = "工程信息";
                    break;
            }
        },
        tabChange(tab) {
            let str = tab.slice(-1) * 1;
            this.tabView = tab;
            this.active = str;
            this.changeName(tab)
        },
        next(tab) {
            this.active++;
            this.iscur++;
            this.tabView = tab;
            this.changeName(tab);
        },
        goBackList() {
            this.$emit("goBack", true);
        }
    }
};
</script>

<style scoped >
.radio-wrap {
    border: 1px solid #e4e7ed;
    border-bottom: 0;
    margin-top: 10px;
}
.back-btn,
.radio-group {
    width: 100%;
    height: 40px;
}
.radio-group {
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
}
.back-btns {
    float: right;
}
.span-btn {
    font-size: 14px;
    display: inline-block;
    height: 41px;
    width: 100px;
    font-weight: 500;
    line-height: 41px;
    text-align: center;
    color: #303133;
    cursor: pointer;
    transition: -webkit-transform 0.3s;
    -webkit-transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
}
.span-btn:hover {
    color: #409eff;
}
</style>
