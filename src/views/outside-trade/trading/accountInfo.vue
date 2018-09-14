<template>
  <div class="account-info">
    <h3 class="title">{{ $t('outside.trading.account.title') }}</h3>
    <div v-if="!qr" class="none">
      <p>{{ $t('outside.trading.account.no') }}</p>
      <icon class="icon" name="user-circle" scale="1.5"></icon>
    </div>
    <div v-else class="pay">
      <!-- <el-popover
        ref="popover-ali"
        placement="bottom-start"
        width="200"
        trigger="hover">
        <img class="pay-imgs" width="150" :src="qr.uploadfile">
      </el-popover>
      <el-popover
        ref="popover-we"
        placement="bottom-start"
        width="200"
        trigger="hover">
        <img class="pay-imgs" width="150" :src="qr.uploadfile">
      </el-popover>
      <el-popover
        ref="popover-bank"
        placement="bottom-start"
        width="200"
        trigger="hover">
        <img class="pay-imgs" width="150" :src="qr.uploadfile">
      </el-popover>
      <el-popover
        ref="popover-pal"
        placement="bottom-start"
        width="200"
        trigger="hover">
        <img class="pay-imgs" width="150" :src="qr.uploadfile">
      </el-popover> -->

      <el-button v-if="qr.payType === 'alipay'" plain size="small" >
        <img class="pay-img" src="~assets/image/payment_alipay.png">
        {{$t('pay.ali')}}
      </el-button>
      <el-button v-if="qr.payType === 'wechat'" plain size="small" >
        <img class="pay-img" src="~assets/image/payment_wechat.png">
        {{$t('pay.wechat')}}
      </el-button>
      <el-button v-if="qr.payType === 'unionpay'" plain size="small" >
        <img class="pay-img" src="~assets/image/payment_card.png">
        {{$t('pay.bank')}}
      </el-button>
      <el-button v-if="qr.payType === 'paypal'" plain size="small" >
        <img class="pay-img" src="~assets/image/payment_paypal.png">
        {{$t('pay.paypal')}}
      </el-button>

      <div  style="margin-top: 4px;">
        <img v-if="qr.uploadfile"  :src="qr.uploadfile" alt="" style="max-width: 150px;max-height: 150px;">
        <span v-else>{{qr.accountInfo}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    qr: ''
  }
}
</script>

<style lang="scss" scoped>
  .account-info {
    .title {
      padding-bottom: 16px;
      margin-bottom: 8px;
      border-bottom: 1px solid #eee;
    }
    .none {
      display: flex;
      justify-content: space-between;
      color: gray;
      .icon {
        cursor: pointer;
      }
    }
    .pay-img {
      height: 20px;
      vertical-align: middle;
    }
    .pay-imgs {
      width: 150px;
      text-align: center;
    }
  }
</style>
