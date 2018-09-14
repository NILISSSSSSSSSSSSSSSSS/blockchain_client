<template>
  <div class="offers container-box">
    <deal-bread :currentNav="$t('dealCenter.offers.my')"></deal-bread>
    <div class="dashboard">
      <div class="active-select-menu">
        <div class="select-line">
          <div class="select-title">{{$t('common.table.currency')}}</div>
          <div class="select-items" style="word-break: break-word;">
            <a class="active-link" :class="{active: selectCurrencyIndex == -1}" @click="getAll()">{{$t('common.table.allCurrency')}}</a>
            <a class="active-link" v-for="(item, index) in currencyList" :key="index" :class="{active: selectCurrencyIndex == index}" @click="selectCurrency(index, item)">{{item}}</a>
          </div>
        </div>
        <!--<div class="select-line">
          <div class="select-title">分类：</div>
          <div class="select-items">
            <a class="active-link active">普通广告</a>
          </div>
        </div>-->
      </div>
      <div class="trash" @click="$router.push('/deal-center/offers/trash')"><i class="el-icon-delete"></i><span>{{$t('dealCenter.offers.recycle')}}</span></div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          >
        </el-table-column>
        <el-table-column
          :label="$t('common.createDate')"
          >
          <template slot-scope="scope">{{ scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column
          :label="$t('common.table.adverType')"
          >
          <template slot-scope="scope">{{ $t('dealCenter.offers.adver', {text: scope.row.tradeType == 'buy'? $t('dealCenter.buyAdver'): $t('dealCenter.sellAdver')}) }}</template>
        </el-table-column>
        <el-table-column
          :label="$t('common.price')"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.floatPrice.toFixed(6) + scope.row.fiatCurrency}}</template>
        </el-table-column>
        <el-table-column
          :label="$t('common.table.quota')"
          width="190"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.orderFloorPrice.toFixed(6)  + '-' + scope.row.orderCeilPrice.toFixed(6) +' '+ (scope.row.tradeType == 'buy'? scope.row.currency: scope.row.fiatCurrency)}}</template>
        </el-table-column>
        <el-table-column
          :label="$t('common.table.tradeType')"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.allowPay" :key="index">
              <img width='20' height="20" style="vertical-align: middle;" :src="require('../../../assets/image/payment_'+item+'.png')" alt="">
            </span>
            <img width='15' height="14" style="vertical-align: middle;" :src="require('../../../assets/image/payment_USDT.png')" alt="" v-if="scope.row.isUSDT" :value="scope.row.isUSDT">
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('common.table.state')"
          :formatter="getStatusText"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="tradeCount"
          :label="$t('common.table.tradeAmount')"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :label="$t('common.table.cut')"
          width="130"
        >
        <template slot-scope="scope">
          <el-switch active-text="on" inactive-text="off" v-model="tableData[scope.$index].status" @change="switchStatus(scope)"></el-switch>
        </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.table.operate')"
          width="210"
          >
          <template slot-scope="scope">
            <el-button @click="getDetail(scope.row)" size="small">{{ $t('common.check') }}</el-button>
            <el-button
              size="small"
              @click="share(scope.row)"
              v-clipboard:copy="copyUrl"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >{{$t('common.share')}}</el-button>
            <el-button size="small" @click="edit(scope.row)">{{$t('common.edit')}}</el-button>
            <el-button size="small" v-if="!tableData[scope.$index].status" @click="deleteById(scope.row)">{{$t('common.goRecycle')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      
       <el-pagination :background="true"
        v-if="(count > pageSize)"
        @current-change="changePage"
        layout="prev, pager, next, jumper"
        :page-size="pageSize"
        :total="count" >
       </el-pagination>
      <el-button type="danger" size="small"  @click="deleteMany()">{{$t('common.allRecycle')}}</el-button>
    </div>
  </div>
</template>

<script>
  import {getCommon} from '@/api/advertisement.js'
  import dealBread from '../components/dealBread.vue'
  export default {
    components: {
      dealBread
    },
    data () {
      return {
        copyUrl: '',
        currencyList: [],
        selectCurrencyIndex: -1,
        tableData: [],
        selectDel: [],
        // 分页
          pageSize: 10,
          count: 0,
      }
    },
    methods: {
          //分页
      changePage(val) {
        // var params = this.$route.query;
        let params={};
        console.log(val)
        params.pageSize = this.pageSize;
        params.page = val;
        
        this.getADList(params);
      },
      deleteMany: function(){
        var ids = [];
        var i;
        var len = this.selectDel.length;
        for(i = 0; i<len; i++){
          ids.push(this.selectDel[i]._id)
        }
        let data = {advertIds: ids, status: 'delete'}
        this.$http.patch('/shop', data).then(res=>{
          if(res.data.code == 0){
            this.getAll();
          }else{
            this.$message.error(this.$t(`err.${res.data.code}`));

          }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'));
        })
      },
      deleteById: function(row){
        let data = {advertIds: [row._id], status: 'delete'}
        this.$http.patch('/shop', data).then(res=>{
          if(res.data.code == 0){
            this.getAll();
          }else{
            this.$message.error(this.$t(`err.${res.data.code}`));

          }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'));
        })
      },
      edit: function(row){
        this.$router.push('/advertisement/edit/'+row._id)
      },
      share: function(row){
        this.copyUrl = location.href.split('#')[0] + '#/outside-trade/orders/' + row._id;
      },
      onCopy: function (e) {
        this.$message({
          message: '复制成功，快分享出去吧',
          type: 'success'
        });
      },
      onError: function (e) {
        this.$message.error('复制出错');
      },
      getDetail: function(row){
        this.$router.push('/advertisement/'+row._id)
      },
      getAll: function(){
        this.selectCurrencyIndex = -1;
        this.getADList({})
      },
      getByCurrency: function(coin){
        this.getADList({currency: coin})
      },
      handleSelectionChange: function(val){
        this.selectDel = val;
      },
      getStatusText: function(row){
        return row.status == true ? this.$t('dealCenter.alreadyUp') : this.$t('dealCenter.alreadyDown')
      },
      switchStatus: function(row){
        let status = this.tableData[row.$index].status == true ? 'online':'offline'
        let data = {advertIds: [row.row._id], status: status}
        this.$http.patch('/shop', data).then(res=>{
          if(res.data.code != 0){
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'));
        })

      },
      selectCurrency: function(i,item){
        this.selectCurrencyIndex = i;
        this.getByCurrency(item)
      },
      getCurrencyList: function(){
        getCommon().then(res=>{
          this.currencyList = res.data.currency;
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
      },
      getADList: function(params){
        this.$http.get('/shop/list',{params:params }).then(res=>{
          this.tableData = res.data.data.list;
          this.count = res.data.data.count;
        }).catch(res => {
          this.$message.error(this.$t(`err.${res.data.code}`))
        })
      }
    },
    created () {
      this.getCurrencyList();
      this.getADList({});
    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';
  .offers{
    margin: 0 auto;
    padding: 30px 16px;
    .dashboard{
      margin: 40px auto;
      .trash{
        font-size: 13px;
        text-align: right;
        cursor: pointer;
        &:hover{
          color: #43CB83;
        }
      }
      .active-select-menu{
        margin: 10px 0 25px;
        border-top: 1px solid rgba(151,151,151,0.38);
        border-bottom: 1px solid rgba(151,151,151,0.38);
        .select-line{
          display: flex;
          align-content: center;
          .select-title{
            padding: 12px 0 12px 12px;
            border-bottom: 1px solid rgba(151,151,151,0.17);
            width: 100px;
            background: rgba(216,216,216,0.4);
            color: rgba(74,74,74,0.66);
          }
          .select-items{
            padding: 12px 0 12px 12px;
            border-bottom: 1px solid rgba(151,151,151,0.17);
            width: calc(100% - 100px);
            .active-link{
              padding-right: 30px;
              font-size: 13px;
              cursor: pointer;
              &:hover{
                color: #43CB83;
              }
            }
            .active{
              font-weight: bold;
              color: #43CB83;
            }
          }

        }
      }
      .el-table{
        font-size: 13px;;
        .el-button{
          margin: 3px 0 0 0;
        }
      }
    }
  }
  .el-pagination {
      margin: $distance-x2 0;
          margin-bottom: 0;
    }
    .dashboard>button{
       margin-top: $distance-x2;
    }
</style>
