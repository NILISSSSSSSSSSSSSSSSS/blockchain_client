<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">{{$store.state.common.siteName}}</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/hc' }">{{centerText}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{lang}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    centerText: '',
    lang: ''
  }
}
</script>

<style lang="scss" scoped>

</style>
