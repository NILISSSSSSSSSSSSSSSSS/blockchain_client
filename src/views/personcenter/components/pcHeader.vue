<template>
  <div class="pageTitle" slot="header"><h3>{{title}}</h3><router-link to="/personcenter"><i class="el-icon-back"></i> {{$t('personcenter.return')}}</router-link></div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="scss" scoped>
  .pageTitle{
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3{
        margin: 0px;
        color: #2a2a41;
        font-size: 1.4em;
      }
      a{
        color: rgba(42,42,65,0.7);
        letter-spacing: 0.05em;
      }
    }
</style>

