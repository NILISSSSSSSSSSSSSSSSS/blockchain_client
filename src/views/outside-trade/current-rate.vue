<template>
  <div class="current-rate">
    <el-card class="box-card">
      <div class="number">
        <p class="title">{{$t('rate.number')}}</p>
        <p class="content">{{ randomPeople }}</p>  
      </div>
      <div class="last">
        <p class="title">{{$t('rate.average', {currency: basicData.currency})}}</p>
        <p class="content">{{ basicData.averagePrice + ' ' + basicData.fiatCurrency }}</p>
      </div>
      <div class="price">
        <p class="title">{{$t('rate.market', {currency: basicData.currency})}}</p>
        <p class="content">{{ basicData.marketPrice + ' ' + basicData.fiatCurrency }}</p>
      </div>
      <p class="time">{{ basicData.timestamp }}</p>
      <div class="average">
        <p>average
          <icon class="icon" name="info-circle"></icon>
        </p>
        <ul>
          <li>Bitstamp</li>
          <li>Coinmarketcap</li>
          <li>Bitfinex</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAdvertsBasic } from 'api/outside-trade'
import { mapGetters } from 'vuex'

export default {
  props: {
    getAdverts: null
  },
  data() {
    return {
      basicData: {},
      params: {},
      onLineNumber:0,
    }
  },
  computed: {
    ...mapGetters(['basic']),
    randomPeople(){
        var url=this.getUrl();
        return url.includes('otcex.test.net') ||  url.includes('bibiex.io') ?  this.getRandom(1000,2000) : this.basicData.currOnlineNum;
    }
  },
  watch: {
    basic(val) {
      this.getAdver()
    }
  },
  methods: {
    getRandom(m,n){
     return parseInt(Math.random()*(n-m+1)+m);//生成一个从 m - n 之间的随机整数
    },
    getAdver: function(){
      this.params = JSON.parse(this.basic)
      getAdvertsBasic(this.params)
        .then(data => {
          this.basicData = data.data
          this.basicData.averagePrice = this.basicData.averagePrice.toFixed(6)
          this.basicData.marketPrice = this.basicData.marketPrice.toFixed(6)
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    }
  },
  created() {
    this.trade = this.$route.params.trade;
    this.tradeText = this.trade === 'buy' ? this.$t('common.nowBuy') : this.$t('common.nowSell')
    this.getAdver();

   
  
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';
  .current-rate {
    p {
      margin-top: 12px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 18px;
    }
    .content {
      font-size: 24px;
      color: $color-theme;
    }
    .time, .average {
      color: gray;
    }
    .average {
      ul {
        list-style: circle;
        li {
          margin-left: 30px;
        }
      }
      .icon {
        vertical-align: middle;
      }
    }
  }
</style>
