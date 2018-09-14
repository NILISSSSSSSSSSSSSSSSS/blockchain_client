<template>
  <el-form class="form">
    <label for="phone">{{type==='phone'?'更换手机号码':'更换电子邮箱'}}</label>
    <el-input id="phone" v-model="val" size="medium" @input="_isPhone">
      <i v-if="isPhone" slot="suffix" class="el-icon-success state"></i>
      <i v-else slot="suffix" class="el-icon-error state-red"></i>
    </el-input>
    <label for="phonepage_verify">{{$t('reg.code')}}</label>
    <el-input id="phonepage_verify" size="medium" v-model="code">
      <template slot="append">
        <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
          {{ getCodeButton }}
        </el-button>
      </template>
    </el-input>
    <el-button class="unite" type="primary" @click="uniteHandle" size="medium">{{$t('common.login')}}</el-button>
  </el-form>
</template>

<script>
export default {
  props: {
    type,

  },
  data() {
    return {
      name: "",
      val: "",
      isPhone: false,
      getCodeButton: '',
      isGetCode: false,
      code: '',
      disabled: true
    };
  },
  computed: {},
  methods: {
    _isPhone: function() {
      this.$emit('val', this.val)
      if (this.phone.trim() != "") {
        this.isPhone = true;
        return true;
      } else {
        this.isPhone = false;
      }
    },
    uniteHandle: function() {
      console.log(this._isPhone())
      if (!this._isPhone()) {
        this.$message.error(this.$t("login.error"));
        return;
      }
      this.$http
        .post("/users/signin", {
          //code: this.code,
          passwd: this.sha1(this.password),
          phone: this.phone
          // icode: this.icode
        })
        .then(res => {
          if (res.data.code === 0) {
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
    },
    getCode() {
      let errorInfo = null;
      if (!this._isPhone()) {
        errorInfo = this.$t("reg.error.phone");
      }
      if (errorInfo) {
        this.$message.error(errorInfo);
      } else {
        this._countDown();
        this.$http
          .post("/users/signup_moblie", {
            //code: this.code,
            passwd: this.sha1(this.password),
            // name: this.userName,
            phone: this.phone
            // icode: this.icode
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message.success(this.$t("common.emitMsg"));
            } else {
              this.$message.error(this.$t(`err.${res.data.code}`));
              this._countOver();
            }
          })
          .catch(err => {
            this.$message.error(this.$t("common.serverErr"));
            this._countOver();
          });
      }
    },
    _countDown(second = 60) {
      const self = this;
      const end = new Date().getTime() + 1000 * second;
      window.timmer = setInterval(() => {
        this.isGetCode = true;
        const differ = Math.floor((end - new Date().getTime()) / 1000);
        console.log(differ);
        self.getCodeButton = `${this.$t("common.getCode")}(${differ})`;
        if (differ < 1) {
          this.isGetCode = false;
          self.getCodeButton = this.$t("common.getCode");
          clearInterval(timmer);
          return;
        }
      }, 500);
    },
    _countOver() {
      this.isGetCode = false;
      this.getCodeButton = this.$t("common.getCode");
      console.log(window.timmer);
      clearInterval(window.timmer);
    }
  },
  mounted () {
    this.getCodeButton = this.$t('common.getCode')
  },
  created() {
  }
};
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
  margin-top: 30px;
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
  .unite {
    height: 50px;
    box-shadow: 0 2px 4px 0 rgba(69, 146, 69, 0.5);
    border-radius: 4px;
    width: 100%;
    font-size: 16px;
  }
}
</style>
