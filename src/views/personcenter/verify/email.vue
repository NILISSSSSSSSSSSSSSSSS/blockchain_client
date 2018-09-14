<template>
  <el-card class="mail-verify">
    <pc-header :title="$t('personcenter.verify2')" slot="header"></pc-header>
    <div v-if="existEmail" class="existPhone">
      <div v-if="getOldCodePage">
        <p>{{$t('common.hasBindEmail', {existEmail:existEmail})}}</p>
        <el-form class="form" :model="oldForm" :rules="oldFormRules" ref="oldForm">
          <el-form-item prop="code">
            <label for="verify">{{$t('common.code')}}</label>
            <el-input id="verify" size="medium" v-model="oldForm.code" @input="verifyOldCode">
              <template slot="append">
                <el-button type="primary" @click="getOldCode" :disabled="isGetOldCode" ref="code">
                  {{ getCodeButton }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <el-form class="form" :model="newForm" :rules="newFormRules" ref="newForm" v-else>
        <el-form-item prop="email">
          <label for="email">{{$t('common.newEmail')}}</label>
          <el-input id="email" type="text" size="medium" v-model="newForm.email" @input="_isEmail2">
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <label for="verify">{{$t('common.code')}}</label>
          <el-input id="verify" size="medium" v-model="newForm.code">
            <template slot="append">
              <el-button type="primary" @click="getNewCode" :disabled="isGetCode" ref="code">
                {{ getCodeButton }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-button type="success" style="width: 100%;letter-spacing: 1px;margin-top: 10px;" @click="submitChange()">{{$t('common.confirm')}}</el-button>
      </el-form>

    </div>
    <el-form class="form" v-else>
      <label for="email">{{$t('common.email')}}</label>
      <el-input id="email" type="text" size="medium" @input="_isEmail" v-model="email">
        <i v-if="isEmailTrue" slot="suffix" class="el-icon-success state"></i>
        <i v-else slot="suffix" class="el-icon-error state-red"></i>
      </el-input>
      <label for="verify">{{$t('common.code')}}</label>
      <el-input id="verify" size="medium" v-model="code">
        <template slot="append">
          <el-button type="primary" @click="bindEmailMsg" :disabled="isGetCode" ref="code">
            {{ getCodeButton }}
          </el-button>
        </template>
      </el-input>

      <el-button type="success" style="width: 100%;letter-spacing: 1px;margin-top: 10px;" @click="submit()">{{$t('common.confirm')}}</el-button>
    </el-form>
  </el-card>

</template>

<script>
import pcHeader from "../components/pcHeader.vue";
import {changeBindCode, verifyCode, changeBind} from '@/api/bind';
import {bindEmailMsg, bindEmail} from '@/api/bind';
import {delCookie} from '@/plugins/cookie'
export default {
  components: {
    pcHeader
  },
  data() {
    return {
      getOldCodePage: true,
      existEmail: false,
      isEmailTrue: false,
      validate: false,
      email: "",
      isGetOldCode: false,
      isGetCode: true,
      code: "",
      getCodeButton: "",
      newForm: {
        email: "",
        code: ""
      },
      oldForm: {
        code: ""
      },
      newFormRules: {
        email: [
          {
            type: "email",
            required: true,
            message: "",
            trigger: "change"
          }
        ],
        code: [
          {
            type: "string",
            required: true,
            len: 6,
            message: "",
            trigger: "change"
          }
        ]
      },
      oldFormRules: {
        code: [
          {
            type: "string",
            required: true,
            len: 6,
            message: "",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    verifyOldCode() {
      if(this.oldForm.code.length == 6){
        let data = {
          authMode: "email",
	        authCode: this.oldForm.code
        }
        verifyCode(data).then(res=>{
          this.getOldCodePage = false;
          this._countOver();
        }).catch(err=>{
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        })
      }
      
    },
    getOldCode() {
      this._countDown();
      let data = {
        authMode: "email"
      }
      changeBindCode(data).then(res=>{
        this.$message.success(this.$t("personcenter.send"));
      }).catch(err=>{
        if (err.code) {
          this.$message.error(this.$t("err." + err.code));
          this._countOver();
        } else {
          this.$message.error(this.$t("err.undefined"));
        }
      })
    },
    getNewCode() {
      if(this.existEmail === this.newForm.email){
        this.$message.error(this.$t("err." + 30020));
        return;
      }
      this._countDown();
      let data = {
        authMode: "email",
        sendTo: this.newForm.email
      }
      changeBindCode(data).then(res=>{
        this.$message.success(this.$t("personcenter.send"));
      }).catch(err=>{
        if (err.code) {
          this.$message.error(this.$t("err." + err.code));
          this._countOver();
        } else {
          this.$message.error(this.$t("err.undefined"));
        }
      })
    },
    submitChange() {
      this.canSubmit();
      if(!this.validate){
        return;
      }
      let data = {
        oldAuthCode: this.oldForm.code,
        newAuthCode: this.newForm.code,
        changeVal: this.newForm.email,
        authMode: "email"
      }
      changeBind(data).then(res=>{
        delCookie('token');
        this.$router.push('/user/login')
      }).catch(err=>{
        if (err.code) {
          this.$message.error(this.$t("err." + err.code));
        } else {
          this.$message.error(this.$t("err.undefined"));
        }
      })
    },
    canSubmit() {
      let ruleForm = 'newForm'
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          console.log("right");
          this.validate = true;
        } else {
          console.log("error submit!!");
          this.validate = false;
        }
      });
    },
    submit: function() {
      if(this.code.trim() == ''){
        this.$message.error(this.$t('common.errCode'))
        return
      }
      let data = { code: this.code };
      bindEmail(data)
        .then(data => {
          this.$message.success(this.$t("common.success"));
          this.$root.eventHub.$emit("updateUserInfo");
          this.$router.push("/personcenter");
        })
        .catch(err => {
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        });
    },
    bindEmailMsg() {
      if(!this.isEmail){
        this.$message.error(this.$t('common.errEmail'));
        return;
      }
      let data = { email: this.email };
      this._countDown();
      bindEmailMsg(data)
        .then(data => {
          this.$message.success(this.$t("personcenter.send"));
        })
        .catch(err => {
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
            this._countOver();
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        });
    },
    _countDown(second = 60) {
      const self = this;
      const end = new Date().getTime() + 1000 * second;
      window.timmer = setInterval(() => {
        this.isGetCode = true;
        const differ = Math.floor((end - new Date().getTime()) / 1000);
        self.getCodeButton = `${this.$t("common.getCode")}(${differ})`;
        if (differ < 1) {
          this.isGetCode = false;
          self.getCodeButton = this.$t("common.getCode");
          clearInterval(timmer);
        }
      }, 500);
    },
    _countOver() {
      console.log("===================");
      this.isGetCode = false;
      this.getCodeButton = this.$t("common.getCode");
      console.log(window.timmer);
      clearInterval(window.timmer);
    },
    _isEmail: function() {
      console.log(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email))
      if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
        this.isEmail = true;
        this.isGetCode = false;
        return true;
      } else {
        this.isEmail = false;
        this.isGetCode = true;
      }
    },
    _isEmail2: function() {
      if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.newForm.email)) {
        this.isEmail = true;
        this.isGetCode = false;
        return true;
      } else {
        this.isEmail = false;
        this.isGetCode = true;
      }
    }
  },
  destroyed() {
    clearInterval(window.timmer);
  },
  created() {
    this.existEmail = JSON.parse(localStorage.userInfo).email;
    this.getCodeButton = this.$t("common.getCode");
  },
  mounted() {
    this.newFormRules.email[0].message = this.$t('common.errEmail')
    this.newFormRules.code[0].message = this.$t('common.errCode')
    this.oldFormRules.code[0].message = this.$t('common.errCode')
  }
};
</script>

<style lang="scss" scoped>
.mail-verify {
  width: 100%;
  .existPhone {
    span {
      color: #5fb45f;
    }
  }
  .form {
    width: 60%;
    .el-input {
      margin-top: 10px;
      margin-bottom: 20px;
      vertical-align: middle;
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
      i {
        position: relative;
        right: -13px;
        top: 6px;
      }
    }
  }
}
</style>
