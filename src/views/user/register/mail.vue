<template>
  <div class="loginRegister-page">
    
    <div class="form">
      <label for="email">{{$t('reg.email')}}</label>
      <el-input id="email" size="medium" type="email" v-model="email" @input="isEmail">
        <i v-if="isEmailTrue" slot="suffix" class="el-icon-success state"></i>
        <i v-else slot="suffix" class="el-icon-error state-red"></i>
      </el-input>

      <label for="password">{{$t('reg.password')}}</label>
      <el-input id="password" size="medium" type="password" v-model="password" @input="isPassword">
        <i v-if="isPasswordTrue" slot="suffix" class="el-icon-success state"></i>
        <i v-else slot="suffix" class="el-icon-error state-red"></i>
      </el-input>

      <label for="password2">{{$t('reg.confirmPw')}}</label>
      <el-input id="password2" size="medium" type="password" v-model="password2" @input="isPassword2">
        <i v-if="isPassword2True" slot="suffix" class="el-icon-success state"></i>
        <i v-else slot="suffix" class="el-icon-error state-red"></i>
      </el-input>

      <label for="verify">{{$t('reg.code')}}</label>
      <el-input id="verify" size="medium" v-model="code">
        <template slot="append">
          <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
            {{ getCodeButton }}
          </el-button>
        </template>
      </el-input>
      
      <div v-if="showInvite">
        <label for="inviteE">{{$t('reg.inviteCode')}}</label>
        <el-input v-model="inviteCode" id="inviteE"></el-input>
      </div>
      

      <el-button class="regCls" type="primary" size="medium" @click="register">{{$t('common.register')}}</el-button>
      <p><router-link to="/user/resetpw">{{$t('reg.forgetPw')}}</router-link></p>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showInvite: true,
        inviteCode: '',
        code: '',
        email: null,
        isEmailTrue: false,
        password: null,
        isPasswordTrue: false,
        password2: null,
        isPassword2True: false,
        isGetCode: true,
        succeedClass: 'succeed',
        defeatedClass: 'defeated',
        getCodeButton: '',
        icode: null
      }
    },
    computed: {

    },
    created() {
      if(this.$route.query.inviteCode){
        this.showInvite = false;
        this.inviteCode = this.$route.query.inviteCode
      }else{
        this.showInvite = true;
        this.inviteCode = '';
      }
    },
    mounted () {
      this.getCodeButton = this.$t('common.getCode')
    },
    methods: {
      register () {
        console.log(this.code)
        let errorInfo = null
        if(this.code.trim() == ''){
          errorInfo = this.$t('reg.error.code')
        }
        if (errorInfo) {
          this.$message.error(errorInfo);
          return;
        }
        const url = '/users/verify_email';
        let data = {code: this.code, email: this.email, inviteCode: this.inviteCode};
        this.$http.post(url, data).then((res) => {
            //this._countDown()
            if (res.data.code == 0) {
              this.$router.push('/user/login');
            } else {
              this.$message.error(this.$t(`err.${res.data.code}`))
            }
          }).catch(err=>{
            this.$message.error(this.$t('common.serverErr'));
          })
      },
      getCode () {
        let errorInfo = null
        if (!this.isEmailTrue) {
          errorInfo = this.$t('reg.error.email')
        } else if (!this.isPasswordTrue) {
          errorInfo = this.$t('reg.error.password')
        } else if (!this.isPassword2True) {
          errorInfo = this.$t('reg.error.password2')
        }

        if (errorInfo) {
          this.$message.error(errorInfo)
        } else {
          this._countDown();
          this.$http.post('/users/signup', {
            //code: this.code,
            passwd: this.sha1(this.password),
            // name: this.userName,
            email: this.email,
            // icode: this.icode
          }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t('user.pemail'));

            } else {
              this.$message.error(this.$t(`err.${res.data.code}`));
              this._countOver();
            }
          }).catch(err=>{
            this.$message.error(this.$t('common.serverErr'));
            this._countOver();
          })
        }
      },
      _countDown(second=60) {
        const self = this
        const end = new Date().getTime() + 1000 * second
        window.timmer = setInterval(() => {
          this.isGetCode = true
          const differ = Math.floor((end - new Date().getTime()) / 1000);
          console.log(differ)
          self.getCodeButton = `${this.$t('common.getCode')}(${differ})`
          if (differ < 1) {
            this.isGetCode = false
            self.getCodeButton = this.$t('common.getCode')
            clearInterval(timmer);
            return;
          }
        }, 500)
      },
      _countOver() {
          this.isGetCode = false
          this.getCodeButton = this.$t('common.getCode');
          console.log(window.timmer)
          clearInterval(window.timmer);
      },
      isEmail () {
        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
          this.isEmailTrue = true;
          this.isGetCode = false;
          return true
        } else {
          this.isEmailTrue = false;
          this.isGetCode = true;
        }
      },
      isPassword () {
        if (/^\w{6,18}$/.test(this.password)) {
          this.isPasswordTrue = true
          return true
        } else {
          this.isPasswordTrue = false
        }
      },
      isPassword2 () {
        if (this.password === this.password2) {
          this.isPassword2True = true
          return true
        } else {
          this.isPassword2True = false
        }
      },
    },
    destroyed() {
      clearInterval(window.timmer);
    },
  }
</script>
<style lang="scss" scoped>
  .loginRegister-page {
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
      width: 600px;
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
