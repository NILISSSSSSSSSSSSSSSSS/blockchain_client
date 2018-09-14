<template>
  <div class="right">
    <el-popover ref="code" placement="bottom-start" width="280" trigger="hover" >
      <div v-if="$store.state.qrcode"><el-input readonly :value="inviUrl" style="width: 100%">
        <el-button class="paste" slot="append" plain size="mini"
            v-clipboard:copy="inviUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">{{$t('personcenter.copy')}}</el-button>
      </el-input>
      <qrcode :value="inviUrl" size="254" style="margin-top: 10px"></qrcode></div>
       <div v-else>{{$t('personcenter.mustNew')}}</div>
    </el-popover>
    <h3 class="rightTitle">{{$t('personcenter.my')}}
      <el-button style="float:right;" v-popover:code>{{$t('personcenter.invite')}}</el-button>
    </h3>

    <p class="split-blok">
      {{$t('personcenter.state1')}}&gt;「
      <router-link to="/account/wallets">{{$t('common.myWallets')}}</router-link>」
    </p>
    <div class="otb-deductible-fee">
      <h4>{{$t('personcenter.set')}}</h4>
      <div class="otb-deductible-fee-content">
        <div class="fee-content-left">
          <div class="otb-deductible-fee-text"> {{$t('personcenter.state2', {currency: officialCurrency})}}</div>
          <p class="otb-deductible-fee-tip">
            {{$t('personcenter.state3', {currency: officialCurrency})}}
            <router-link :to="'/outside-trade/index/buy?currency='+officialCurrency+'&fiatCurrency=CNY'">{{$t('personcenter.outside')}}</router-link>
          </p>
        </div>
        <div class="otb-deductible-fee-button">
          <el-switch v-model="useOurs" active-color="#13ce66" active-text="ON" inactive-text="OFF" @change="useCoin()"></el-switch>
        </div>
      </div>
      <h4>{{$t('personcenter.outsideSet')}}</h4>
      <router-link to="/personcenter/payment">
        <p class="user-account-setting-button">
          <span class="user-account-setting-button-title">{{$t('personcenter.set2')}}</span>
          <span class="user-account-setting-button-tip">{{$t('personcenter.set2State')}}</span>
        </p>
      </router-link>
      <h4>{{$t('personcenter.set3')}}</h4>
      <router-link to="/personcenter/notify">
        <p class="user-account-setting-button">
          <span class="user-account-setting-button-title">{{$t('personcenter.set3')}}</span>
          <span class="user-account-setting-button-tip">{{$t('personcenter.set3State')}}</span>
        </p>
      </router-link>
      <!--<router-link to="/">
            <p class="user-account-setting-button">
              <span class="user-account-setting-button-title">{{$t('personcenter.trust')}}</span>
              <span class="user-account-setting-button-tip">{{$t('personcenter.trustState')}}</span>
            </p>
          </router-link>
          <router-link to="/">
            <p class="user-account-setting-button">
              <span class="user-account-setting-button-title">{{$t('personcenter.blacklist')}}</span>
              <span class="user-account-setting-button-tip">{{$t('personcenter.blacklistState')}}</span>
            </p>
          </router-link>-->
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  components: {},
  data() {
    return {
      useOurs: true,
      inviUrl:'',
    };
  },
  computed: {
    ...mapGetters(['qrcode'])
  },
  methods: {
    useCoin: function() {
      this.$http
        .post("/users/switch_fee", { isOn: this.useOurs })
        .then(res => {
          if (res.data.code != 0) {
            this.$message.error(this.$t(`err.${res.data.code}`));
          } else {
            let userInfo = JSON.parse(localStorage.userInfo);
            userInfo.isOfficialFee = this.useOurs;
            localStorage.userInfo = JSON.stringify(userInfo);
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
    },
    onCopy: function (e) {
      this.$message({
        message: this.$t('adver.copySuccess'),
        type: 'success'
      });
    },
    onError: function (e) {
      this.$message.error(this.$t('adver.copyErr'));
    }
  },
  created() {
   console.log(this.qrcode);
   if(this.$store.state.qrcode){
     if(process.env.NODE_ENV == 'development'){
        this.inviUrl = `${this.serverIP}/invite/${this.$store.state.qrcode}`
      }else{
        this.inviUrl = `${window.location.protocol}//${window.location.host}/invite/${this.$store.state.qrcode}`
      }
   }
    if (
      localStorage.userInfo &&
      JSON.parse(localStorage.userInfo).isOfficialFee!=undefined
    ) {
      this.useOurs = JSON.parse(localStorage.userInfo).isOfficialFee;
    }
    this.officialCurrency = localStorage.officialCurrency || "";
  },
  watch: {
    '$store.state.qrcode' () {
      if(process.env.NODE_ENV == 'development'){
        this.inviUrl = `${this.serverIP}/invite/${this.$store.state.qrcode}`
      }else{
        this.inviUrl = `${window.location.protocol}//${window.location.host}/invite/${this.$store.state.qrcode}`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.right {
  width: 100%;
  padding: 10px 35px;
  background: #ffffff;
  border: 1px solid rgba(155, 155, 155, 0.2);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
  border-radius: 2px;
  min-height: 580px;
  overflow: auto;
  margin: 20px auto 30px;
  .rightTitle {
    margin-bottom: 0px;
    color: #2a2a41;
    font-size: 1.4em;
  }
  .split-blok {
    margin: 20px 0 -10px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(155, 155, 155, 0.2);
    a {
      color: #43cb83;
      &:hover {
        color: #2a985e;
      }
    }
  }
  .otb-deductible-fee {
    h4 {
      margin-top: 40px;
      font-size: 18px;
      a {
        font-size: 12px;
        color: #9b9b9b;
        border-bottom: 1px dashed #d8d8d8;
      }
    }
    .otb-deductible-fee-content {
      border: 1px solid #dedede;
      border-radius: 4px;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      .otb-deductible-fee-tip {
        padding: 2px 10px;
        background-color: #f6f6f6;
        border-radius: 4px;
        display: inline-block;
        color: #9b9b9b;
        font-size: 12px;
        margin: 10px 0 0 0;
        a {
          color: #43cb83;
        }
      }
    }
    .user-account-setting-button {
      border: 1px solid #dedede;
      border-radius: 4px;
      padding: 15px 25px;
      color: #4a4a4a;
      &:hover {
        border: 1px solid #dedede;
        border-radius: 4px;
        padding: 15px 25px;
        color: #4a4a4a;
        background-color: #f8f9fa;
      }
      .user-account-setting-button-title {
        width: 132px;
        display: inline-block;
        color: #3d3d3d;
      }
      .user-account-setting-button-tip {
        color: #9b9b9b;
        font-size: 12px;
      }
    }
  }
}
</style>

