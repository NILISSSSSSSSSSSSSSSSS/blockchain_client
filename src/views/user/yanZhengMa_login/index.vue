<template>
  <div class="loginRegister-page">
    <h2 class="big-title">{{$t('login.yanZhengMaLogin')}}</h2>
    <el-form class="form">
      <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane :label="$t('login.type.phone')" name="phone"><phone ></phone></el-tab-pane>
        <el-tab-pane :label="$t('login.type.email')" name="mail"><mail  ></mail></el-tab-pane>
      </el-tabs>
      <!--两步验证显示-->
      <!-- <div v-else style="width: 600px">
        <label for="code">{{ $t('login.twostep') }}</label>
        <el-input id="code" v-model="code" @input="twoPhase">
        </el-input>
        <div style="font-size: 13px;margin-bottom:13px;">{{ $t('login.please') }} {{ expire | datetimeFormat }} {{ $t('login.login') }}</div>
      </div> -->
      <p>
        <router-link to="/user/resetpw">{{$t('login.forgetPw')}}</router-link>
        <!-- 密码登录 -->
        <router-link to="/user/login"  class="yanZhengMa_login">{{$t('login.passwordLogin')}}</router-link>
      </p>
      <p>{{$t('login.newUser', {siteName: $store.state.common.siteName})}}
        <router-link to="/user/register">{{$t('login.regNow')}}</router-link>
      </p>
    </el-form>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import phone from "./phone.vue";
import mail from './mail.vue'
export default {
  components: {
    phone,
    mail
  },
  data() {
    return {
      name: "",
      succeed: "succeed",
      defeated: "defeated",
     
     
      disabled: true,
      activeName: "phone",
     
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  methods: {
    ...mapMutations(["setToken"]),
 
  },
  created() {
    if (this.token) {
      this.$router.push("/");
    }
    setTimeout(() => {
      this.name = "";
    }, 2000);
    // this.$t('common.login')
    // console.log()
  }
};
</script>

<style lang="scss" scoped>
.yanZhengMa_login{
      font-size: 14px;
    text-decoration: underline;
    float: right;
}

.loginRegister-page {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 50px 16px;
  .state:before {
    position: relative;
    right: -10px;
    color: #67c23a;
  }
  .state-red:before {
    position: relative;
    right: -10px;
    color: #f56c6c;
  }
  h2 {
    font-size: 20px;
    span {
      display: block;
      font-size: 16px;
      color: #878d99;
    }
  }
  .form {
    margin-top: 30px;
    .el-tabs{
      padding-bottom: 40px;
    }
    a {
      color: #409eff;
    }
    a:hover {
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
       width: 605px;
    }
    .el-button {
      height: 50px;
      box-shadow: 0 2px 4px 0 rgba(69, 146, 69, 0.5);
      border-radius: 4px;
      width: 100%;
      font-size: 16px;
    }
  }
}
</style>
