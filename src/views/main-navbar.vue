<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header" v-if="!sidebarFold">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">易审软件管理平台</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item index="1">
          <el-badge :value="msgNum" :max="99" class="item">
            <el-dropdown :show-timeout="0" placement="bottom">
              <i class="el-icon-message-solid msgBoxI"></i>
              <el-dropdown-menu slot="dropdown">
                <!--routerName,routerId,routerTitle-->
<!--                <el-dropdown-item @click.native="headBut('sys-msgList')">消息管理</el-dropdown-item>-->
                <el-dropdown-item @click.native="headBut('sys-myMsg')">我的消息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-badge>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="headBut('theme')">系统设置</el-dropdown-item>
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import {clearLoginInfo} from '@/utils'
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        stompClient:'',
        webSUrl:'http://192.168.1.88:8888/esoft-admin/ws',
      }
    },
    components: {
      UpdatePassword
    },
    computed: {
      menuActiveName: {
        get () {
          return this.$store.state.common.menuActiveName
        },
        set (val) {
          this.$store.commit('common/updateMenuActiveName', val)
        }
      },
      mainTabsActiveName: {
        get () {
          return this.$store.state.common.mainTabsActiveName
        },
        set (val) {
          this.$store.commit('common/updateMainTabsActiveName', val)
        }
      },
      navbarLayoutType: {
        get () {
          return this.$store.state.common.navbarLayoutType
        }
      },
      sidebarFold: {
        get () {
          return this.$store.state.common.sidebarFold
        },
        set (val) {
          this.$store.commit('common/updateSidebarFold', val)
        }
      },
      mainTabs: {
        get () {
          return this.$store.state.common.mainTabs
        },
        set (val) {
          this.$store.commit('common/updateMainTabs', val)
        }
      },
      userName: {
        get () {
          return this.$store.state.user.name
        }
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
    mounted(){
      this.getDataList()
      this.openSocket();
    },
    methods: {
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/sys/logout',
            method: 'post'
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
              this.$router.push({name: 'login'})
            }
          })
        }).catch(() => {
        })
      },
      headBut (routerName) {
        this.$router.push({ name: routerName })
      },
      getDataList () {
        let uuid=JSON.parse(sessionStorage.getItem('loginUser')).userId;
        console.log('uuid',uuid);
        this.$http({
          url: '/messageSend/getByUserAndStatus',
          method: 'get',
          params: {
            userId: uuid,
            status:0,
          }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.msgNum= data.data.length;
          }
        })
      },
      openSocket () {
        var sock = new SockJS(this.webSUrl);
        let uuid=JSON.parse(sessionStorage.getItem('loginUser')).userId;

        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(sock)
        // 向服务器发起websocket连接 /topic/subscribe
        let webSConnection = this.stompClient.connect({ Authorization: "Bearer"  }, (message) => {
          this.stompClient.subscribe('/user/'+uuid+'/queue/subscribe',greeting=>{
            this.$notify({
              title: greeting.body,
              message: greeting.body+',请前去’我的消息‘中查看',
            });
            this.getDataList();
          })
          this.stompClient.subscribe("/topic/subscribe",greeting=>{
            this.$notify({
              title: greeting.body,
              message: greeting.body+',请前去’我的消息‘中查看',
            });
            this.getDataList();
          });
        });

      },
      subscribe () {
        this.stompClient.send("/welcome", {}, JSON.stringify({ 'name': 'Marvin' }));
      },
      sendMessage(){

      },
      onFailed(frame) {
        console.log("连接ws失败： " + JSON.stringify(frame));
      },
    }
  }
</script>
<style scoped>
  .msgBoxI{
    font-size: 24px;
  }
</style>
