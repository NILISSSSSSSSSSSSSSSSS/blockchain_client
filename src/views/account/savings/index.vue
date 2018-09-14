<template>
  <layout>
    <div slot="head" class="head container-box">
      <router-link tag="div" to="/account/wallets">
        <el-button type="info" plain size="mini">{{$t('account.return')}}</el-button>
      </router-link>
      <h1>{{ $t('account.savings.manage', {currency: currency}) }}</h1>
      <p class="p1">{{$t('account.savings.hint1')}}</p>
      <p class="p2">{{$t('account.savings.hint2')}}</p>
    </div>
    <div slot="body" class="body">
      <div class="container-box">
        <p class="title">
          {{ $t('account.savings.title', {currency: currency, unlockAmount: savings.unlockAmount.toFixed(8), lockAmount: savings.lockAmount.toFixed(8)}) }}
        </p>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane :label="$t('account.savings.locked')" name="first">
            <span>{{$t('account.savings.lockAmount')}}</span>
            <input class="number" v-model="lockAmount" type="number">
            <el-button type="success" size="mini" @click.native="lock">{{$t('common.confirm')}}</el-button>
          </el-tab-pane>
          <el-tab-pane :label="$t('account.savings.deblocking')" name="second">
            <span>{{$t('account.savings.deblockingAmount')}}</span>
            <input class="number" v-model="unlockAmount" type="number">
            <el-button type="success" size="mini"  @click.native="unlock">{{$t('common.confirm')}}</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  data() {
    return {
      savings: { //以前的
        curency: '',
        lockAmount: 0,
        unlockAmount: 0
      },
      lockAmount: '0',
      unlockAmount: '0',
      currency: null,
      activeName: 'first'
    }
  },
  methods: {
    get: function(){
      this.$http.get('/account/savings', {params: {currency: this.currency}}).then(res=>{
        if(res.data.code == 0){
          this.savings = res.data.data;
        }else{
          this.$message.error(this.$t(`err.${data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    },
    lock: function(){
      if(this.lockAmount== ''){
        this.$message.error(this.$t('account.savings.Nan'));
        return;
      }
      this.$http.post('/account/otb',{currency: this.currency, op: 'lock', amount: this.lockAmount}).then(res=>{
        if(res.data.code == 0){
          this.$message.success(this.$t('account.locked'));
          this.get();
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    },
    unlock: function(){
      if(this.unlockAmount== ''){
        this.$message.error(this.$t('account.savings.Nan'));
        return;
      }
      this.$http.post('/account/otb',{currency: this.currency, op: 'unlock', amount: this.unlockAmount}).then(res=>{
        if(res.data.code == 0){
          this.$message.success(this.$t('account.noLock'));
          this.get();
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    }
  },
  created() {
    this.currency = this.$route.query.currency;
    this.get();
  }
}
</script>

<style lang="scss" scoped>
  .head {
    .p1, .p2 {
      font-size: 16px;
      color: rgba(42,42,65,0.7);
      span {
        color: red;
      }
    }
  }
  .body {
    background-color: #f8f9fa;
    .container-box {
      text-align: center;
      width: 50%;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .number {
        padding: 4px;
      }
    }
  }
</style>
