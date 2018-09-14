<template>
  <div class="record">
    <div class="show">
      <div class="header">
        <h2>{{$t('account.record.title')}}</h2>
      </div>
      <div class="coin">
        <div class="l">
          {{$t('common.table.currency')}}
        </div>
        <div class="r">
          <span
            class="currency"
            :class="{ active: currency === item }"
            @click="handleFilter(item)"
            v-for="(item, index) in currencyList"
            :key="index"> {{item}} </span>
        </div>
      </div>
      <div class="table">
        <div class="date-picker">
          <span class="dateSelectCls">{{$t('common.selectDate')}}</span>
          <el-date-picker
            v-model="starttime"
            type="date"
            :editable="false"
            :clearable="false"
            @change="selectDate"
            :placeholder="$t('common.starDate')">
          </el-date-picker>
          <el-date-picker
            v-model="endtime"
            type="date"
            :editable="false"
            :clearable="false"
            @change="selectDate"
            :placeholder="$t('common.endDate')">
          </el-date-picker>
          <el-button type="success" size="small" :disabled="disabled" @click="_getDepositsWithdraws">{{$t('common.search')}}</el-button>
        </div>
        <ul class="list">
          <li class="head">
            <div>{{$t('common.type')}}</div>
            <div>{{$t('common.table.currency')}}</div>
            <div class="big">{{$t('common.time')}}</div>
            <div class="big">{{$t('common.count')}}</div>
            <div>{{$t('common.table.state')}}</div>
            <div>{{$t('common.table.confirmNumber')}}</div>
          </li>
          <li class="l1"
            v-for="(item, index) in tableData"
            :key="index">
            <div>{{$t('account.record.type.'+item.type)}}</div>
            <div>{{item.currency}}</div>
            <div class="big">{{$moment(item.createTime)._format()}}</div>
            <div class="big">{{item.amount.toFixed(8) + ' ' + item.currency}}</div>
            <div>{{$t('account.record.status.'+item.status)}}</div>
            <div v-if="item.type === 'deposits'">{{item.affirmCount}}</div>
            <div v-else>
              <router-link :to="'/account/record/details?type=withdraws&id=' + item._id" class="oprate">{{$t('common.check')}}</router-link>
            </div>
          </li>
          <li v-if="tableData.length === 0">
            <emptyBox :text="$t('common.noData')"></emptyBox>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {getCommon} from '@/api/advertisement.js'
import { getDepositsWithdraws } from 'api/account'
import emptyBox from '@/components/emptyBox.vue'
export default {
  components: {
    emptyBox
  },
  data () {
    return{
      days: 0,
      currencyList: [],
      arr2: [],
      tableData: [],
      disabled: true,
      starttime: null,
      endtime: null,
      currency: null
    }
  },
  computed: {
    getTypeChar () {
    }
  },
  methods: {
    selectCoin: function(index){
      this.selectIndex = index;

    },
    getCommon: function(){
      getCommon().then(res=>{
        this.currencyList = res.data.currency;
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    _getDepositsWithdraws() {
      var obj = {};
      if(this.starttime && this.endtime){
        obj = {
          startTime: this.starttime.getTime(),
          endTime: this.endtime.getTime() + 24 * 3600 * 1000
        }
      }
      
      // if(this.time){
      //   obj = {startTime: this.time[0].getTime(), endTime: this.time[1].getTime()}
      // }
      if (this.currency) obj.currency = this.currency
      getDepositsWithdraws(obj).then(data => {
        this.tableData = data.data
        this.tableData.sort((x1, x2) => {
          return x2.createTime - x1.createTime
        })
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
    },
    selectDate: function(){
      if(!this.starttime || !this.endtime){
        this.disabled = true;
        return;
      }
      this.days =  (this.endtime - this.starttime) / 24 / 60 / 60 / 1000;
      if(this.days > 30){
        this.$message.error(this.$t('common.dateover'));
        this.disabled = true;
      }else if(this.days < 0){ 
        this.$message.error(this.$t('common.dateless'));
        this.disabled = true;
      }
      else{
        this.disabled = false
      }
    },
    handleFilter(currency) {
      this.currency = currency
      this._getDepositsWithdraws()
    }
  },
  created() {
    //let t1 = new Date()
    // this.starttime = new Date(t1.setMonth(t1.getMonth() - 1))
    // this.endtime = new Date(t1.setMonth(t1.getMonth() + 1))
    this.getCommon();
    this._getDepositsWithdraws()
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

  .record {
    padding: 24px 16px;
    background-color: #f8f9fa;
    .date-picker {
      text-align: center;
      margin-top: 8px;
      margin-bottom: 16px;
    }
    .oprate {
      color: $color-theme;
    }
    .currency {
      margin: 0 8px;
      cursor: pointer;
      &:hover {
        color: $color-theme;
      }
      &.active {
        color: $color-theme!important;
      }
    }
    .show {
      margin-left: auto;
      margin-right: auto;
      width: 860px;
      border: 1px solid rgba(155,155,155,0.2);
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.09);
      border-radius: 4px;
      background-color: #fff;
      @media screen and (max-width: 860px) {
        width: 100%;
      }
      .header {
        padding: 8px 16px;
        border-bottom: 1px solid #EDEEF2;
      }
      .coin {
        display: flex;
        .l {
          padding: 12px;
          width: 26%;
          color: rgba(74,74,74,0.66);
          background-color: #efefef;
        }
        .r {
          padding: 12px;
          .selectCls{
            color: $color-theme;
          }
          span {
            cursor: pointer;
            padding-right: 30px;
            font-size: 16px;
            color: #4a4a4a;
            line-height: 1.8;
            &:hover {
              color: $color-theme;
            }
          }
        }
      }
      .table {
        padding: 20px;
        border-top: 1px solid #EDEEF2;
        .dateSelectCls{
          margin: 0 10px 0 0;
          color: #9B9B9B;
          font-weight: 400;
          font-size: 14px;
        }
        .el-button{
          margin-left: 10px;
        }
        .list {
          li {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            .big {
              width: 24%;
            }
            div {
              width: 13%;
            }
            .see {
              color: $color-theme;
              cursor: pointer;
            }
          }
          .head {
            border-bottom: 1px solid rgba(222,222,222,0.4);
            color: rgba(42,42,65,0.5);
          }
        }
      }
    }
  }
</style>
