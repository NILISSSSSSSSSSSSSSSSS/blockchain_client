<template>
  <div class="trading">
    <el-card>
      <trade-info :tradeData="tradeData"></trade-info>
      <trade-state :state="tradeData.desc"></trade-state>
      <trade-remarks :remarks="tradeData.remark"></trade-remarks>
      <account-info :qr="tradeData.tradeQRCode"></account-info>
      <chat @system="system" :remark="remark" :orderCode="orderCode" @curSocketId="curSocketId"></chat>
      <operate
        @remark="remarkHandle"
        @updateState="updateState"
        :commentToMe="tradeData.commentToMe" :commentToOther="tradeData.commentToOther"
        :appealStatus="tradeData.appealStatus"
        :timeOut="timeOut" :trade="tradeData.orderType" :currency="tradeData.currency" :appealUser="tradeData.appealUser" :socketId="socketId"
        :orderCode="orderCode" :status="tradeData.status"
        :system="systemText"></operate>
    </el-card>
  </div>
</template>

<script>
import TradeInfo from './tradeInfo'
import TradeState from '../tradeState'
import TradeRemarks from '../tradeRemarks'
import AccountInfo from './accountInfo'
import chat from './chat'
import Operate from './operate'
import { mapMutations } from 'vuex'
import { getTradeDetails } from 'api/outside-trade'

export default {
  components: {
    TradeInfo,
    TradeState,
    TradeRemarks,
    AccountInfo,
    chat,
    Operate
  },
  data() {
    return {
      socketId: '',
      orderCode: '',
      remark: '',
      systemText: '',
      tradeData: {
        fiatCurrencyAmount: 0,
        currencyAmount: 0,
        unitPrice: 0,
        feeAmount: 0,
        orderType: '',
      },
      timeOut: 0,
      chat: {
        chat: [],
        userId: null
      },
    }
  },
  created() {
    this.setStep({steps: 3})
    const route = this.$route
    this.orderCode = route.params.id;
    //this.type = route.query.type
    //this.type = this.type === 'orderId' ? 'orderId' : 'orderCode'

    this._getTradeDetails()
  },
  methods: {
    ...mapMutations(['setStep', 'setBasic']),
    curSocketId: function(socketId) {
      console.log('index', socketId)
      this.socketId = socketId
    },
    system: function(text){
      this.systemText = text;
    },
    remarkHandle: function(msg){
      this.remark = msg;
    },
    updateState() {
      this._getTradeDetails()
    },
    getAppealUser(chat) {
      let length = chat.length;
      let appealUser = '';
      for(let i = length - 1; i >= 0; i--){
        if(chat[i].msgType === 'system' && chat[i].context === 'appeal'){
          if(chat[i].userId){
            appealUser = chat[i].userId;
            console.log('```````````````````'+ appealUser)
          }
          return appealUser
        }
      }
    },
    _getTradeDetails() {
      getTradeDetails(this.orderCode)
        .then(data => {
          this.tradeData = data.data;
          this.$set(this.tradeData, 'appealUser' ,this.getAppealUser(this.tradeData.chat));
          this.timeOut = new Date(this.tradeData.expire).getTime()
          let obj = {
            currency: data.data.currency,
            fiatCurrency: data.data.fiatCurrency,
            tradeType: data.data.orderType
          }
          localStorage.setItem('basic', JSON.stringify(obj))
          this.setBasic(JSON.stringify(obj))
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    }
  },
  watch: {
    '$route.params.id': function(val){
        this.orderCode = val;
        this._getTradeDetails()
      }
  }
}
</script>

<style lang="scss" scoped>

</style>
