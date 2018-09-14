<template>
  <div class="tradeInfo">
    <div class="d1">
      <p class="title">
        {{$t('outside.trading.info.title', {
          name: tradeData.otherUserName,
          trade: tradeData.orderType === 'buy' ? $t('common.buy') : $t('common.sell'),
          currency: tradeData.currency})}}
      </p>
      <p class="number">{{$t('outside.trading.info.number', {number: tradeData.orderCode}) }}</p>
    </div>
    <div class="d2">
      <ul>
        <li class="head">
          <div>{{$t('outside.trading.info.amount')}}</div>
          <div>{{$t('outside.trading.info.tradeCount')}}</div>
          <div>{{$t('outside.trading.info.unit')}}</div>
          <div>{{$t('outside.trading.info.time')}}</div>
          <div class="l1">{{$t('outside.trading.info.tradeType')}}</div>
          <div class="l1">{{$t('outside.trading.info.state')}}</div>
        </li>
        <li class="info">
          <div>{{tradeData.fiatCurrencyAmount.toFixed(6) + (tradeData.isUSDT?'USDT':tradeData.fiatCurrency)}}</div>
          <div>{{tradeData.currencyAmount.toFixed(8) + ' ' + tradeData.currency}}</div>
          <div>{{tradeData.unitPrice.toFixed(6) + tradeData.fiatCurrency}}</div>
          <div>{{tradeData.expire | datetimeFormat}}</div>
          <div class="l1">
            <img :src="require('../../../assets/image/payment_'+tradeData.payType+'.png')" v-if="tradeData.payType">
          </div>
          <div class="l1">{{$t(`status['${tradeData.orderStatus}']`)}}</div>
        </li>
      </ul>
    </div>
    <div class="d3">
      <p class="state">
        {{$t('outside.trading.info.charge', {amount: tradeData.feeAmount == 0? 0: tradeData.feeAmount.toFixed(8)+tradeData.feeCurrency})}}
        <!--<icon class="icon" name="question-circle"></icon>-->
      </p>
      <div class="total">
        <p>{{$t('outside.trading.info.total')}}<span>{{ tradeData.fiatCurrencyAmount.toFixed(6) + (tradeData.isUSDT?'USDT':tradeData.fiatCurrency) }}</span></p>
        <p>{{$t('outside.trading.info.convert')}}<span>{{ tradeData.currencyAmount.toFixed(8) + tradeData.currency }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tradeData: {}
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>
  .tradeInfo {
    border-radius: 6px;
    box-shadow: 0 2px 4px 0 rgba(176,176,176,0.5);
    background-color: #f6f6f6;
    .d1 {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .title {
        font-size: 16px;
      }
      .number {
        font-size: 12px;
        color: gray;
      }
    }
    .d2 {
      img {
        width: 20px;
      }
      li {
        display: flex;
        justify-content: space-between;
        & > div {
          width: 20%;
        }
        .l1 {
          width: 10%;
        }
      }
      .head {
        padding: 8px 16px;
        border-top: 1px solid #eee;
      }
      .info {
        padding: 16px;
        background-color: #fff;
        div {
          word-wrap:break-word;
        }
      }
    }
    .d3 {
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      .icon {
        transform: translateY(2px);
        cursor: pointer;
      }
      .total {
        p {
          font-size: 12px;
          color: gray;
          span {
            font-size: 20px;
            color: #43CB83;
          }
        }
      }
    }
  }
</style>
