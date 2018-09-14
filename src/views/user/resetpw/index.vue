<template>
  <div class="reset-page">
    <h2>{{$t('resetpw.find')}}</h2>
    <el-tabs type="card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{$t('user.emailFind')}}</span>
        <ob-email></ob-email>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{$t('user.phoneFind')}}</span>
        <ob-phone></ob-phone>
      </el-tab-pane>
    </el-tabs>
    <div class="links-area text-center passwords-link">
      <hr>
      {{$t('resetpw.has')}}<router-link to="/user/login">{{$t('common.login')}}</router-link><br>{{$t('resetpw.no')}}<router-link to="/user/register">{{$t('common.register')}}</router-link>
    </div>

  </div>
</template>
<script>
import obEmail from './email.vue'
import obPhone from './phone.vue'
  export default {
    components: {
      obPhone,
      obEmail
    },
    data () {
      return {
        getCodeButton: '',
        code: null,
        isGetCode: true,
        email: '',
        isEmailTrue: false,
      }
    },
    created() {
      this.getCodeButton = this.$t('common.getCode')
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  .reset-page{
    max-width: 1200px;
    margin: auto;
    padding: 50px 16px;

    .links-area{
      color: #9B9B9B;
      margin: 60px 0 10px 0;
      text-align: center;
      hr{
        border: 0;
        border-top: 1px solid #eeeeee;
        margin: 10px 0px;
      }
      a{
        color: #43CB83;
      }
    }
  }
</style>
