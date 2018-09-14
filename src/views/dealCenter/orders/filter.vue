<template>
  <div class="order-filter">
    <div>
      <div class="l">{{$t('dealCenter.orders.orderId')}}</div>
      <div class="r">
        <el-input :placeholder="$t('common.please')" v-model="order" class="input-order">
          <el-button slot="append" icon="el-icon-search" @click.native="setOrderCode"></el-button>
        </el-input>
      </div>
    </div>
    <div>
      <div class="l">{{$t('common.all')}}</div>
      <div class="r">
        <span class="s1" @click="clearAllCondition">{{$t('dealCenter.all')}}</span>
      </div>
    </div>
    <div>
      <div class="l">{{$t('dealCenter.orders.classify')}}</div>
      <div class="r">
        <span class="s1" v-for="(item, index) in typeList" :key="index" :class="{selectCls: typeIndex==index}" @click="typeSelect(index)">{{$t('dealCenter.orders.classifyType', {text: item.label})}}</span>
      </div>
    </div>
    <div>
      <div class="l">{{$t('dealCenter.orders.state')}}</div>
      <div class="r">
        <span class="s1" v-for="(item, index) in statusList" :key="index" :class="{selectCls: statusIndex==index}" @click="statusSelect(index)">{{$t('dealCenter.orders.status', {text: item.label})}}</span>
      </div>
    </div>
    <div>
      <div class="l">{{$t('common.table.currency')}}</div>
      <div class="r">
        <span class="coin" v-for="(item, index) in currencyList" :key="index" :class="{selectCls: currencyIndex==index}" @click="currencySelect(index)">
          {{item}}
        </span>
      </div>
    </div>
    <div>
      <div class="l">{{$t('common.date')}}</div>
      <div class="r">
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
        <el-button class="button" :disabled="disabled" type="success" size="small" @click="submitDate()">{{ $t('common.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import {getCommon} from '@/api/advertisement.js'
export default {
  data() {
    return {
      disabled: true,
      starttime: null,
      endtime: null,
      order: null,
      filterRules: {
        type: '',
        status: '',
        currency: ''
      },
      typeList: [
        {label: this.$t('dealCenter.buy'), value: 'buy'},
        {label: this.$t('dealCenter.sell'), value: 'sell'}
      ],
      typeIndex: null,
      statusList: [
        {label: this.$t('dealCenter.waitPay'), value: 'waitPay'},
        {label: this.$t('dealCenter.waitCoin'), value: 'waitCoin'},
        {label: this.$t('dealCenter.normal_success'), value: 'normal_success'},
        {label: this.$t('dealCenter.cancel'), value: 'cancel'},
        {label: this.$t('dealCenter.expire'), value: 'expire'},
        {label: this.$t('dealCenter.commit'), value: 'commit'},
        {label: this.$t('dealCenter.appeal_success'), value: 'appeal_success'},
        {label: this.$t('dealCenter.appeal_fail'), value: 'appeal_fail'}
      ],
      statusIndex: null,
      currencyList: [],
      currencyIndex:null
    }
  },
  computed: {
    ...mapGetters(['orderFilter'])
  },
  methods: {
    ...mapMutations(['orderFilterHandle']),
    selectDate: function(){
      if(!this.starttime || !this.endtime){
        this.disabled = true;
        return;
      }
      this.days =  (this.endtime - this.starttime) / 24 / 60 / 60 / 1000;
      if(this.days < 0){ 
        this.$message.error(this.$t('common.dateless'));
        this.disabled = true;
      }else{
        this.disabled = false
      }
    },
    submitDate: function(){
      this.orderFilterHandle({key: 'startTime', val: this.starttime.getTime()});
      this.orderFilterHandle({key: 'endTime', val: this.endtime.getTime() + 24 * 3600 * 1000})
    },
    clearAllCondition: function(){
      this.orderFilterHandle();
      this.typeIndex = null;
      this.statusIndex = null;
      this.currencyIndex = null;
    },
    typeSelect: function(i){
      this.typeIndex = i;

      this.orderFilterHandle({key: 'orderType', val: this.typeList[i].value});
    },
    statusSelect: function(i){
      this.statusIndex = i;
      this.orderFilterHandle({key: 'orderStatus', val: this.statusList[i].value});
    },
    currencySelect: function(i){
      this.currencyIndex = i;
      this.orderFilterHandle({key: 'currency', val: this.currencyList[i]});
    },
    setOrderCode: function(){
      this.orderFilterHandle({ key: 'orderCode', val: this.order})
    },
    getCurrencyList: function(){
      getCommon().then(res=>{
        this.currencyList = res.data.currency;
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    }
  },
  created() {
    this.getCurrencyList();
  },
  destroyed() {
    this.$root.updateLang.$off('toggelLang');
  },
  mounted() {
    this.$root.updateLang.$on('toggelLang', ()=>{
      this.typeList = [
        {label: this.$t('dealCenter.all'), value: ''},
        {label: this.$t('dealCenter.buy'), value: 'buy'},
        {label: this.$t('dealCenter.sell'), value: 'sell'}
      ];
      this.statusList = [
        {label: this.$t('dealCenter.trading'), value: 'process'},
        {label: this.$t('dealCenter.complete'), value: 'success'},
        {label: this.$t('dealCenter.cancel'), value: 'cancel'}
      ]
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

.order-filter {
  & > div {
    position: relative;
    overflow: hidden;
    border-top: 1px solid #ddd;
    .l {
      float: left;
      width: 100px;
      padding: 16px;
      padding-bottom:2000px;
      margin-bottom:-2000px;
      color: rgba(74,74,74,0.66);
      background-color: rgba(216,216,216,0.4);
    }
    .r {
      margin-left: 100px;
      padding: 12px;
      .el-date-editor{
        .el-range-separator{
          width: 8%;
        }
      }
      .s1, .s2, .s3 {
        margin: 0 8px;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          color: $color-theme;
        }
      }
      .coin {
        margin: 0 8px;
        cursor: pointer;
      }
      .input-order {
        width: 250px;
      }
      .button {
        margin-left: 16px;
      }
      .selectCls{
        color: #4aca85;
      }
    }
  }
  & > div:last-of-type {
    border-bottom: 1px solid #ddd;
  }
}
</style>
