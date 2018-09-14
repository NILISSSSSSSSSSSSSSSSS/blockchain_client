<template>
  <div class="trade-input">
    <div class="input-box">
      <el-row :gutter="20" v-if="(trade === 'sell')">
        <el-col :span="8">
          <p>{{ $t('outside.orders.input.fiat', {fiatCurrency: (usdt?'USDT':advertsDetails.fiatCurrency)}) }}？</p>
          <el-input
          @input="handleFiatAmount"
          v-model="fiatCurrencyAmount" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="2">
          <icon class="icon" name="arrow-right" scale="2"></icon>
        </el-col>
        <el-col :span="8">
          <p>{{ $t('outside.orders.input.currency', {currency: advertsDetails.currency}) }}</p>
          <el-input
          @input="handleCurrencyAmount"
          v-model="currencyAmount" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6" v-if="!usdt">
          <p>{{$t('outside.orders.input.tradeType')}}</p>
          <el-select v-model="tradeType" :placeholder="$t('common.pSelect')">
            <el-option
              v-for="item in advertsDetails.allowPay"
              :key="item"
              :label="$t('common.'+ item)"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-col :span="8">
          <p>{{ $t('outside.orders.input.sellCurrency', {currency: advertsDetails.currency}) }}？</p>
          <el-input
          @input="handleCurrencyAmount"
          v-model="currencyAmount" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="2">
          <icon class="icon" name="arrow-right" scale="2"></icon>
        </el-col>
        <el-col :span="8">
          <p>{{ $t('outside.orders.input.sellFiat', {fiatCurrency: (usdt?'USDT': advertsDetails.fiatCurrency)}) }}</p>
          <el-input
          @input="handleFiatAmount"
          v-model="fiatCurrencyAmount" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6" v-if="!usdt">
          <p>{{$t('outside.orders.input.tradeType')}}</p>
          <el-select v-model="tradeType" placeholder="请选择">
            <el-option
              v-for="item in advertsDetails.allowPay"
              :key="item"
              :label="$t('common.'+ item)"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <!--<p class="all">{{$t('outside.orders.input.all')}}</p>
    <p class="state">{{$t('outside.orders.input.state')}}</p>
    <hr>-->
  </div>
</template>

<script>
import { convert } from 'api/outside-trade'

export default {
  props: {
    trade: {
      type: String,
      default: 'buy'
    },
    advertsDetails: {
      type: Object,
      default: {}
    },
    id: '',
    usdt: '',
  },
  data() {
    return {
      fiatCurrencyAmount: 0,
      currencyAmount: 0,
      tradeType: null,
      tradeList: [],
      tradeText: ''
    }
  },
  watch: {
    tradeType (val) {
      if (val) this.$emit('handleTradeType', val)
    },
    usdt() {
      this.fiatCurrencyAmount = 0;
      this.currencyAmount = 0;
      this.$emit('clearAmount');
    }
  },
  created() {
    this.tradeText = this.trade === 'buy' ? this.$t('common.sell') : this.$t('common.buy');
    
  },
  destroyed() {
    clearInterval(window.time)
  },
  mounted() {
    window.time = setInterval(()=>{
      if(this.advertsDetails.allowPay.length > 0){
        this.tradeType = this.advertsDetails.allowPay[0];
        clearInterval(window.time)
      }
    }, 500)
    
  },
  methods: {
    handleFiatAmount() {
      let val = Number(this.fiatCurrencyAmount)
      if (isNaN(val)) {
        this.fiatCurrencyAmount = 0
        return
      }
      if (val == 0) return
      convert({id: this.id, amount: val, convertTo: 'currency'}).then(data => {
        if(this.usdt){
          this.currencyAmount = data.data.usdtAmount.toFixed(8)
          this.$emit('handleAmount', val, this.currencyAmount, 'currency', val)
        }else{
          this.currencyAmount = data.data.convertVal.toFixed(8)
          this.$emit('handleAmount', val, this.currencyAmount, 'currency', val)
        }
        
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    handleCurrencyAmount() {
      let val = Number(this.currencyAmount)
      if (isNaN(val)) {
        this.currencyAmount = 0
        return
      }
      if (val == 0) return
      convert({id: this.id, amount: val, convertTo: 'fiatCurrency'}).then(data => {
        console.log(this.usdt)
        if(this.usdt){
          console.log(data.data.usdtAmount)
          this.fiatCurrencyAmount = data.data.usdtAmount.toFixed(6)
          this.$emit('handleAmount', this.fiatCurrencyAmount, val, 'fiatCurrency', val)
        }else{
          this.fiatCurrencyAmount = data.data.convertVal.toFixed(6)
          this.$emit('handleAmount', this.fiatCurrencyAmount, val, 'fiatCurrency', val)
        }
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

  .trade-input {
    .el-col {
      p {
        margin-bottom: 8px;
        font-size: 10px;
        color: gray;
      }
      .icon {
        transform: translateY(44px);
        color: $color-theme;
      }
    }
    .all {
      margin-top: 16px;
      color: $color-theme;
      cursor: pointer;
    }
    .state {
      margin-top: 8px;
      font-size: 10px;
      color: gray;
    }
    hr {
      margin-top: 8px;
      margin-bottom: 16px;
      border: 0;
      border-top: 1px solid #eee;
    }
  }
</style>
