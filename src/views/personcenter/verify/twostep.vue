<template>
  <el-card class="phone-verify">
    <pc-header :title="$t('personcenter.verify5')" slot="header"></pc-header>
    <div v-if="twoPhase">
      <untie></untie>
    </div>
    <div class="box" v-else>
      <div>
        <h2>{{$t('personcenter.verify.step1')}}</h2>
        <p>{{$t('personcenter.verify.step1text')}}</p>
        <el-popover
          ref="popover-iphone"
          placement="bottom-start"
          width="200"
          trigger="hover">
          <qrcode size="128" style="text-align: center;"
          value="https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8"></qrcode>
        </el-popover>
        <el-popover
          ref="popover-andriod"
          placement="bottom-start"
          width="200"
          trigger="hover">
          <qrcode size="128" style="text-align: center;"
          value="https://doc-1256300176.cos.ap-hongkong.myqcloud.com/com.google.android.apps.authenticator2_5.00.apk"></qrcode>
        </el-popover>

        <div class="download">
          <el-button plain size="small" v-popover:popover-iphone>
            {{$t('personcenter.iphoneDownload')}}
          </el-button>
          <el-button plain size="small" v-popover:popover-andriod>
            {{$t('personcenter.andriodDownload')}}
          </el-button>
        </div>
      </div>
      <div>
        <h2>{{$t('personcenter.verify.step2')}}</h2>
        <p>{{$t('personcenter.verify.step2text')}}</p>
        <p>{{$t('personcenter.andriodWarn')}}</p>
        <qrcode :value="qrcode" size="250"></qrcode>
        <p style="margin: 20px 0 5px 0;font-size: 14px;">{{$t('personcenter.verify.secret')}}</p>
        <el-input type="text" v-model="secret"></el-input>
        <p class="notice">{{$t('personcenter.verify.step2notice')}}</p>
      </div>
      <div>
        <h2>{{$t('personcenter.verify.step3')}}</h2>
        <p>{{$t('personcenter.verify.step3text')}}</p>
        <el-input :placeholder="$t('personcenter.verify.step3holder')" v-model="code"></el-input>
        <span class="notice">{{$t('personcenter.verify.step3notice')}}</span>
      </div>
      <el-button type="success" style="width: 100%;margin-top: 40px;" @click="submit">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-card>
</template>

<script>
  import pcHeader from '../components/pcHeader.vue'
  import untie from './components/Untie.vue'
  export default {
    components: {
      pcHeader,
      untie
    },
    data () {
      return {
        twoPhase: false,
        secret: '',
        qrcode: '',
        code: '',
      }
    },
    computed: {
    },
    methods: {
      submit: function(){
        if(this.code.trim() == ''){
          this.$message.error(this.$t('personcenter.verify.error.code'))
          return;
        }
        let data = {code: this.code}
        this.$http.post('/users/verify_twophase', data).then(res=>{

          if (res.data.code == 0) {
            this.$message.success(this.$t('personcenter.two'));
            this.$root.eventHub.$emit('updateUserInfo');
            this.$router.push('/personcenter');
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
            //this.getSecret();
          }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'));
        })
      },
      getSecret: function(){
        this.$http.get('/users/twophase').then(res=>{

          if (res.data.code == 0) {
            this.$message.success(this.$t('personcenter.get'));
            this.qrcode = res.data.data.qrStr
            this.secret = res.data.data.secret;
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`))
          }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'))
        })
      }
    },
    created () {
      if(JSON.parse(localStorage.userInfo).twoPhase){
        this.twoPhase = JSON.parse(localStorage.userInfo).twoPhase;
        return;
      }
      this.getSecret();
    }
  }
</script>

<style lang="scss" scoped>
  .phone-verify{
    width: 100%;
    .box{
      width: 60%;
      & > div{
        display: flex;
        flex-direction: column;
        h2{
          margin: 20px 0 10px 0;
        }
        p{
          font-size: 13px;
          margin-top: 0;
        }
        span{
          font-size: 13px;
        }
        .notice{
          color: #e92727
        }
      }
    }
    .el-input{
      width: 250px;
      margin-bottom: 10px;
    }
    .download {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .el-button {
        display: inline;
        width: 150px;
        margin-right: 20px;
      }
    }
  }
</style>
