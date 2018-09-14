<template>
  <el-card class="phone-verify">
    <pc-header :title="$t('personcenter.verify4')" slot="header"></pc-header>
    <!-- 如果手机号存在 -->
    <div v-if="existPhone" class="existPhone">{{$t('personcenter.verify.hasPhone')}}
      <div v-if="getOldCodePage">
        <span>{{existPhone}}</span>
        <p>{{$t('common.changeNumTip1')}}</p>
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
      <el-form class="form" :model="newForm"  ref="newForm" v-else>
        <el-form-item prop="phone">
          <label for="phone">{{$t('common.newPhone')}}</label>
          <el-input id="phone" type="number" size="medium" v-model="newForm.phone">
            <callCode slot="prepend" @callCode="getCallCode"></callCode>
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
        <el-button type="success" style="width: 100%;letter-spacing: 1px;margin-top: 10px;" @click="submitChange">{{$t('common.confirm')}}</el-button>
      </el-form>
    </div>
    <!-- 如果手机号不存在 -->
    <el-form class="form" v-else>
      <label for="phone">{{$t('common.phone')}}</label>
      <el-input id="phone" type="text" size="medium" @input="isPhone" v-model="phone">
        <callCode slot="prepend" @callCode="getCallCode"></callCode>
        <i v-if="isPhoneTrue" slot="suffix" class="el-icon-success state"></i>
        <i v-else slot="suffix" class="el-icon-error state-red"></i>
      </el-input>
      <label for="verify">{{$t('common.code')}}</label>
      <el-input id="verify" size="medium" v-model="code">
        <template slot="append">
          <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
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
import { phoneVerifyCode, phoneVerify } from "@/api/user";
import {changeBindCode, verifyCode, changeBind} from '@/api/bind';
import {delCookie} from '@/plugins/cookie'
import callCode from '@/components/callCode.vue'
export default {
  components: {
    pcHeader,
    callCode
  },
  data() {
    return {
      callCode: '',
      getOldCodePage: true,
      validate: false,
      existPhone: false,
      isPhoneTrue: false,
      newForm: {
        phone: '',
        code: ''
      },
      oldForm: {
        code: ''
      },
      phone: "",
      isGetOldCode: false,
      isGetCode: false,
      code: "",
      getCodeButton: "",
    
      oldFormRules: {
    
      }
    };
  },
  computed: {},
  methods: {
    getCallCode(value) {
      this.callCode = value;
    },
    verifyOldCode() {
      console.log(this.oldForm.code)
      if(this.oldForm.code.length == 6){
        let data = {
          authMode: "phone",
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
        authMode: "phone"
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
       if(this.newForm.phone.trim()==""){
         this.$message.error(this.$t("common.inputEmpty"));
         return;
      }
      // 验证新手机号码的格式
      if(!/^[1][3-9][0-9]{9}$/.test(this.newForm.phone)){
        this.$message.error(this.$t("reg.error.phone"));
         return;
      };

      this._countDown();
      let data = {
        authMode: "phone",
        sendTo: this.callCode + "" + this.newForm.phone
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
      if(this.newForm.phone.trim()==""){
         this.$message.error(this.$t("common.inputEmpty"));
         return;
      }
      // 验证新手机号码的格式
      if(!/^[1][3-9][0-9]{9}$/.test(this.newForm.phone)){
        this.$message.error(this.$t("reg.error.phone"));
         return;
      }
      let data = {
        oldAuthCode: this.oldForm.code,
        newAuthCode: this.newForm.code,
        changeVal: this.callCode + "" + this.newForm.phone,
        authMode: "phone"
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
    // canSubmit() {
    //   let ruleForm = 'newForm'
    //   this.$refs[ruleForm].validate(valid => {
    //     if (valid) {
    //       console.log("right");
    //       this.validate = true;
    //     } else {
    //       console.log("error submit!!");
    //       this.validate = false;
    //     }
    //   });
    // },
    submit: function() {
      if (!this.isPhoneTrue) {
        this.$message.error(this.$t("personcenter.verify.error.phone"));
        return;
      }
      if (this.code.trim() == "") {
        this.$message.error(this.$t("personcenter.verify.error.code"));
        return;
      }

      let data = { code: this.code };
      phoneVerify(data)
        .then(data => {
          this.$message.success(this.$t("personcenter.phoneSuccess"));
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
    getCode() {
         if(this.phone.trim()==""){
         this.$message.error(this.$t("common.inputEmpty"));
         return;
      }
      // 验证新手机号码的格式
      if(!/^[1][3-9][0-9]{9}$/.test(this.phone)){
        this.$message.error(this.$t("reg.error.phone"));
         return;
      };

      let data = { phone: this.callCode +''+ this.phone };
      this._countDown();
      phoneVerifyCode(data)
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
        this.isGetCode =this.isGetOldCode=true;
        const differ = Math.floor((end - new Date().getTime()) / 1000);
        self.getCodeButton = `${this.$t("common.getCode")}(${differ})`;
        if (differ < 1) {
          this.isGetCode=this.isGetOldCode=false;
          self.getCodeButton = this.$t("common.getCode");
          clearInterval(timmer);
        }
      }, 500);
    },
    _countOver() {
      console.log("===================");
      this.isGetCode=this.isGetOldCode=false;
      this.getCodeButton = this.$t("common.getCode");
      console.log(window.timmer);
      clearInterval(window.timmer);
    },
    isPhone() {
      if (this.phone.trim() != '') {
        this.isGetCode = false;
        this.isPhoneTrue = true;
        return true;
      } else {
        this.isPhoneTrue = false;
        this.isGetCode = true;
      }
    }
  },
  destroyed() {
    clearInterval(window.timmer);
  },
  created() {
    this.existPhone = JSON.parse(localStorage.userInfo).phone;
    this.getCodeButton = this.$t("common.getCode");
  },
  mounted() {
    // this.newFormRules.phone[0].message = this.$t('common.errPhone')
    // this.newFormRules.code[0].message = this.$t('common.errCode')
    // this.oldFormRules.code[0].message = this.$t('common.errCode')
  }
};
</script>

<style lang="scss" scoped>
.phone-verify {
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
