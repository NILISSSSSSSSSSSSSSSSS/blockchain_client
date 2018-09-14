<template>
  <layout>
    <div slot="head" class="head container-box">
      <h1>{{ $t('account.addsite.newSite', {currency: newSite.currency}) }}</h1>
       <!--<p class="state">
        {{ $t('account.addsite.noWay') }}
       <router-link to="#">
          {{ $t('account.addsite.why') }}
        </router-link>
      </p>-->
    </div>
    <div slot="body" class="body">
      <div class="container">
        <input class="input" type="text" v-model="newSite.toMark" :placeholder="$t('common.table.siteLabel')">
        <input class="input" type="text" v-model="newSite.to" :placeholder="$t('common.table.withdrawSite')">
        <div class="verify">
          <span class="line-text">{{ $t('account.addsite.confirm') }}</span>
          <label for="checked">
            <input type="checkbox" v-model="checked" id="checked">
            {{ $t('account.addsite.promise', {currency: newSite.currency}) }}
          </label>
          <p class="notice">{{ $t('account.addsite.warn') }}</p>
        </div>
        <div class="handle">
          <el-button type="success" @click.native="addSite" :disabled="!checked"
          :class="{notAllow: !checked}">{{ $t('account.addsite.create') }}</el-button>
        </div>
        <div class="handle">
          <router-link :to='"/account/withdraw?currency=" + newSite.currency'>
            <el-button>{{ $t('common.table.cancel') }}</el-button>
          </router-link>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  data() {
    return {
      newSite: {
        currency: '',
        to: null,
        toMark: null,
      },
      checked: false
    }
  },
  methods: {
    addSite: function(){
      for(var item in this.newSite){
        if(this.newSite[item] == ''){
          this.$message.error(this.$t('account.noData'));
          return;
        }else if (!this.checked){
          this.$message.error(this.$t('account.agree'));
        }
      }
      this.$http.post('/account/withdraws_add', this.newSite).then(res=>{
        if(res.data.code == 0){
          this.$message.success(this.$t('account.create'));
          this.$router.push({path:'/account/withdraw', query: {currency: this.newSite.currency}})
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    },

  },
  created () {
    this.newSite.currency = this.$route.query.currency;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

  .head {
    text-align: center;
    .state {
      color: rgba(42,42,65,0.5);
      a {
        color: $color-theme;
      }
    }
  }
  .body {
    text-align: center;
    background-color: #f9f8fa;
    .container {
      width: 400px;
      margin-right: auto;
      margin-left: auto;
      .input {
        display: block;
        margin-top: 24px;
        width: 100%;
        padding: 18px 10px;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        box-shadow: inset 0 1px 3px 0 rgba(178,178,178,0.5);
        outline: none;
      }
      .verify {
        position: relative;
        z-index: 90;
        margin-top: 40px;
        padding: 24px 0 0;
        border-top: 1px solid #E1E2EA;
        border-bottom: 1px solid #E1E2EA;
        .line-text {
          display: block;
          position: absolute;
          top: -10px;
          left: 160px;
          z-index: 99;
          padding: 0 16px;
          background-color: #f9f8fa;
          color: rgba(42,42,65,0.3);
        }
        .notice {
          font-weight: bold;
        }
      }
      .handle {
        margin-top: 24px;
        .el-button {
          width: 100%;
        }
        .notAllow{
          cursor: not-allowed !important;
        }
      }
    }
  }
</style>
