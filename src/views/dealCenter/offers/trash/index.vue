<template>
  <layout>
    <div slot="head" class="head container-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{$t('common.index')}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/deal-center/offers' }">{{$t('dealCenter.offers.my')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('common.recycle')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div slot="body" class="body container-box">
      <ul class="list">
        <li class="l1">
          <div>{{$t('common.createDate')}}</div>
          <div>{{$t('common.table.adverType')}}</div>
          <div>{{$t('common.price')}}</div>
          <div class="big">{{$t('common.table.quota')}}</div>
          <div class="big">{{$t('common.table.tradeType')}}</div>
          <!--<div>状态</div>-->
          <div>{{$t('common.table.make')}}</div>
          <div>{{$t('common.table.operate')}}</div>
        </li>
        <li class="l2" v-for="(item, index) in tableData" :key="index">
          <div>{{item.createTime | datetimeFormat}}</div>
          <div>{{item.tradeType == 'buy' ? $t('dealCenter.buyAdver'): $t('dealCenter.sellAdver')}}</div>
          <div>{{ (item.floatPrice).toFixed(6) +' '+ item.fiatCurrency}}</div>
          <div class="big">{{ item.orderFloorPrice.toFixed(6) + '-' + item.orderCeilPrice.toFixed(6) +' '+ (item.tradeType == 'buy'? item.currency: item.fiatCurrency)}}</div>
          <div class="big">
            <span v-for="(pay,index) in item.allowPay" :key="index"><img width='20' height="20" style="vertical-align: middle;" :src="require('../../../../assets/image/payment_'+pay+'.png')" alt=""></span>
            <img style="vertical-align:middle;width:15px;height:14px;" :src="require('../../../../assets/image/payment_USDT.png')" alt="" v-if="item.isUSDT" >
          </div>
          <!--<div>回收站</div>-->
          <div>{{item.tradeCount}}</div>
          <div>
            <el-button plain size="mini" @click.native="setBack(item._id)">{{$t('common.restore')}}</el-button>
          </div>
        </li>
      </ul>
      <div class="pageBox">
        <el-pagination
          @current-change="handleCurrentChange"
          current-page.sync="1"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      count: 0
    }
  },
  methods: {
    setBack: function(id){
      let data = {advertIds: [id], status: 'offline'}
      this.$http.patch('/shop', data).then(res=>{
        if(res.data.code == 0){
          this.getData(1);
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));

        }
      }).catch(err=>{
        this.$message.error(this.$t('common.serverErr'));
      })
    },
    handleCurrentChange: function(val){
      this.getData(val);
    },
    getData: function(page){
      let params = {
        isDeleted : true,
        page: page,
        pageSize: 10
      }
      this.$http.get('/shop/list',{params:params }).then(res=>{
        this.tableData = res.data.data.list;
        this.count = res.data.data.count
      })
    }
  },
  created () {
    this.getData(1);
  }
}
</script>

<style lang="scss" scoped>
  .body {
    .pageBox{
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .list {
      li {
        text-align: center;
        display: flex;
        justify-content: space-between;
        .big {
          width: 20%;
        }
        & > div {
          width: 12%;
        }
      }
      .l1 {
        padding: 8px 16px;
        color: rgba(42,42,65,0.5);
      }
      .l2 {
        margin-top: 16px;
        padding: 16px;
        border: 1px solid rgba(151,151,151,0.1);
        box-shadow: 0 1px 1px 0 rgba(0,0,0,0.15);
        border-radius: 4px;
        background-color: #fff;
        img {
          width: 20px;
        }
      }
    }
  }
</style>
