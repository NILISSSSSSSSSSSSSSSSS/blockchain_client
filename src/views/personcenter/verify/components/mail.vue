<template>
  <el-form class="form">
    <label for="verify">{{$t('reg.code')}}</label>
    <el-input id="verify" size="medium" v-model="code">
      <template slot="append">
        <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
          {{ getCodeButton }}
        </el-button>
      </template>
    </el-input>
    <el-button class="unite" type="primary" @click="uniteHandle" size="medium">{{$t('common.unite')}}</el-button>
  </el-form>
</template>

<script>
import {unbindMsg, unbind} from '@/api/bind'
export default {
  data() {
    return {
      name: "",
      email: "",
      isEmail: false,
      getCodeButton: "",
      isGetCode: false,
      code: "",
      disabled: true
    };
  },
  computed: {},
  methods: {
    uniteHandle: function() {
      let data = {
        authMode: 'email',
        authCode: this.code
      }
      unbind(data).then(res=>{
        this.$router.push('/personcenter');
        this.$root.eventHub.$emit('updateUserInfo');
      }).catch(err=>{
        if (err.code) {
          this.$message.error(this.$t("err." + err.code));
        } else {
          this.$message.error(this.$t("err.undefined"));
        }
      })
    },
    getCode() {
        this._countDown();
        let data = {authMode: 'email'}
        unbindMsg(data).then(res=>{
          this.$message.success(this.$t("personcenter.send"));
        }).catch(err=>{
          this._countOver();
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        })
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
    },
    _isEmail: function() {
      if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
        this.isEmail = true;
        return true;
      } else {
        this.isEmail = false;
      }
    }
  },
  destroyed() {
    clearInterval(window.timmer);
  },
  mounted () {
    this.getCodeButton = this.$t('common.getCode')
  },
  created() {
    // this.$t('common.login')
    // console.log()
  }
};
</script>

<style lang="scss" scoped>
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
  width: 600px;
  margin-top: 30px;
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
