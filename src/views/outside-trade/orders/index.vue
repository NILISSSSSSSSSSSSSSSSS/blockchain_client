<template>
  <div class="orders">
    <el-card>
      <el-alert
        v-if="status !== 'online'"
        :title="statusText"
        type="error">
      </el-alert>
      <!-- 是否使用USDT支付复选框 -->
      <el-checkbox :label="usdtLabel" v-model="useUSDT" v-if="showUsdt"></el-checkbox>
      <!-- 表单 -->
      <trade-input
        :usdt="useUSDT"
        @clearAmount="clearAmount"
        @handleAmount="handleAmount"
        @handleTradeType="handleTradeType"
        :id="id"
        :trade="trade" :advertsDetails="advertsDetails"></trade-input>
        <!-- 交易说明 -->
      <trade-state :State="advertsDetails.desc"></trade-state>
      <!-- 浮动单价等信息 -->
      <user-info
        :advertsDetails="advertsDetails" :usdt="useUSDT">
        </user-info>
        <!-- 交易金额 -->
      <div class="verify">
        <p class="title">{{$t('outside.orders.index.tradeCount')}}</p>
        <div class="info">
          <p class="currency">{{currencyAmount + ' ' + advertsDetails.currency}}</p>
          <icon class="icon" name="arrows-h" scale="2"></icon>
          <p class="coin">{{fiatCurrencyAmount + ' ' + (useUSDT?'USDT':advertsDetails.fiatCurrency)}}</p>
        </div>
        <el-checkbox v-model="read" >{{$t('outside.orders.index.read')}}</el-checkbox>
        <el-button
          style="width: 15%;margin-top: 20px;"
          @click="handleCreate"
          :disabled="soldOut"
          type="success">{{ soldOut ? $t('common.soldOut'): $t('outside.orders.index.trade', {trade: tradeText}) }}
        </el-button>
      </div>
      <remark></remark>
    </el-card>
  </div>
</template>

<script>
import TradeInput from './tradeInput'
import TradeState from '../tradeState'
import UserInfo from './UserInfo'
import Remark from './remark'
import { mapMutations } from 'vuex'
import { getAdvertsDetails_pub, createTrade } from 'api/outside-trade'

export default {
  components: {
    TradeInput,
    TradeState,
    UserInfo,
    Remark
  },
  data() {
    return {
      showUsdt: false,
      isUSDT: false,
      useUSDT: false,
      usdtLabel: '',
      convertTo: null,
      convertAmount: null,
      read: false,
      advertsDetails: {
        owner: {},
        allowPay: [],
        floatPrice: 0
      },
      fiatCurrencyAmount: 0,
      currencyAmount: 0,
      tradeType: null,
      isDisabled: true,
      trade: '',
      tradeText: '',
      statusText: '',
      status: 'online',
      soldOut: false,
      configFiatBi:""
    }
  },
  watch: {

  },
  created() {
    this.setStep({steps: 2})
    this.id = this.$route.params.id
    this.configFiatBi= localStorage.getItem("configFiatBi");
    
    getAdvertsDetails_pub(this.id)
      .then(data => {
        this.advertsDetails = data.data
        if(this.advertsDetails.orderFloorPrice > this.advertsDetails.orderCeilPrice){
          this.soldOut = true; 
        }
        this.trade = data.data.tradeType
        this.status = data.data.status
        this.statusText = this.status === 'offline' ? this.$t('adver.offline') : this.$t('adver.delete')
        this.tradeText = this.trade === 'buy' ? this.$t('common.sell') : this.$t('common.buy')
        this.usdtLabel = this.trade === 'buy' ? this.$t('common.recieveUSDT1',{msg:this.configFiatBi}) : this.$t('common.useUSDT',{msg:this.configFiatBi})
        this.isUSDT = this.advertsDetails.isUSDT;
        this.isUSDT && (this.showUsdt = true)
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
  },
  methods: {
    ...mapMutations(['setStep']),
    clearAmount() {
      this.currencyAmount = 0;
      this.fiatCurrencyAmount = 0;
    },
    handleAmount(fiatCurrencyAmount, currencyAmount, convertTo, convertAmount ) {
      this.fiatCurrencyAmount = fiatCurrencyAmount
      this.currencyAmount = currencyAmount
      this.convertTo = convertTo;
      this.convertAmount = convertAmount;
    },
    handleTradeType(tradeType) {
      this.tradeType = tradeType
    },
    handleCreate() {
      if (!this.canSubmit()) return
      createTrade(this.useUSDT, this.id, this.tradeType, this.convertTo, this.convertAmount)
        .then(data => {
          this.$router.push(`/outside-trade/trading/${data.data.orderCode}`)
        }).catch(data => {
          if (data.code === 40011) {
            this.$alert(this.$t('err.40011'), this.$t('outside.noWallet'), {
              confirmButtonText: this.$t('outside.go'),
              callback: action => {
                this.$router.push('/account/wallets')
              }
            });
          }
          else this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    canSubmit() {
      this.isDisabled = true
      if (!this.read) {
        this.$message.error(this.$t('outside.noRead'))
        return false
      } else if (this.fiatCurrencyAmount <= 0) {
        this.$message.error(this.$t('outside.fiatErr'))
        return false
      } else if (!this.tradeType && !this.useUSDT) {
        this.$message.error(this.$t('outside.noSelect'))
        return false
      }
      this.isDisabled = false
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  .orders {
    a {
      color: #fff;
    }
    .verify {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding-bottom: 24px;
      border-bottom: 1px solid #eeeeee;
      .title {
        margin-bottom: 0;
        font-size: 12px;
        color: gray;
      }
      .info {
        display: flex;
        .currency, .coin {
          font-size: 22px;
          color: #43CB83;
        }
        .icon {
          margin: 0 8px;
          transform: translate(0, 17px);
          color: gray;
        }
      }
      .el-button {
        margin-top: 8px;
      }
    }
  }
</style>
