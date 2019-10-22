<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width:100%;"
      @selection-change="selectionChangeHandle"
      >
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        
        label="性别">
        <template slot-scope="scope">
          <span>{{transDict('SEX',scope.row.sex)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="orgNo"
        header-align="center"
        align="center"
        width="150"
        label="所属机构">
        <template slot-scope="scope">
          <span>{{transOrg(scope.row.orgNo)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
         width="150"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        width="150"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="small" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope" fixed>
         <el-button  type="primary" size="small" @click="addUsers(scope.row)">
            添加该用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
       class="page"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
    
    },
    mounted(){
        this.getDataList()
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/sys/user/list',
          method: 'get',
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userName': this.searchForm.userName
          }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.records
            this.totalPage = data.page.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 添加用户
      addUsers (row) {
          console.log(row)
          this.$emit("getUserData",row)
      }
    }
  }
</script>
<style  scoped>
.page{
    margin-top: 10px;
    float:right;
}
</style>