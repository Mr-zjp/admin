<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {}
</script>

<style>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 48%;
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
</style>

