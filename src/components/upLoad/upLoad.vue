<template>
  <div class="upLoad">
    <el-upload
      v-if="!hide"
      :before-upload="Limit"
      :on-progress="upLoad"
      :on-success="upLoadSuccess"
      :show-file-list="false"
      :disabled="disabled"
      :accept="accept"
      :action="action"
      :before-remove="removefile"
      :multiple="limit === 0"
    >
      <el-button size="mini" class="btn-focus" icon="el-icon-upload2">导入</el-button>
    </el-upload>
    <ul :class="{'is-disabled': disabled}" class="el-upload-list el-upload-list--text">
      <li v-for="(item,index) in fileList" :key="index" class="el-upload-list__item is-success">
        <div>
          <a
            :href="`javascript:POBrowser.openWindowModeless('static/pageoffice/office.html?fileId=${item.id}&operateType=readyOnly&userId=${$store.state.userId}','width=1000px;height=950px;')`"
            class="el-upload-list__item-name"
          >
            <i class="el-icon-document"/>
            {{item.name}}
          </a>
          <div v-if="item.percentage === 100 || Object.keys(item).indexOf('percentage') === -1">
            <div class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"/>
            </div>
            <i v-if="!disabled" class="el-icon-close" @click.stop="removefile(item)"/>
            <el-button circle icon="el-icon-download" size="mini" @click.stop="downLoad(item)"/>
          </div>
        </div>
        <el-progress v-if="item.percentage < 100" :stroke-width="2" :percentage="item.percentage"/>
      </li>
    </ul>
  </div>
</template>

<script>
import { debug } from 'util';
/**
 * * 基于element-ui 自定义 upLoad 上传组件
 *
 * * author: JdesHZ 2018-11-14
 *
 * *  点击文件列表名可以实现调用pageoffice打开文件
 * *  点击下载图标可以实现文件下载
 */

/**
 * *  Props列表
 * *
 * *  action: 上传地址
 * *  data: 附带参数
 * *  url: 文件下载接口,要求GET 且参数为fileId
 * *  accept: 文件 MIME 类型
 * *  disabled: 是否禁用
 * *  successList: 用于回显,代表之前上传的文件列表
 * *  limit: 文件数量限制
 */

/**
 * * Events
 * *
 * *  upload-success  文件上传成功之后的回调(参数为文件Id)
 * *  remove-file  文件移除列表之后的回调(参数为文件Id)
 */

export default {
  name: 'upLoad',
  props: {
    action: {
      // 上传地址
      type: String,
      default: function () {
        return this.$api.fileUpload
      }
    },
    url: {
      // 文件下载的地址,要求GET 且参数为fileId
      type: String,
      default: function () {
        return this.$api.fileDownLoad
      }
    },
    data: {
      // 附带参数
      type: Object,
      default: function () {
        return {}
      }
    },
    accept: {
      // 文件类型
      type: String,
      default: function () {
        return ''
      }
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: function () {
        return false
      }
    },
    successList: {
      // 已经上传成功的附件,便于初始化时加载
      type: Array,
      default: function () {
        return []
      }
    },
    limit: {
      // 文件数量限制
      type: Number,
      default: function () {
        return 0
      }
    },
    hide: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      fileList: [],
      fileId: ''
    }
  },
  watch: {
    successList (val) {
      this.fileList = [...this.successList]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fileList = [...this.successList]
    })
  },
  methods: {
    Limit (file) {
      // 文件大小限制
      const size = file.size / 1024 / 1024
      if (size > 100) {
        this.$message.warning('上传文件最大为100MB')
        return false
      } else {
        if (this.limit > 0) {
          // 文件数量限制
          if (this.fileList.length === this.limit) {
            this.$message.warning(
              `当前限制上传${this.limit}个文件,请移除后进行操作`
            )
            return false
          }
        } else {
          return true
        }
      }
    },
    upLoad (ev, file, fileList) {
      // 上传时调用
      console.log(ev, file, fileList)
      let index = this.fileList.findIndex(item => {
        return item.uid === file.uid
      })
      if (index > -1) {
        this.fileList.splice(index, 1) // 已存在该对象则删除对象
      }
      this.fileList.push({
        name: file.name,
        id: '',
        percentage: Math.round((ev.loaded / ev.total) * 10000) / 100.0,
        uid: file.uid
      })
    },
    upLoadSuccess (response, file, fileList) {
      // 上传成功调用
      console.log(response, file, fileList)
      if (response.success) {
        this.fileList.map(item => {
          if (item.uid === file.uid) {
            return this.$set(item, 'id', response.data)
          }
        })
        this.$notify({
          title: '上传成功',
          type: 'success',
          message: file.name,
          position: 'bottom-right',
          duration: 1000
        })
        this.$emit('upload-success', response.data) // 上传成功则把fileId返回
      } else {
        let index = this.fileList.findIndex(item => {
          return item.uid === file.uid
        })
        this.fileList.splice(index, 1)
      }
    },
    removefile (file) {
      // 移除文件
      console.log(file)
      if (file.status === 'ready' && !this.Limit(file)) {
        return false
      } else {
        let index = this.fileList.findIndex(item => {
          return item.id === file.id
        })
        console.log("index",index)
        this.fileList.splice(index, 1)
        this.$emit('remove-file', file.id) // 移除以后将fileId传递出去
      }
    },
    // downLoad (file) {
    //   // 下载文件
    //   console.log(file)
    //   let href = `${this.url}?fileId=${file.id}`
    //   _$.upLoad(href)
    //   console.log(href)
    // },
    downLoad(file){
        this.$http
                .get(this.$api.fileDownLoad, {
                    params: { fileId: file.id },
                    responseType: "blob"
                })
                .then(res => {
                    let url = window.URL.createObjectURL(res.data);
                    let link = document.createElement("a");
                    link.style.display = "none";
                    link.href = url;
                    link.setAttribute("download", file.name);
                    document.body.appendChild(link);
                    link.click();
                    this.$message.success({
                        message: "导出成功"
                    });
                });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
}
.el-upload-list__item > div {
  display: flex;
}
.el-upload-list__item-name {
  margin-right: 60px;
}
.el-button--mini.is-circle {
  position: absolute;
  right: 30px;
  border: none;
}
.el-button--mini.is-circle:focus,
.el-button--mini.is-circle:hover {
  border-color: none;
  background-color: none;
}
</style>
