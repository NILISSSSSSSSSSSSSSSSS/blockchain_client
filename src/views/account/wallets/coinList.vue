<template>
  <div class="coin-list">
    <div class="container-box">
      <ul v-if="showData.length > 0">
        <li class="head">
          <div>{{$t('common.table.currency')}}</div>
          <div>{{$t('common.table.total')}}</div>
          <div>{{$t('common.table.available')}}</div>
          <div>{{$t('common.table.orderFreeze')}}</div>
          <div>{{$t('common.table.lockAmount')}}</div>
          <div>{{$t('common.table.valuation')}}</div>
          <router-link tag="div" to="/account/record">{{$t('common.table.record')}}</router-link>
        </li>
        <li v-for="(item, index) of showData" :key="index">
          <div>{{ item.currency }}
            <span class="detail">{{ item.detail }}</span>
          </div>
          <div>{{ item.totalAmount.toFixed(8) }}</div>
          <div>{{ item.availableAmount.toFixed(8) }}</div>
          <div>{{ item.orderFreeze.toFixed(8) }}</div>
          <div>{{ item.lockAmount.toFixed(8) }}</div>
          <div>{{ item.valuation.toFixed(6) + ' USD' }}</div>
          <div>
            <!-- 提币 -->
              <el-button size="mini" @click="tiBi(item.currency)">{{$t('common.table.withdraw')}}</el-button>
            <!-- 充值 -->
            <el-button @click="recharge(item.currency)" size="mini" type="success">{{$t('common.table.recharge')}}</el-button>
            <!-- 锁仓 -->
            <router-link :to="'/account/savings?currency='+item.currency">
              <el-button size="mini">{{$t('common.table.locked')}}</el-button>
            </router-link>
          </div>
        </li>
      </ul>
      <empty-box v-else :text="$t('common.noData')"></empty-box>
    </div>
  </div>
</template>

<script>
import { isDeposits, getWalletsList, tiBiYanZheng } from "api/account";
import emptyBox from "@/components/emptyBox";
export default {
  components: {
    emptyBox
  },
  data() {
    return {
      coinData: [
        {
          coin: "BTC",
          detail: "Bitcoin",
          total: 1,
          can: 1,
          freeze: 0,
          locked: 0,
          value: "60000CNY"
        },
        {
          coin: "ETH",
          detail: "Bitcoin",
          total: 0,
          can: 0,
          freeze: 0,
          locked: 0,
          value: "0"
        },
        {
          coin: "EOS",
          detail: "EOS",
          total: 0,
          can: 0,
          freeze: 0,
          locked: 0,
          value: "0"
        }
      ],
      showData: []
    };
  },
  props: {
    hide: {
      type: Boolean,
      default: false
    },
    search: String
  },
  created() {
    getWalletsList()
      .then(data => {
        this.coinData = data.data.currencyList;
        this.showData = this.coinData;
        this.$emit("totalValuation", data.data.totalValuation);
      })
      .catch(data => {
        this.$message.error(this.$t(`err.${data.code}`));
      });
  },
  watch: {
    hide(val) {
      let coinData = this.coinData;
      console.log(coinData);
      if (this.search) {
        this.search = this.search.toLowerCase();
        coinData = coinData.filter(item => {
          return item.currency.toLowerCase().indexOf(this.search) > -1;
        });
        console.log(coinData);
      }
      
      if (val) {
        this.showData = coinData.filter(item => {
          return item.valuation > 0;
        });
      } else {
        this.showData = coinData;
      }
    },
    search(val) {
      let coinData = this.coinData;
      val = val.toLowerCase();
      if(this.hide) {
        coinData = coinData.filter(item => {
          return item.valuation > 0;
        });
      }
      if (val) {
        this.showData = coinData.filter(item => {
          return item.currency.toLowerCase().indexOf(val) > -1;
        });
      } else {
        this.showData = coinData;
      }
    }
  },
  methods: {
    // 提币
    tiBi(currency){
      tiBiYanZheng().then(data => {
          if(data.code === 0){
            this.$router.push('/account/withdraw?currency='+currency);
          }
       }).catch(data => {
         this.$message.error(this.$t(`err.${data.code}`));
        });
    },
    recharge(currency) {
      isDeposits(currency)
        .then(data => {
          if (data.data.hasAddress) {
            this.$router.push("/account/recharge?id=" + currency);
          } else {
            this.$router.push("/account/recharge/new?id=" + currency);
          }
        })
        .catch(data => {
          this.$message.error(this.$t(`err.${data.code}`));
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.coin-list {
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid transparent;
  background-color: #f8f9fa;
  .container-box {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px 15px 20px;
    .head {
      border-left: 0;
      border-right: 0;
      background-color: #f8f9fa;
    }
    li {
      display: flex;
      justify-content: space-between;
      padding: 6px 15px 6px 8px;
      border: 1px solid #eaeaea;
      border-top: 0;
      background-color: #fff;
      & > div {
        width: 14%;
      }
      & > div:first-of-type {
        width: 16%;
      }
      &:first-child {
        border: 0;
      }
      &:nth-child(2) {
        border-top: 1px solid #eaeaea;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      .el-button {
        margin-left: 2px;
        padding: 4px 6px;
      }
      .detail {
        margin-left: 4px;
        font-size: 12px;
        color: gray;
      }
    }
  }
}
</style>
