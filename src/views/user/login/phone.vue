<template>
  <el-form class="form">
    <label for="phone">{{$t('login.phone')}}</label>
    <el-input id="phone" v-model="phone" size="medium" @input="_isPhone">
      <callCode slot="prepend" @callCode="getCallCode"></callCode>
      <!--<i slot="suffix" :class="[isEmail ? succeed : defeated]"></i>-->
      <i v-if="isPhone" slot="suffix" class="el-icon-success state"></i>
      <i v-else slot="suffix" class="el-icon-error state-red"></i>
    </el-input>
    <label for="pwd_phone">{{$t('login.password')}}</label>
    <el-input id="pwd_phone" v-model="password" size="medium" type="password" @input="_isPassword" @keyup.enter.native="login">
      <!--<i slot="suffix" :class="[isPassword ? succeed : defeated]"></i>-->
      <i v-if="isPassword" slot="suffix" class="el-icon-success state"></i>
      <i v-else slot="suffix" class="el-icon-error state-red"></i>
    </el-input>
    <el-button type="primary" @click="login"  size="medium">{{$t('common.login')}}</el-button>
  </el-form>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { login } from "@/api/user";
import callCode from "@/components/callCode.vue";
export default {
  components: {
    callCode
  },
  data() {
    return {
      callCode: "",
      name: "",
      phone: "",
      password: "",
      isPhone: false,
      isPassword: false,
      succeed: "succeed",
      defeated: "defeated",
      disabled: true
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  methods: {
    ...mapMutations(["setToken"]),
    getCallCode(value) {
      this.callCode = value
    },
    _isPhone: function() {
     if ((/^[1][3-9][0-9]{9}$/).test(this.phone)){
        this.isPhone = true;
        return true;
      } else {
        this.isPhone = false;
      }
    },
    _isPassword: function() {
      if (/^\w{6,18}$/.test(this.password)) {
        this.isPassword = true;
        return true;
      } else {
        this.isPassword = false;
      }
    },
    login: function() {
      if (!this._isPhone() || !this._isPassword()) {
        this.$message.error(this.$t("login.error2"));
        return;
      }
      let data = {
        authMode: "phone",
        passwd: this.sha1(this.password),
        phone: this.callCode + "" + this.phone
      };
      login(data)
        .then(data => {
          if (data.data.expire) {
            this.$emit("showTwo", {
              expire: data.data.expire,
              phone: this.callCode + "" + this.phone
            });
          }
          if (data.data.token) {
            this.$message.success(this.$t("user.success"));
            this.setCookie("token", data.data.token, null);
            this.setToken(data.data.token);
            this.setCookie("loginTime", data.data.loginTime, null);
            this.$router.go({ path: "/" });
          }
        })
        .catch(err => {
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        });
    }
  },
  created() {
    // this.$t('common.login')
    // console.log()
  }
};
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
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
  }
  .el-button {
    height: 50px;
    box-shadow: 0 2px 4px 0 rgba(69, 146, 69, 0.5);
    border-radius: 4px;
    width: 100%;
    font-size: 16px;
  }
}
</style>
