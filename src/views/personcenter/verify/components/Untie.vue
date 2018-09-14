<template>
  <div class="untie">
    <p>{{$t('common.hasBind')}}</p>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane :label="$t('login.phone')" name="phone">
        <div class="form">
          <phone></phone>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('login.email')" name="mail">
        <div class="form">
          <mail></mail>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import phone from './phone.vue';
  import mail from './mail.vue'
  export default{
    components: {
      phone,
      mail
    },
    data() {
      return {
        activeName: 'phone'
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
.untie{
  .form{
    width: 600px;
    .el-input{
      width: 100%;
      margin: 10px 0 20px 0;
    }
  }
}
</style>
