<template>
  <layout>
    <div slot="head" class="head">
      <h1>{{ $t('account.record.detailTitle', {text: text}) }}</h1>
      <p class="p1">{{ $t('account.record.warn1', {text: text}) }}</p>
      <span class="warning">{{ $t('account.record.warn2', {text: text}) }}</span>
    </div>
    <div slot="body" class="body">
      <div class="card">
        <ul v-if="type === 'withdraws'" class="list">
          <li>
            <span class="title">{{$t('common.table.serial')}}</span>
            <span>{{data.withdrawsId}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.nowState')}}</span>
            <span>{{data.status}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.currency')}}</span>
            <span>{{data.currency}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.siteLabel')}}</span>
            <span>{{data.toRemark}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.withdrawSite')}}</span>
            <span>{{data.to}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.number')}}</span>
            <span>{{parseFloat(data.amount).toFixed(8) + ' ' +data.currency}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.cost')}}</span>
            <span>{{parseFloat(data.feeAmount).toFixed(8) + ' ' +data.feeCurrency}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.remark')}}</span>
            <span>{{data.userMessage}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.withdrawDate')}}</span>
            <span>{{$moment(data.createTime).format('YYYY-MM-DD HH:mm')}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.completeDate')}}</span>
            <span>{{$moment(data.completeTime).format('YYYY-MM-DD HH:mm')}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.hase')}}</span>
            <span>{{data.tradeHash}}</span>
          </li>
        </ul>
        <ul v-else class="list">
          <li>
            <span class="title">{{$t('common.table.nowState')}}</span>
            <span>{{data.depositsStatus}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.currency')}}</span>
            <span>{{data.currency}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.rechargeAddress')}}</span>
            <span>{{data.address}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.rechargeNumber')}}</span>
            <span>{{data.amount + ' ' +data.currency}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.rechargeTime')}}</span>
            <span>{{$moment(data.createTime).format('YYYY-MM-DD HH:mm')}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.completeDate')}}</span>
            <span>{{$moment(data.completeTime).format('YYYY-MM-DD HH:mm')}}</span>
          </li>
          <li>
            <span class="title">{{$t('common.table.hase')}}</span>
            <span>{{data.tradeHash}}</span>
          </li>
        </ul>
      </div>
      <div class="operate">
          <el-button @click="$router.go(-1)">{{$t('common.goBack')}}</el-button>
      </div>
    </div>
  </layout>
</template>

<script>
import { getDetails } from 'api/account'

export default {
  data() {
    return {
      data: {}
    }
  },
  created() {
    this.type = this.$route.query.type
    this.text = this.type === 'withdraws' ?  this.$t('common.table.withdraw') : this.$t('common.table.recharge')
    getDetails(this.$route.query).then(data => {
      this.data = data.data
    }).catch(data => {
      this.$message.error(this.$t(`err.${data.code}`))
    })
  }
}
</script>

<style lang="scss" scoped>
  .head {
    text-align: center;
    .warning {
      display: inline-block;
      padding: 16px 60px;
      background-color: #daedf7;
      color: #31708f;
    }
    .p1 {
      color: rgba(42,42,65,0.5);
    }
  }
  .body {
    text-align: center;
    background-color: #f8f9fa;
    .card {
      width: 480px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0px 1px 1px rgba(0,0,0,0.16);
      background-color: #fff;
      .list {
        li {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          span {
            width: 70%;
            padding-left: 10px;
            text-align: left;
            word-wrap: break-word;
          }
          .title {
            width: 30%;
            text-align: right;
            color: rgba(42,42,65,0.5);
          }
        }
      }
    }
    .operate {
      width: 480px;
      margin: 0 auto;
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid rgba(222,222,222,0.46);
    }
  }
</style>
