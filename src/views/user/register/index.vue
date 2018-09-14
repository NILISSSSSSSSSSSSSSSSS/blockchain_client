<template>
  <div class="loginRegister-page">
    <el-alert
      v-if="activeName==='second'"
      :title="$t('reg.notice')"
      type="warning"
      show-icon>
    </el-alert>
    <el-alert
      v-if="activeName==='second'"
      :title="$t('reg.notice2')"
      type="warning"
      show-icon>
    </el-alert>
    <h2 class="big-title">
      {{$t('reg.newUser')}}
      <span>{{$t('reg.use', {siteName: $store.state.common.siteName})}}</span>
    </h2>
    <div class="form">
      <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane :label="$t('reg.type.phone')" name="first"><phone></phone></el-tab-pane>
        <el-tab-pane :label="$t('reg.type.email')" name="second"><mail></mail></el-tab-pane>
      </el-tabs>
      <p><router-link to="/user/resetpw">{{$t('reg.forgetPw')}}</router-link></p>
    </div>
  </div>
</template>
<script>
  import mail from './mail.vue'
  import phone from './phone.vue'
  export default {
    components: {
      mail,
      phone
    },
    data () {
      return {
        activeName: 'first'
      }
      if (errorInfo) {
        this.$message.error(errorInfo);
        return;
      }
      const url = "/users/verify_email";
      let data = { code: this.code, email: this.email };
      this.$http
        .post(url, data)
        .then(res => {
          //this._countDown()
          if (res.data.code == 0) {
            this.$router.push("/user/login");
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
    },
    created() {

    },
    mounted () {
    }
};
</script>
<style lang="scss" scoped>
  .loginRegister-page {
      max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        padding: 50px 16px;
    .state:before {
      position: relative;
      right: -10px;
      color: #67C23A;
    }
    .state-red:before {
      position: relative;
      right: -10px;
      color: #F56C6C;
    }
    h2 {
      font-size: 20px;
      font-weight: 400;
      span {
        display: block;
        font-size: 16px;
        color: #878D99;
      }
    }
    .form {
      margin-top: 30px;
      a{
          color: #409eff;
      }
      a:hover{
          color: #006bd9;
      }
      label {
        font-size: 16px;
      }
      .el-input {
        margin-top: 10px;
        margin-bottom: 20px;
        vertical-align: middle;
        i {
          position: relative;
          right: -14px;
          top: 6px;
        }
      }
      p {
        font-size: 12px;
        margin-top: 10px;
        margin-bottom: 0;
      }
      .getCode {
        cursor: pointer;
      }
      .regCls{
        height: 50px;
        box-shadow: 0 2px 4px 0 rgba(69,146,69,0.5);
        border-radius: 4px;
        width: 100%;
        font-size: 16px;
      }
    }
  }
</style>
