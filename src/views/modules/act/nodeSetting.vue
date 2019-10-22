<template>
    <div class="warp">
        <div class="left">
            <div class="current">
                <span class="el-icon-info"></span>
                <span>
                    当前选择编辑：
                    <b>{{currentName}}</b>
                </span>
                <span @click="cancel">取消选择</span>
            </div>
            <div class="btnGroup-css">
                <span v-for="(item,index) in btnLists" :key="index" class="btnList-css">
                    <div style="margin-bottom:20px;">
                        <span
                            v-if="item.type==0"
                            style="background: rgb(71, 203, 137)"
                            class="sign-css"
                        >开</span>
                        <span v-if="item.type==1" style="background: #ccc" class="sign-css">审</span>
                        <span
                            v-if="item.type==2"
                            style="background: rgb(45, 183, 245)"
                            class="sign-css"
                        >结</span>
                        <span
                            class="btn-css"
                            :class="{changeBgcolor:index==spanIndex}"
                            @click="changrCurrent(index,item.title,item.type,item.id)"
                        >{{item.title}}</span>
                    </div>
                </span>
            </div>
        </div>
        <div class="right">
            <div class="pub">节点名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{currentName}}</div>
            <el-form ref="form" :model="Uselessforms" label-width="150px">
                <el-form-item label="节点类型：">
                    <el-select v-model="Uselessforms.region" :placeholder="nodeType" disabled>
                        <el-option label="开始节点" value="0"></el-option>
                        <el-option label="审批节点" value="1"></el-option>
                        <el-option label="结束节点" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="可审批人员：" v-if="flag">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="根据角色选择" @change="changeRole"></el-checkbox>
                        <el-checkbox label="部门负责人" @change="changeDepartment"></el-checkbox>
                        <el-checkbox label="直接选择人员" @change="changeUser"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="rolesFlag && flag" label="选择角色：">
                    <el-select
                        v-model="form.roleIds"
                        multiple
                        placeholder="请选择"
                        @change="selectroles"
                    >
                        <el-option
                            v-for="(item,index) in roles"
                            :key="index"
                            :label="item.roleName"
                            :value="item.roleId"
                        >
                            <span style="float: left">{{ item.roleName }}</span>
                            <span
                                style="margin-left:15px; color: #8492a6; font-size: 13px;"
                            >{{ item.remark }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择部门：" v-if="departmentFlag && flag">
                    <el-select
                        v-model="form.departmentIds"
                        multiple
                        placeholder="请选择"
                        @change="selectDepartment"
                    >
                        <el-option
                            v-for="(item,index) in department"
                            :key="index"
                            :label="item.orgName"
                            :value="item.orgNo"
                        >
                            <span style="float: left">{{ item.orgName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="pub" v-if="userFlag && flag">
                    <span>选择用户：</span>
                    &nbsp;&nbsp;
                    <el-button icon="el-icon-edit" size="small" @click="table = true">选择用户</el-button>
                    <el-button type="text" size="small" @click="emptySelection">清空选择</el-button>
                    <el-collapse accordion style="margin-top:10px;margin-left:85px">
                        <el-collapse-item>
                            <template slot="title">
                                已选择
                                <span style="color:blue;margin:0 10px">{{numbers||0}}</span>人
                            </template>
                            <el-tag
                                v-for="tag in user"
                                :key="tag.userId"
                                closable
                                @close="closeTag(tag)"
                                style="margin-left:10px;"
                            >{{tag.userName}}</el-tag>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <el-form-item>
                    <el-button
                        type="primary"
                        class="el-icon-edit"
                        @click="onSubmit"
                        :disabled="btnFlag"
                    >保存并提交</el-button>
                    <el-button @click="close" class="close-btn">关闭</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-drawer title="选择用户" :visible.sync="table" size="50%">
            <div style="padding:10px 40px">
                <userTable @getUserData="operationData" />
            </div>
        </el-drawer>
    </div>
</template>

<script>
function typeSort(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
    });
}
import userTable from "./userTable";
import { truncate } from "fs";
export default {
    data() {
        return {
            /* 左侧按钮 */
            btnList: [], //流程的节点名称
            currentName: "", //节点名称
            spanIndex: 0,
            /* 右侧表单 */
            form: {
                nodeId: "", //节点ID
                departmentIds: [], //部门id
                roleIds: [], //角色id
                userIds: [] //用户id
            },
            //节点类型表单
            Uselessforms: {
                region: ""
            },
            checkList: [], //checkBox-model
            flag: false, //控制可审批人员是否显示
            nodeType: "", //节点类型，用于判断节点类型的placeholder值
            roles: [], //角色
            department: [], //部门
            user: [], //用户
            userValue: "", //用户值-select
            rolesValue: "", //角色值-select
            departmentValue: "", //部门值-select
            rolesFlag: false, //控制角色选项
            departmentFlag: false, //控制部门选项
            userFlag: false, //控制用户选项
            table: false, //需要选择的用户列表
            numbers: null, //选择的用户数量,
            userIds: [],
            btnFlag: true
        };
    },
    props: { rowData: Object },
    components: {
        /*组件*/
        userTable
    },
    watch: {
        /*监听*/
    },
    computed: {
        /*计算属性*/
        btnLists() {
            return typeSort(this.btnList, "type");
        }
    },
    filters: {
        /*过滤器*/
    },
    created() {},
    mounted() {
        this._initNode();
        this._initRole();
        this._initDepartment();
    },
    methods: {
        //返回父组件
        close() {
            this.$emit("goBack");
        },
        //流程选项
        changrCurrent(index, name, type, id) {
            this.spanIndex = index;
            this.currentName = name;
            this.form.nodeId = id;
            if (type === 1) {
                this.flag = true;
                this.btnFlag = false;
                this.nodeType = "审批节点";
            } else if (type == 0) {
                this.flag = false;
                this.btnFlag = true;
                this.nodeType = "开始节点";
            } else {
                this.flag = false;
                this.btnFlag = true;
                this.nodeType = "结束节点";
            }
            this.checkList = [];
            this.rolesFlag = false;
            this.departmentFlag = false;
            this.userFlag = false;
            this.form.roleIds = [];
            this.form.departmentIds = [];
            this.form.userIds = [];
            this.numbers = 0;
            let judge = true;
            this.btnList.forEach((item, index) => {
                if (name === item.title && judge) {
                    judge = false;
                    this.roles = item.roles;
                    this.department = item.departments;
                    this.user = item.users;
                    this._initDepartment();
                    this._initRole();
                    if (item.roles != null) {
                        item.roles.forEach(arr => {
                            this.form.roleIds.push(arr.roleId);
                        });
                    }
                    if (item.departments != null) {
                        item.departments.forEach(arr => {
                            this.form.departmentIds.push(arr.orgNo);
                        });
                    }
                    if (item.users != null) {
                        item.users.forEach(arr => {
                            return this.form.userIds.push(arr.userId);
                        });
                    }
                    if (
                        this.department != null &&
                        this.user != null &&
                        this.roles != null
                    ) {
                        if (this.user.length != 0) {
                            this.checkList.push("直接选择人员");
                            this.userFlag = true;
                            this.numbers = this.user.length;
                        }
                        if (this.department.length != 0) {
                            this.checkList.push("部门负责人");
                            this.departmentFlag = true;
                        }
                        if (this.roles.length != 0) {
                            this.checkList.push("根据角色选择");
                            this.rolesFlag = true;
                        }
                    }
                }
            });
        },
        //取消选择
        cancel() {
            this.currentName = "";
            this.form.name = "";
        },
        /* ------------接口请求------------- */
        _initNode() {
            //初始化流程节点名称
            this.$http({
                url: `/actProcess/getProcessNode/${this.rowData.id}`,
                method: "get"
            })
                .then(res => {
                    this.btnList = res.data.data;
                })
                .catch(res => {
                    this.$message.error(res.data.msg);
                });
        },
        onSubmit() {
            //节点信息编辑
            this.$http
                .post(
                    "/actProcess/editNodeUser?nodeId=" +
                        this.form.nodeId +
                        "&departmentIds=" +
                        this.form.departmentIds +
                        "&roleIds=" +
                        this.form.roleIds +
                        "&userIds=" +
                        this.form.userIds
                )
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: "操作成功",
                            type: "success"
                        });
                    }
                    this._initNode();
                })
                .catch(res => {});
        },
        _initRole() {
            //初始化角色信息
            this.$http({
                url: "/sys/role/list",
                method: "get"
            })
                .then(res => {
                    this.roles = res.data.page.records;
                })
                .catch(res => {});
        },
        _initDepartment() {
            this.$http({
                url: "/sys/org/queryAll",
                method: "get"
            }).then(res => {
                this.department = res.data.list;
            });
        },
        /* ---------------------选择角色的相关操作----------------------- */
        //控制角色选项是否显示
        changeRole(e) {
            if (e) {
                this.rolesFlag = true;
            } else {
                this.rolesFlag = false;
            }
        },
        //选择角色并把ID赋值给from.roleIds
        selectroles(value) {
            this.form.roleIds = value;
        },
        /* ---------------------选择部门的相关操作----------------------- */
        //控制部门选项是否显示
        changeDepartment(e) {
            if (e) {
                this.departmentFlag = true;
            } else {
                this.departmentFlag = false;
            }
        },
        //选择部门并把ID赋值给from.departmentIds
        selectDepartment(value) {
            this.form.departmentIds = value;
        },
        /* ---------------------选择用户的相关操作----------------------- */
        //控制用户选项是否显示
        changeUser(e) {
            if (e) {
                this.userFlag = true;
            } else {
                this.userFlag = false;
            }
        },
        //选择user添加tag标签和userId
        operationData(row) {
            let userId = [];
            this.user.forEach(item => {
                return userId.push(item.userId);
            });
            if (userId.indexOf(row.userId) === -1) {
                this.user.push(row);
                this.numbers = this.user.length;
                this.form.userIds.push(row.userId);
            } else {
                this.$message({
                    message: "该用户已被添加！",
                    type: "warning"
                });
            }
        },
        //删除指定tag标签和userId
        closeTag(tag) {
            /*let userId = [];
             this.user.forEach(item => {
                return userId.push(item.userId);
            }); 
            this.form.userIds=this.userId;*/
            this.user.splice(this.user.indexOf(tag), 1); //删除tag标签
            this.form.userIds.splice(this.form.userIds.indexOf(tag.userId), 1); //删除tag标签时删除相对应的id
            this.numbers = this.user.length;
            console.log("剩余id", this.form.userIds);
        },
        //清空选择
        emptySelection() {
            this.user = [];
            this.form.userIds = [];
            this.numbers = this.user.length;
        }
    }
};
</script>

<style scoped >
.warp {
    width: 100%;
    height: auto;
    display: flex;
}
.left {
    width: 30%;
    min-height: 300px;
}
.right {
    width: 60%;
    min-height: 300px;
}
.current {
    margin-left: 20px;
    border: 1px solid #abdcff;
    background-color: #f0faff;
    line-height: 40px;
    padding-left: 15px;
    border-radius: 4px;
}
.current :nth-child(1) {
    color: blue;
    margin-right: 10px;
}
.current :nth-child(3) {
    cursor: pointer;
}
.btnGroup-css {
    padding: 30px;
}
.btnList-css {
    display: block;
    cursor: pointer;
    font-size: 14px;
}
.sign-css {
    display: inline-block;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: white;
}
.btn-css {
    display: inline-block;
    width: auto;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    padding: 0 2px;
}
.changeBgcolor {
    background-color: #d5e8fc;
}
.btn-css:hover {
    background-color: #d5e8fc;
}
.close-btn： {
    width: 56px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    border-radius: 4xp;
}
.close-btn：hover {
    transition: 0.2s;
    color: #57a3f3;
    background-color: #fff;
    border-color: #57a3f3;
}
.pub {
    margin-left: 65px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #606266;
}
</style>

