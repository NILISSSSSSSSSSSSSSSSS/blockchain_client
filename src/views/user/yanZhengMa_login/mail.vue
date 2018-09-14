<template>
    <el-form class="form yanZhenMa_login">
        <label for="email">{{$t('login.email')}}</label>
        <el-input id="email" v-model="email" size="medium" @input="_isEmail">
          <!--<i slot="suffix" :class="[isEmail ? succeed : defeated]"></i>-->
          <i v-if="isEmail" slot="suffix" class="el-icon-success state"></i>
          <i v-else slot="suffix" class="el-icon-error state-red"></i>
        </el-input>
          <!-- //验证码 -->
       <label for="pwd_phone">{{$t('reg.code')}}</label>

        <el-input v-model="code" :placeholder="$t('account.refer.code')" @input="_isCode">
        <template slot="append">
          <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
            {{ getCodeButton }}
          </el-button>
          <i v-if="isCode"  slot="suffix" class="el-icon-success state" style="right:-10px;top: -2px;"></i>
          <i v-else slot="suffix" class="el-icon-error state-red" style="right:-10px;top: -2px;"></i>
        </template>
         
      </el-input>
  
        <el-button type="primary" class="login" @click="login" size="medium">{{$t('common.login')}}</el-button>
    </el-form>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import {yanZhengMa_login} from '@/api/user'
export default {
    data(){
      return {
        name: '',
        email: '',
        isEmail: false,
        isCode: false,
        succeed: 'succeed',
        defeated: 'defeated',
        disabled: true,


      getCodeButton: "",
       isGetCode: false,
       code: '',
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
     mounted() {
      this.getCodeButton = this.$t("common.getCode");
    },
    methods: {
        ...mapMutations([
          'setToken'
        ]),
        _isEmail: function(){
          if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
            this.isEmail = true;
            return true
          } else {
            this.isEmail = false;
          }
        },
        _isCode: function () {
           if (this.code.trim() != "") {
            this.isCode = true;
            return true;
          } else {
            this.isCode = false;
          }
        },
        login: function(){
            if (!this._isEmail() || !this._isCode()) {
              this.$message.error(this.$t('login.error3'))
              return
            }
            let data = {
              authMode: 'email',
              authCode: this.code,
              account: this.email,
            }
            yanZhengMa_login(data).then(data=>{
               console.log(data);
              
              if(data.data.token){
                this.$message.success(this.$t('user.success'));
                this.setCookie('token', data.data.token, null);
                 this.setCookie("loginTime", data.data.loginTime, null);
                this.setToken(data.data.token);
                this.$router.go({path: '/'});
              }
            }).catch(err=>{
              if (err.code) {
                this.$message.error(this.$t("err." + err.code));
              } else {
                this.$message.error(this.$t("err.undefined"));
              }
            })

        },
         // 验证码相关
       getCode() {
          if (!this._isEmail()) {
          this.$message.error(this.$t('login.error3'))
           return
        }
         const url = "/users/signin_sendcode";
        this._countDown();
        this.$http
          .post(url, {account: this.email,authMode:"email"})
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success(this.$t("account.send"));
            } else {
              this.$message.error(this.$t(`err.${res.data.code}`));
              this._countOver();
            }
          })
          .catch(err => {
            this.$message.error(this.$t("common.serverErr"));
            this._countOver();
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
            clearInterval(window.timmer);
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
  
    },
    created () {
      // this.$t('common.login')
      // console.log()
    }
}
</script>
<style>

   .yanZhenMa_login .el-input-group__append{
   padding-right: 0px;
}
</style>

<style lang="scss" scoped>


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
      span {
        display: block;
        font-size: 16px;
        color: #878D99;
      }
    }
    .form {
      width: 600px;
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
      .login.el-button {
        height: 50px;
        box-shadow: 0 2px 4px 0 rgba(69, 146, 69, 0.5);
        border-radius: 4px;
        width: 100%;
        font-size: 16px;
      }
    }
</style>
