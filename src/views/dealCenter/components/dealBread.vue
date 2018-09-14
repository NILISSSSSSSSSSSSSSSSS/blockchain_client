<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">{{$t('common.index')}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{currentNav}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    props: ['currentNav']
  }
</script>
