<template>
  <div class="deal-panel">
    <div class="panel-heading"><h3 class="panel-title">{{title}}</h3></div>
    <div class="panel-body"><slot></slot></div>
  </div>
</template>
<script>
  export default {
    props: ['title']
  }
</script>
<style lang="scss" scoped>
.deal-panel{
  border-radius: 2px;
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  box-shadow: 0 1px 1px rgba(0,0,0,0.05);
  border-color: #ddd;
  .panel-heading{
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    color: #333333;
    background-color: #f5f5f5;
    border-color: #ddd;
    .panel-title{
      margin-top: 0;
      margin-bottom: 0;
      font-size: 16px;
      color: inherit;
    }
  }
  .panel-body{
    padding: 15px;
  }
}
  
</style>