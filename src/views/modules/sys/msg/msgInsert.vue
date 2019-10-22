<template>
    <el-form ref="form" label-width="120px" style="margin:10px;" :model="formObj">
        <el-form-item label="消息标题">
            <el-input size="medium" v-model="formObj.title" placeholder="消息标题"></el-input>
        </el-form-item>
        <el-form-item label="消息内容">
            <editor ref="editor"></editor>
        </el-form-item>
        <el-form-item label="消息类型">
            <el-select size="medium" v-model="formObj.type" placeholder="消息类型">
                <el-option label="系统公告" value="0"></el-option>
                <el-option label="提醒" value="1"></el-option>
                <el-option label="私信" value="2"></el-option>
                <el-option label="工作流" value="3"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="新建账号也推送">
            <el-switch v-model="formObj.createSend"></el-switch>
        </el-form-item>
        <el-form-item label="发送范围">
            <el-radio-group @change="selProList=[]" v-model="formObj.range">
                <el-radio :label="0">全体成员</el-radio>
                <el-radio :label="1">指定人员</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formObj.range==1" label="选择人员">
            <el-button size="medium" icon="el-icon-user-solid" @click="formObj.drawer=true">选择发送用户</el-button>
            <el-button size="medium" type="text" @click="selProList=[]">清空已选</el-button>
            <div class="marTop">
                <el-tag size="small"
                        v-for="item in selProList"
                        :key="item.id"
                        effect="plain"
                        @close="handleClose(item)"
                        closable>{{item.name}}</el-tag>
            </div>
        </el-form-item>
        <el-form-item v-if="!readOnly">
            <el-button size="medium" type="primary" @click="subBut">提交</el-button>
        </el-form-item>
        <!--抽屉-->
        <el-drawer
                title="添加人员"
                size="40%"
                :visible.sync="formObj.drawer">
            <msgTable @toChild="toChild" :selProList="selProList"></msgTable>
        </el-drawer>
    </el-form>
</template>

<script>
    import editor from '../../../common/editor'
    import msgTable from './msgInsertTable'
    export default {
        name: "",
        props:['rowCon'],
        components:{
            editor,
            msgTable
        },
        data(){
            return{
                formObj:{
                    content: "",//内容
                    createSend: true,//新创建账号也推送
                    range: 0,//0 全员 1指定人员
                    title: "",//标题
                    type: '0',//消息类型
                    userIds: [],//人员id
                    drawer:false,//抽屉状态
                },
                content:'',
                selProList:[],//已选人员list
                readOnly:false,
            }
        },
        mounted(){
            this.$nextTick(function() {
                if(this.rowCon.id){
                    this.readOnly=true;
                    this.formObj.title=this.rowCon.title;
                    this.formObj.type=this.rowCon.type;
                    this.formObj.createSend=this.rowCon.createSend;
                    this.$refs.editor.setHtml(this.rowCon.content);
                }
            });
        },
        methods:{
            init(){
                this.$refs.editor.setHtml(this.myeditor);
            },
            save(){
                this.myeditor=this.$refs.editor.getHtml();
                console.log(this.myeditor)
            },
            toChild(){
                this.selProList=[]
            },
            handleClose(obj){
                this.selProList=this.selProList.filter(item=>{
                    return item.id!=obj.id;
                })
            },
            subBut(){
                let list=[];
                this.selProList.filter(item=>{
                    list.push(item.id)
                    return item;
                })
                this.formObj.userIds=list;
                this.formObj.content=this.$refs.editor.getHtml();
                console.log(this.formObj)
                this.$http({
                    url: `/message/add`,
                    method: 'post',
                    data: this.formObj
                }).then(({data}) => {
                    console.log(data);
                    if (data && data.code === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                        })
                        this.$emit('reLoad');
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .marTop{
        margin: 10px 0px;
    }
    .marTop>span{
        margin: 0px 5px;
    }
</style>
<style>
    #editor .w-e-text-container{
        z-index: 2000 !important;
    }
    #editor .w-e-menu{
        z-index: 2000 !important;
    }
</style>