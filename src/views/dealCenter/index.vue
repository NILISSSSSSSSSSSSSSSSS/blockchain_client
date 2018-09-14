<template>
  <layout>
    <div slot="head" class="head container-box">
      <h1>交易大堂</h1>
      <p class="title">追踪正在进行中的交易</p>
      <div class="record">
        <div class="header">近期交易记录</div>
        <div class="body">
          <el-table
            :data="tradeData"
            style="width: 100%">
            <el-table-column
              prop="number"
              label="订单编号">
            </el-table-column>
            <el-table-column
              prop="money"
              label="交易金额">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="交易数量">
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态">
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <router-link to="/deal-center/offers">
            <el-button size="medium">全部广告</el-button>
          </router-link>
          <router-link to="/deal-center/orders">
            <el-button size="medium">全部订单</el-button>
          </router-link>
          <router-link to="/deal-center/transactions">
            <el-button size="medium">账户资金流水</el-button>
          </router-link>
        </div>
      </div>
    </div>
    <div slot="body" class="body container-box">
      <div class="sell">
        <h2>交易中卖单</h2>
        <order-list></order-list>
      </div>
      <div class="buy">
        <h2>交易中买单</h2>
        <order-list></order-list>
      </div>
    </div>
  </layout>
</template>

<script>
import OrderList from './components/orderList'

export default {
  components: {
    OrderList
  },
  data() {
    return {
      tradeData: [
        {
          number: '184c242a-3cb6',
          money: '100 CNY',
          amount: '2.02142391 EOS',
          state: '已完成'
        },
        {
          number: '16210475-ab45',
          money: '100 CNY',
          amount: '2.02142391 EOS',
          state: '已完成'
        },
        {
          number: 'eed8e4e1-a7a2',
          money: '100 CNY',
          amount: '2.02142391 EOS',
          state: '已完成'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .head {
    h1 {
      text-align: center;
    }
    .title {
      text-align: center;
      font-size: 16px;
      color: rgba(42,42,65,0.39);
    }
    .record {
      border: 1px solid #ddd;
      .header {
        padding: 10px 15px;
        font-size: 16px;
        background-color: #eeeff3;
      }
      .body {
        padding: 15px;
        border: 1px solid #ddd;
        border-left: 0;
        border-right: 0;
      }
      .footer {
        padding: 10px 15px;
        background-color: #eeeff3;
        text-align: right;
      }
    }
  }
  .body {
    .sell {
      margin-bottom: 60px;
    }
  }
</style>
