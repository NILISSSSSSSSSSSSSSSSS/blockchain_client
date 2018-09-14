<template>
  <el-card class="changepw">
    <pc-header :title="$t('personcenter.modifypw')" slot="header"></pc-header>
    <div class="notice">{{ $t('personcenter.warn', {num: 24}) }}</div>
    <div class="changepw_c">
      <label for="verify" >{{label}}</label>
      <el-input id="verify" size="medium" v-model="code" style="margin-top: 10px;" :placeholder="$t('transfer.code')">
        <template slot="append" v-if="method!='twoPhase'">
          <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
            {{ getCodeButton }}
          </el-button>
        </template>
      </el-input>
      <!-- <el-input type="password" v-model="originPwd" :placeholder="$t('personcenter.oldpw')"></el-input> -->
      <el-input type="password" v-model="newPwd" :placeholder="$t('personcenter.newpw')" @input="isPassword"></el-input>
      <el-input type="password" v-model="newPwd2" :placeholder="$t('personcenter.newpw2')"></el-input>
      <el-button type="success" @click="submit()">{{$t('personcenter.confirm')}}</el-button>
    </div>

  </el-card>
</template>

<script>
import pcHeader from './components/pcHeader.vue'
import {delCookie} from '@/plugins/cookie'
import {changepwMsg, changepw} from '@/api/bind'
export default {
  components: {
    pcHeader
  },
  data () {
    return {
      label: '',
      method: '',
      getCodeButton: "",
      isGetCode: false,
      code: "",
      newPwd: '',
      newPwd2: '',
      isPasswordTrue: false
    }
  },
  methods: {
    getCode() {
        this._countDown();
        let data = {authMode: this.method}
        changepwMsg(data).then(res=>{
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
    //修改密码
    submit () {
      if(!this.isPasswordTrue){
        this.$message.error(this.$t('common.passwordErr'))
        return;
      }else if(this.newPwd != this.newPwd2){
        this.$message.error(this.$t('personcenter.noSame'))
        return;
      }else if(this.code.trim() == ''){
        this.$message.error(this.$t('personcenter.verify.error.code'))
        return;
      }else{
        let data = {
          password: this.sha1(this.newPwd),
          authMode: this.method,
          authCode: this.code
        }
        console.log(data)
        changepw(data).then(res=>{
          this.$router.push('/personcenter');
          this.$root.eventHub.$emit('updateUserInfo');
          this.$message.success(this.$t('personcenter.modifySuccess'));
        }).catch(err=>{
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        })
        this.$http.patch(`/users/passwd`, {
          originPwd: this.sha1(this.originPwd),
          password: this.sha1(this.newPwd)
        }).then(res=>{
          if (res.data.code == 0) {
            this.$message.success(this.$t('personcenter.modifySuccess'));
            this.$router.push('/personcenter');
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'));
        })
      }
    },
    isPassword () {
      if (/^\w{6,18}$/.test(this.newPwd)) {
        this.isPasswordTrue = true
        return true
      } else {
        this.isPasswordTrue = false
      }
    },
  },
  destroyed() {
    clearInterval(window.timmer);
  },
  mounted () {
    this.getCodeButton = this.$t('common.getCode')
  },
  created() {
    if(JSON.parse(localStorage.userInfo).twoPhase){
      this.method = 'twoPhase'
      this.label = '两步验证'
    }else if(JSON.parse(localStorage.userInfo).phone){
      this.method = 'phone'
      this.label = '手机验证'
    }else if(JSON.parse(localStorage.userInfo).email){
      this.method = 'email'
      this.label = '邮箱验证'
    }else{
      this.delCookie('token');
      this.$router.push('/user/login')
    }
    console.log(this.method)
    
  }
}
</script>

<style lang="scss" scoped>
  .changepw{
    width: 100%;
    .notice{
      padding: 15px;
      background-color: #d9edf7;
      border-color: #bce8f1;
      color: #31708f;
      border: 1px solid transparent;
      margin-bottom: 30px;
    }
    .changepw_c{
      max-width: 360px;
      .el-input{
        width: 100%;
        margin-bottom: 15px;
        background-color: #F3F3F3;
        box-shadow: inset 0 1px 3px 0 rgba(178,178,178,0.5);
        border-radius: 4px;
      }
      .el-button{
        width: 100%;
      }
    }

  }
</style>

