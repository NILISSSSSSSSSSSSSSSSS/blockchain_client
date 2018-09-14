<template>
    <el-form class="form">
        <label for="email">{{$t('login.email')}}</label>
        <el-input id="email" v-model="email" size="medium" @input="_isEmail">
          <!--<i slot="suffix" :class="[isEmail ? succeed : defeated]"></i>-->
          <i v-if="isEmail" slot="suffix" class="el-icon-success state"></i>
          <i v-else slot="suffix" class="el-icon-error state-red"></i>
        </el-input>
        <label for="pwd">{{$t('login.password')}}</label>
        <el-input id="pwd" v-model="password" size="medium" type="password" @input="_isPassword" @keyup.enter.native="login">
          <!--<i slot="suffix" :class="[isPassword ? succeed : defeated]"></i>-->
          <i v-if="isPassword" slot="suffix" class="el-icon-success state"></i>
          <i v-else slot="suffix" class="el-icon-error state-red"></i>
        </el-input>
        <el-button type="primary" @click="login" size="medium">{{$t('common.login')}}</el-button>
    </el-form>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import {login} from '@/api/user'
export default {
    data(){
      return {
        name: '',
        email: '',
        password: '',
        isEmail: false,
        isPassword: false,
        succeed: 'succeed',
        defeated: 'defeated',
        disabled: true
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
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
        _isPassword: function () {
          if (/^\w{6,18}$/.test(this.password)) {
            this.isPassword = true
            return true
          } else {
            this.isPassword = false
          }
        },
        login: function(){
            if (!this._isEmail() || !this._isPassword()) {
              this.$message.error(this.$t('login.error'))
              return
            }
            let data = {
              authMode: 'email',
              passwd: this.sha1(this.password),
              email: this.email,
            }
            login(data).then(data=>{
              if(data.data.expire){
                this.$emit('showTwo', {expire: data.data.expire, email: this.email})
              }
              if(data.data.token){
                this.$message.success(this.$t('user.success'));
                this.setCookie('token', data.data.token, null);
                this.setToken(data.data.token);
                this.setCookie("loginTime", data.data.loginTime, null);
                this.$router.go({path: '/'});
              }
            }).catch(err=>{
              if (err.code) {
                this.$message.error(this.$t("err." + err.code));
              } else {
                this.$message.error(this.$t("err.undefined"));
              }
            })

        }
    },
    created () {
      // this.$t('common.login')
      // console.log()
    }
}
</script>

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
      .el-button{
        height: 50px;
        box-shadow: 0 2px 4px 0 rgba(69,146,69,0.5);
        border-radius: 4px;
        width: 100%;
        font-size: 16px;
      }
    }
</style>
