<template>
  <div class="order-list">
    <ul class="list">
      <li class="header">
        <div>{{$t('common.table.unit')}}</div>
        <div class="number">{{$t('common.count')}}</div>
        <div class="total">{{$t('common.table.total')}}</div>
        <div>{{$t('common.table.charge')}}</div>
        <div>{{$t('common.table.state')}}</div>
        <div>{{$t('common.table.operate')}}</div>
      </li>
      <li  v-if="orderList.length == 0">
        <emptyBox :text="$t('dealCenter.orders.onOrders')"></emptyBox>
      </li>
      <div v-else>
      <li class="ll"
        v-for="(item, index) in orderList" :key="index">
        <div class="time">
          <span class="s1">{{item.createTime | datetimeFormat}}</span>
          <span class="s2">{{$t('dealCenter.orders.orderNumber')}} {{item.orderCode}}</span>
          <span class="s3">
            <span>{{$t('dealCenter.orders.otherName')}}</span>
            <router-link :to="'/user?id='+item.otherUserId">{{item.otherUserName}}</router-link>
          </span>
        </div>
        <div class="wrap">
          <div>{{item.unitPrice.toFixed(6)}} {{item.fiatCurrency}}</div>
          <div class="number">
            <span>{{$t('common.'+item.orderType)}} </span>{{item.amount.toFixed(8)}} {{item.currency}}
          </div>
          <div class="total">{{item.fiatCurrencyAmount.toFixed(6)}} {{item.fiatCurrency}}</div>
          <div>{{item.feeAmount.toFixed(8)}} {{item.feeCurrency}}</div>
          <div class="state">{{$t(`status['${item.orderStatus}']`)}}</div>
          <div>
            <router-link :to="'/outside-trade/trading/'+item.orderCode">
              {{$t('common.showDetail')}}
            </router-link>
          </div>
        </div>
      </li>
      <div class="pageBox">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="orderFilter.page?orderFilter.page: 1"
        :page-size="5"
        layout="prev, pager, next, jumper"
        :background="true"
        :total="listCount">
      </el-pagination>
    </div>
    </div>
    </ul>


  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import emptyBox from '@/components/emptyBox.vue'
export default {
  components: {
    emptyBox
  },
  data () {
    return {
      orderList: [],
      listCount: 1,
      pages: 1
    }
  },
  computed: {
    ...mapGetters(['orderFilter']),

  },
  methods: {
    ...mapMutations(['orderFilterHandle']),
    setPage() {
        console.log(this.orderFilter.page?this.orderFilter.page:1)
        return this.orderFilter.page?this.orderFilter.page:1
    },
    handleCurrentChange: function(currentPage){
      this.orderFilterHandle({key: 'page', val:currentPage});

    },
    getOrderList: function(filter){
      this.$http.get('/order/mine', {params:filter}).then(res=>{
        if(res.data.code == 0){
          this.listCount = res.data.data.orderCount;
          this.orderList = res.data.data.orders;
          this.page = Math.ceil(this.listCount / 10);
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    }
  },
  created() {
    this.getOrderList();
  },
  watch: {
    'orderFilter': {
      handler (val) {
        this.getOrderList(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

.order-list {
  .list {
    .header, .wrap {
      text-align: center;
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      & > div {
        width: 13%;
      }
      .number, .total {
        width: 24%;
      }
    }
    .ll {
      margin-bottom: 24px;
      border: 1px solid rgba(151,151,151,0.26);
      .time {
        padding: 9px 16px;
        color: rgba(74,74,74,0.5);
        background-color: #eeeff3;
        .s1 {
          margin-right: 16px;
        }
        .s3 {
          float: right;
        }
      }
      .wrap {
        padding: 0;
        background-color: #fff;
        .state {
          border-left: 1px solid rgba(151,151,151,0.32);
          border-right: 1px solid rgba(151,151,151,0.32);
        }
        .number {
          span {
            color: $color-theme;
          }
        }
        div {
          padding-top: 16px;
          padding-bottom: 16px;
        }
      }
    }
  }
  .pageBox{
    display: flex;
    justify-content: center;
  }
}
</style>
