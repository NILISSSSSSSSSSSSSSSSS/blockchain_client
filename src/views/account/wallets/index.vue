<template>
  <div class="wallets">
    <div class="head container-box">
      <h2 class="title">{{ $t('account.wallets.title') }}
         <el-button v-if="senCoinIsShow()" size="small" type="success" style="float:right" @click.native="$router.push({path:'/account/mysendcoin', query: {yiJianFaBi:true}})">{{ $t('common.yiJianFaBi') }}</el-button>
      </h2>
      <div class="bottom">
        <div class="tab">
          <div class="all active">{{ $t('account.wallets.all') }}</div>
        </div>
        <div class="hide">
          <el-checkbox v-model="hide">{{ $t('account.wallets.hide') }}</el-checkbox>
          <el-input
            :placeholder="$t('account.wallets.placeholder')"
            prefix-icon="el-icon-search"
            size="mini"
            v-model="search">
          </el-input>
        </div>
        <div class="total">
          <p>{{ $t('account.wallets.total') }} <span>{{totalMoney.toFixed(6) + ' USD'}}</span></p>
        </div>
      </div>
    </div>
    <coin-list
      @totalValuation="totalValuation"
      :hide="hide" :search="search"></coin-list>
  </div>
</template>

<script>
import CoinList from './coinList'

export default {
  components: {
    CoinList
  },
  data() {
    return {
      hide: false,
      search: null,
      totalMoney: 0
    }
  },
  methods: {
       senCoinIsShow() {
        var url=this.getUrl()
         return url.includes('otcah.com') || url.includes('aaaex.vip') || url.includes('bibiex.io') ? false : true;
     },
    totalValuation(val) {
      this.totalMoney = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable";

  .wallets {
    .head {
      padding: 32px 15px 0;
      .bottom {
        display: flex;
        justify-content: space-between;
        .tab {
          display: flex;
          border: 1px solid #EAEAEA;
          border-bottom: 0;
          & > div {
            padding: 8px 25px;
            cursor: pointer;
          }
          & > div:hover {
            color: $color-theme;
            background-color: #f8f9fa;
          }
          .active {
            color: $color-theme;
            background-color: #f8f9fa;
          }
        }
        .hide {
          display: flex;
          .el-checkbox {
            line-height: 40px;
            margin-right: 16px;
          }
          .el-input {
            line-height: 40px;
            .el-input__prefix {
              transform: translate(-5px, 4px);
            }
          }
        }
        .total {
          p {
            margin: 4px 0;
            color: gray;
            font-size: 12px;
          }
          span {
            font-size: 16px;
            font-weight: bold;
            color: $color-text;
          }
        }
      }
    }
  }
</style>
