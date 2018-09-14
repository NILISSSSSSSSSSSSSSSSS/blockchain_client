<template>
  <div class="reset">
    <label for="phone" style="font-size: 16px;line-height:22px;">{{$t('common.phone')}}</label>
    <el-input name="phone" v-model="phone"  @input="isPhone">
      <i v-if="isPhoneTrue" slot="suffix" class="el-icon-success state"></i>
      <i v-else slot="suffix" class="el-icon-error state-red"></i>
      <callCode slot="prepend" @callCode="getCallCode"></callCode>
    </el-input>
    <label for="verify_phone">{{$t('reg.code')}}</label>
    <el-input id="verify_phone" size="medium" v-model="code">
      <template slot="append">
        <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
          {{ getCodeButton }}
        </el-button>
      </template>
    </el-input>
    <label for="password_phone">{{$t('reg.password')}}</label>
    <el-input id="password_phone" size="medium" type="password" v-model="password" @input="isPassword">
      <i v-if="isPasswordTrue" slot="suffix" class="el-icon-success state"></i>
      <i v-else slot="suffix" class="el-icon-error state-red"></i>
    </el-input>

    <label for="password2_phone">{{$t('reg.confirmPw')}}</label>
    <el-input id="password2_phone" size="medium" type="password" v-model="password2" @input="isPassword2">
      <i v-if="isPassword2True" slot="suffix" class="el-icon-success state"></i>
      <i v-else slot="suffix" class="el-icon-error state-red"></i>
    </el-input>

    <el-button type="primary" class="submit_btn" @click.native="submit">{{$t('resetpw.reset')}}</el-button>

  </div>
</template>

<script>
  import callCode from '@/components/callCode.vue'
  export default {
    components: {
      callCode
    },
    data () {
      return {
        callCode: '',
        getCodeButton: '',
        code: '',
        isGetCode: true,
        phone: '',
        isPhoneTrue: false,
        password: null,
        isPasswordTrue: false,
        password2: null,
        isPassword2True: false,
      }
    },
    created() {
      this.getCodeButton = this.$t('common.getCode')
    },
    methods: {
      getCallCode(value) {
        this.callCode = value;
      },
      submit: function(){
        let errorInfo = null
        if (!this.isPhoneTrue) {
          errorInfo = this.$t('personcenter.verify.error.phone')
        } else if (!this.isPasswordTrue) {
          errorInfo = this.$t('reg.error.password')
        } else if (!this.isPassword2True) {
          errorInfo = this.$t('reg.error.password2')
        }else if(this.code.trim() == ''){
          errorInfo = this.$t('reg.error.code')
        }
        if (errorInfo) {
          this.$message.error(errorInfo);
          return;
        } 
        let data = {uniquekey: this.callCode + this.phone, code: this.code, password: this.sha1(this.password)}
        this.$http.post('/users/reset_password', data).then(res=>{
          if (res.data.code == 0) {
              this.$message.success(this.$t('common.resetSuccess'));
              this.$router.push('/user/login');
            } else {
              this.$message.error(this.$t(`err.${res.data.code}`));
            }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'));
        })
      },
      getCode () {
        let errorInfo = null
        if (!this.isPhoneTrue) {
          errorInfo = this.$t('common.emailErr')
        }
        if (errorInfo) {
          this.$message.error(errorInfo)
        } else {
          let data = {way: 'phone', uniquekey: this.callCode + this.phone}
          this._countDown();
          this.$http.post('/users/forget_password', data).then((res) => {
            
            if (res.data.code == 0) {
              
              this.$message.success(this.$t('common.emitMsg'));
            } else {
              this.$message.error(this.$t(`err.${res.data.code}`));
            }
          }).catch(err=>{
            this.$message.error(this.$t('common.serverErr'));
          })
        }
      },
      _countDown(second=60) {
        const self = this
        const end = new Date().getTime() + 1000 * second
        const timmer = setInterval(() => {
          this.isGetCode = true
          const differ = Math.floor((end - new Date().getTime()) / 1000)
          self.getCodeButton = `${this.$t('common.getCode')}(${differ})`
          if (differ < 1) {
            this.isGetCode = false
            self.getCodeButton = this.$t('common.getCode')
            clearInterval(timmer)
          }
        }, 500)
      },
      isPhone () {
        if(this.phone.trim() != '') {
          this.isGetCode = false
          this.isPhoneTrue = true
          return true
        } else {
          this.isPhoneTrue = false
          this.isGetCode = true
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

    .reset{
      width: 500px;
      margin-top: 30px;
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
      .submit_btn{
        width: 100%;
        box-shadow: 0 2px 4px 0 rgba(69, 146, 69, 0.5);
        border-radius: 4px;
        font-size: 16px;
        margin-top: 20px;
      }
      .el-input{
        margin: 10px 0 20px 0;
        i {
          position: relative;
          right: -16px;
          top: 6px;
        }
      }

    }
</style>
