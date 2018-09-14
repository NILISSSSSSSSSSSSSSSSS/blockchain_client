<template>
  <div class="trade-index">
    <message></message>
    <solution-box :getAdverts="getAdverts"></solution-box>
    <div class="list">
      <div class="title">
        <p class="select">
          {{$t('outside.index.more')}}
          <span class="select-1" @click="sortByPrice()" :class="{'active': index==0}">
            {{priceType}}
          </span>
          |
          <span class="select-2" @click="sortByCredit" :class="{'active': index==1}">{{$t('outside.index.credit')}}</span>
        </p>
      </div>
    </div>
    <trade-list :getAdverts="getAdverts" :trade="trade" :desc="desc"></trade-list>

  </div>
</template>

<script>
import Message from './message'
import SolutionBox from './solution-box'
import TradeList from 'components/tradeList'
import { mapMutations, mapGetters } from 'vuex'

export default {
  components: {
    Message,
    SolutionBox,
    TradeList
  },
  data() {
    return {
      getAdverts: {},
      desc: 'priceAsc',
      index: 0,
      priceType: ''
    }
  },
  computed: {
    ...mapGetters(['common'])
  },
  watch: {
    '$route':{
      handler (val) {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.setStep({steps: 1})
  },
  methods: {
    ...mapMutations([
      'setStep',
      'setBasic'
    ]),
    sortByPrice: function(){
      this.index = 0;
      this.desc = 'priceAsc';
    },
    sortByCredit: function(){
      this.index = 1;
      this.desc = 'creditDesc';
    },
    init() {
      const route = this.$route
      this.getAdverts.tradeType = route.params.trade
      this.getAdverts.currency = route.query.currency
      this.getAdverts.fiatCurrency = route.query.fiatCurrency
      this.trade = route.params.trade;
      this.priceType = this.trade == 'buy' ? this.$t('outside.priceLow') : this.$t('outside.priceHigh')
      localStorage.setItem('basic', JSON.stringify(this.getAdverts))
      this.setBasic(JSON.stringify(this.getAdverts))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';

  .trade-index {
    & > div {
      margin-bottom: $distance-x3;
    }
    .list {
      margin-bottom: $distance-x1;
      .title {
        display: flex;
        justify-content: space-between;
        p {
          margin: 0;
        }
      }
      .select {
        font-size: 18px;
        font-weight: bold;
        span {
          color: rgba(42,42,65,0.5);
        }
        span:hover {
          color: $color-text;
          cursor: pointer;
        }
        .active {
          color: $color-text;
        }
      }
    }
  }
</style>
