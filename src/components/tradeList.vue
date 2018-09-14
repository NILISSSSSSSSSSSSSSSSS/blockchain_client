<template>
  <div class="tradeList" v-loading.fullscreen.lock="fullscreenLoading">
    <ul v-if="showData.length > 0">
      <li class="head">
        <div>{{$t('tradeList.name')}}</div>
        <div>{{$t('tradeList.credit')}}</div>
        <div>{{$t('tradeList.tradeType')}}</div>
        <div>{{$t('tradeList.limit')}}</div>
        <div>{{$t('tradeList.unit')}}</div>
        <div>{{$t('tradeList.oprate')}}</div>
      </li>
      <li v-for="(item, index) of showData" :key="index">
        <div class="name">
          <img :src="item.owner.avatar" width="28" height="28" v-if="item.owner.avatar" @click="$router.push('/user?id='+item.owner._id)">
          <img src="~assets/imgs/user_default_pic.png" alt="" width="28" height="28" v-else @click="$router.push('/user?id='+item.owner._id)">
          <router-link :to="'/user?id='+item.owner._id" class="username">{{ item.owner.name }}</router-link>
          <icon class="icon" name="check-circle"></icon>
          <p class="time">
            <icon class="line" name="circle"
              :class="{online: item.owner.isOnline}"></icon>
              
            {{ $t('tradeList.online', {time: $moment(item.owner.signinTime).startOf('hour').fromNow()}) }}
          </p>
        </div>
        <div class="credit">
          <p class="p1">{{ $t('tradeList.trading', {count: item.owner.tradeCount})  }}</p>
          <p class="p2">{{ $t('tradeList.good', {num: (item.owner.positiveRate * 100).toFixed(2)}) }}</p>
        </div>
        <div class="tradeType">
           <img v-for="(item, index) in item.allowPay" :key="index" :src="require('../assets/image/payment_'+item+'.png')" style="vertical-align: middle;">
           <img style="vertical-align:middle;width:15px;height:14px" :src="require('../assets/image/payment_USDT.png')" v-if="item.isUSDT">
        </div>
        <div class="tradeAmount">
          <p class="p1">
            {{ item.orderFloorPrice + '-' + item.orderCeilPrice }}
          </p>
          <p class="p2">{{ trade === 'buy' ? item.fiatCurrency : item.currency }}</p>
        </div>
        <div class="price">
          <p class="p1">{{ item.floatPrice.toFixed(6) }}</p>
          <p class="p2">{{
              item.fiatCurrency + ' / ' + item.currency
          }}</p>
        </div>
        <div class="handle">
          <router-link :to="'/outside-trade/orders/' + item._id">
            <el-button type="success" size="mini">
                {{ $t('tradeList.trade', {trade: trade === 'buy' ? $t('common.buy') : $t('common.sell')}) }}
            </el-button>
          </router-link>
        </div>
      </li>
    </ul>
    <emptyBox :text="$t('common.noData')" v-else></emptyBox>
    <el-pagination
      v-if="(count > pageSize)"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="count">
    </el-pagination>
  </div>
</template>

<script>
import { getAdverts } from 'api/tradeList'
import emptyBox from '@/components/emptyBox.vue'
export default {
  components: {
    emptyBox
  },
  props: {
    getAdverts: {},
    desc: ''
  },
  data() {
    return {
      fullscreenLoading: true,
      listData: [],
      showData: [],
      pageSize: 10,
      count: 0
    }
  },
  created() {

  },
  methods: {
    // 获取广告列表
    getAdverList: function(params){
        params.sort = this.desc;
        getAdverts(params).then(data => {
          this.fullscreenLoading=false;
          this.listData = data.data.list;
          this.count = data.data.count;
          this.showData = this.listData.slice(0, this.pageSize)
          console.log('---');
          
          console.log(this.showData)
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    changePage(val) {
      var params = this.$route.query;
      params.tradeType = this.$route.params.trade;
      params.page = val;
      this.getAdverList(params)
    },

  },
  watch: {
    '$route':{
      handler (val) {
        var params = val.query;
        params.tradeType = val.params.trade;
        this.trade = params.tradeType;
        this.getAdverList(params)
      },
      deep: true,
      immediate: true
    },
    'desc': {
      handler (val) {
        var params = this.$route.query;
        params.tradeType = this.$route.params.trade;
        this.getAdverList(params);
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';
  .tradeList {
    padding-top: 16px;
    border-top: 1px solid #eeeeee;
    p {
      margin: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      &.head {
        color: gray;
        padding: 0 16px;
      }
      div {
        width: 16%;
      }
      div:first-of-type {
        width: 24%;
      }
      div:last-of-type {
        width: 12%;
      }
    }
    ul>li:not(:first-child) {
      padding: 8px 10px 8px 10px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 2px 0 rgba(180,180,180,0.3);
      .name {
        img {
          border-radius: 50%;
          vertical-align: middle;
        }
        .username {
          vertical-align: middle;
        }
        .icon {
          vertical-align: middle;
        }
        .out {
          background-color: gray;
        }
        .time {
          margin: 0;
          font-size: 10px;
          color: gray;
          vertical-align: middle;
          .line {
            transform: translateY(4px);
          }
          .online {
            color: $color-theme;
          }
        }
      }
      .credit, .tradeAmount, .price {
        .p2 {
          font-size: 10px;
          color: gray;
        }
      }
      .tradeType {
        img {
          width: 20px;
          height: 20px;
        }
      }
      .handle {
        display: flex;
        align-items: center;
        a {
          color: #fff;
        }
      }
    }
    .el-pagination {
      text-align: center;
      margin-top: $distance-x1;
    }
  }
</style>
