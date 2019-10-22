<template>
    <div class="myMsgBox">
        <el-tabs tabPosition="left" v-model="tabsActiveName" style="height: 820px;" type="border-card">
            <el-tab-pane name="unread">
                <span slot="label">
                    <i v-show="tabsActiveName=='unread'" class="el-icon-check"></i>未读消息
                    <el-badge :value="unreadList.length" class="item"></el-badge>
                </span>
                <msgListTab :msgList="unreadList" :tabsType="tabsActiveName" @reLoad="reLoad"></msgListTab>
            </el-tab-pane>
            <el-tab-pane name="read">
                <span slot="label">
                    <i v-show="tabsActiveName=='read'" class="el-icon-check"></i> 已读消息
                    <el-badge :value="readList.length" type="info" class="item"></el-badge>
                </span>
                <msgListTab :msgList="readList" :tabsType="tabsActiveName" @reLoad="reLoad"></msgListTab>
            </el-tab-pane>
            <el-tab-pane name="recycle">
                <span slot="label">
                    <i v-show="tabsActiveName=='recycle'" class="el-icon-check"></i> 回收站
                    <el-badge :value="recycleList.length" type="info" class="item"></el-badge>
                </span>
                <msgListTab :msgList="recycleList" :tabsType="tabsActiveName" @reLoad="reLoad"></msgListTab>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
    import msgListTab from './msg/msgListTable'

    export default {
        name: "",
        components:{
            msgListTab
        },
        data(){
            return{
                tabsActiveName:'unread',
                msgList:[],
                rowCon:{},
            }
        },
        mounted(){
            this.getDataList();
            // console.log(this.unreadList.length)
            // this.$store.commit('user/updateMsgNum', this.unreadList.length)
        },
        computed:{
            unreadList(){
                return this.msgList.filter(item=> item.status===0)
            },
            readList(){
                return this.msgList.filter(item=> item.status===1)
            },
            recycleList(){
                return this.msgList.filter(item=> item.status===2)
            },
            msgNum: {
                get () {
                    return this.$store.state.user.msgNum
                },
                set (val) {
                    this.$store.commit('user/updateMsgNum', val)
                }
            },
        },
        methods:{
            getDataList () {
                let uuid=JSON.parse(sessionStorage.getItem('loginUser')).userId;
                this.$http({
                    url: '/messageSend/getByUserAndStatus',
                    method: 'get',
                    params:{
                        userId:uuid,
                    }
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.msgList = data.data;
                        this.$store.commit('user/updateMsgNum', this.msgList.filter(item=> item.status===0).length)
                    } else {
                        this.msgList = []
                    }
                    console.log(data)
                })
            },
            reLoad(){
                this.getDataList()
            },

        }
    }
</script>

<style>
   .myMsgBox .el-tabs__header{
       height: 820px !important;
    }
   .myMsgBox .el-tabs__item{
       height: 60px;
       line-height: 60px;
       width: 150px !important;
       font-size: 15px;
   }
</style>