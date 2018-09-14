<template>
  <div class="user-info">
    <div class="t">
      <div>
        <span class="title">{{$t('outside.orders.user.name')}}</span>
        <span class="val">{{ advertsDetails.owner.name }}</span>
        <i></i>
      </div>
      <div>
        <span class="title">{{$t('outside.orders.user.tradeCount')}}</span>
        <span class="val" v-if="advertsDetails.tradeSum">{{ advertsDetails.owner.tradeCount }}</span>
      </div>
      <div>
        <span class="title">{{$t('outside.orders.user.history')}}</span>
        <span class="val"  v-if="advertsDetails.tradeSum">{{advertsDetails.tradeSum.amount == 0? '0' : advertsDetails.tradeSum.amount.toFixed(8)}} {{advertsDetails.currency}}</span>
      </div>
      <div>
        <span class="title">{{$t('outside.orders.user.rate')}}</span>
        <span class="val" v-if="advertsDetails.owner.positiveRate">{{ (advertsDetails.owner.positiveRate*100).toFixed(2)+'%' }}</span>
      </div>
      <div>
        <span class="title">{{$t('outside.orders.user.comment')}}</span>
        <span class="val">{{ '+' + advertsDetails.owner.positiveComment + ' / ' + '-' + advertsDetails.owner.negativeComment}}</span>
      </div>
    </div>
    <ul class="b">
      <li class="head">
        <div class="b1">{{$t('outside.orders.user.unit')}}</div>
        <div class="b1">{{$t('outside.orders.user.limit')}}</div>
        <div class="b2">{{$t('outside.orders.user.tradeType')}}</div>
        <div class="b2">{{$t('outside.orders.user.date')}}</div>
        <div class="b3">{{$t('outside.orders.user.state')}}</div>
      </li>
      <li>
        <div class="b1" v-if="advertsDetails.floatPrice">{{
          advertsDetails.floatPrice.toFixed(6) + ' ' + advertsDetails.fiatCurrency + '/' + advertsDetails.currency
        }}<br/>
        <span v-if="advertsDetails.usdt_floatPrice && usdt">{{advertsDetails.usdt_floatPrice.toFixed(6) + ' ' + 'USDT' + '/' + advertsDetails.currency}}</span></div>
        <div class="b1">{{
          isSoldOut
        }}<br/><span v-if="usdt">{{isSoldOut2}}</span></div>
        <div class="b2">
           <img v-for="item in advertsDetails.allowPay" :key="item"  :src="require('../../../assets/image/payment_'+item+'.png')" style="vertical-align:middle;">
           <img style="vertical-align:middle;width:15px;height:14px;" :src="require('../../../assets/image/payment_USDT.png')" alt=""  v-if="advertsDetails.isUSDT">
        </div>
        <div class="b2">{{ $t('outside.orders.user.time', {time: advertsDetails.LockMinute / 1000 / 60}) }}</div>
        <div class="b3">{{$t('adver.status.'+advertsDetails.status)}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    advertsDetails: {
      type: Object,
      default: {}
    },
     usdt: '',
  },
  data() {
    return {
      owner: {},
      allowPay: []
    }
  },
  computed: {
    isSoldOut () {
      
      if(this.advertsDetails.orderFloorPrice > this.advertsDetails.orderCeilPrice){
        return this.$t('common.soldOut')
      }else{
        return `${this.advertsDetails.orderFloorPrice}  ~ ${this.advertsDetails.orderCeilPrice} ${(this.advertsDetails.tradeType === 'buy' ? this.advertsDetails.currency : this.advertsDetails.fiatCurrency)}`
      }
    },
    isSoldOut2 () {
      
      if(this.advertsDetails.orderFloorPrice > this.advertsDetails.orderCeilPrice){
        return ''
      }else{
        if(this.advertsDetails.tradeType === 'sell'){
          if(this.advertsDetails.usdtFloorPrice!=null && this.advertsDetails.usdtCeilPrice!=null){
            return `${this.advertsDetails.usdtFloorPrice==0?'0':this.advertsDetails.usdtFloorPrice.toFixed(6)}  ~ ${this.advertsDetails.usdtCeilPrice==0?'0':this.advertsDetails.usdtCeilPrice.toFixed(6)} USDT`
          }else{
            return ''
          }
        }else{
          return ''
        }
      }
    }
  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
  .user-info {
    margin: 10px 0 10px 0;
    padding: 16px 8px;
    border-radius: 4px;
    background-color: #f6f6f6;
    color: #4a4a4a;
    text-align: center;

    .t {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 12px;
        color: #9B9B9B;
      }
      .val {
        color: gray;
      }
      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #5cb85c;
      }
      div {
        width: 20%;
      }
    }

    .b {
      li {
        display: flex;
        justify-content: space-between;
        img {
          width: 20px;
        }
        div {
          width: 20%;
        }
      }
      .head {
        margin: 16px 0;
        padding: 4px 0;
        border-top: 3px solid #ededed;
        border-bottom: 1px solid #ededed;
        font-size: 12px;
        color: #9b9b9b;
      }
    }
  }
</style>
