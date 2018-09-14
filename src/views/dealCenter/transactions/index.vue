<template>
  <div class="transactions container-box zidingTable">
    <deal-bread :currentNav="$t('dealCenter.transactions.title')"></deal-bread>
    <div class="date-picker">
      <!-- 左边类型 -->
      <el-select v-model="type" @change="typeChange">
        <el-option v-for="(item, index) in typeList" :key="index" :label="item.value" :value="item.key"></el-option>
      </el-select>
      <!-- 右边查询条件 -->
      <div>
        <el-date-picker v-model="starttime" type="date" :editable="false" :clearable="false" @change="selectDate" :placeholder="$t('common.starDate')">
        </el-date-picker>
        <el-date-picker v-model="endtime" type="date" :editable="false" :clearable="false" @change="selectDate" :placeholder="$t('common.endDate')">
        </el-date-picker>
        <el-button type="success" size="small" :disabled="disabled" @click="getData()">{{$t('common.search')}}</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="showData" stripe style="width: 100%">
      <el-table-column prop="createTime" :label="$t('common.time')" align="center">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime)._format() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tradeHash"  width="270"  :label="$t('common.table.particulars')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tradeHash">{{scope.row.tradeHash}}</span>
          <span v-if="scope.row.orderCode">{{scope.row.orderCode}}</span>
          <span v-if="scope.row.refId">{{scope.row.refId}}</span>
          <del v-if="scope.row.poolId">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</del>
          <span v-if="scope.row.type == 'transfer_in' || scope.row.type == 'transfer_out'">{{scope.row.destAddr}}</span>
        </template>
      </el-table-column>
      <!-- 类型 -->
      <el-table-column prop="type" :formatter="typeChar" :label="$t('common.type')" align="center">
      </el-table-column>


 
      <!-- 金额 -->
      <el-table-column prop="amount" :label="$t('common.amount')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.amount">  <span> {{currencyDeal(scope.row)}}</span> {{scope.row.amount.toFixed(8) + ' ' + scope.row.currency}}</span>
          <span v-if="scope.row.currencyAmount"><span>{{currencyDeal(scope.row)}}</span> {{scope.row.currencyAmount.toFixed(8) + ' ' + scope.row.currency}}</span>
        </template>
      </el-table-column>

      <!-- USDT  -->
      <el-table-column prop="fiatCurrency" label="USDT" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isUSDT"> <span> {{USDTdeal(scope.row)}}</span> {{scope.row.fiatCurrencyAmount.toFixed(8) +' USDT'}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>


      <el-table-column :label="$t('common.table.operate')" align="center">
        <template slot-scope="scope">
          <router-link v-if="scope.row.type === 'tradeFee'" :to="'/outside-trade/trading/' + scope.row.orderCode">
            <el-button type="text" size="small">{{$t('common.check')}}</el-button>
          </router-link>
          <router-link v-if="scope.row.type === 'buy' || scope.row.type === 'sell'" :to="'/outside-trade/trading/' + scope.row.orderCode">
            <el-button type="text" size="small">{{$t('common.check')}}</el-button>
          </router-link>
          <router-link v-if="(scope.row.type === 'withdraws')" :to="'/account/record/details?type=withdraws&id=' + scope.row._id">
            <el-button type="text" size="small">{{$t('common.check')}}</el-button>
          </router-link>
          <router-link v-if="(scope.row.type === 'deposits')" :to="'/account/record/details?type=deposits&id=' + scope.row._id">
            <el-button type="text" size="small">{{$t('common.check')}}</el-button>
          </router-link>
          <router-link v-if="(scope.row.type === 'advertiseFee')" :to="'/advertisement/' + scope.row.refId">
            <el-button type="text" size="small">{{$t('common.check')}}</el-button>
          </router-link>
          <router-link v-if="(scope.row.type === 'transfer_in' )" :to="'/user?id=' + scope.row.destUserId">
            <el-button type="text" size="small">{{scope.row.destNickName}}</el-button>
          </router-link>
          <router-link v-if="(scope.row.type === 'transfer_out')" :to="'/user?id=' + scope.row.destUserId">
            <el-button type="text" size="small">{{scope.row.destNickName}}</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="true" @current-change="changePage" :page-size="onePage" layout="prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
import dealBread from "../components/dealBread.vue";
export default {
  components: {
    dealBread
  },
  data() {
    return {
      days: 0,
      disabled: true,
      starttime: null,
      endtime: null,
      tableData: [],
      showData: [],
      totalPage: 0,
      onePage: 10,
      typeList: [],
      type: ""
    };
  },
  methods: {
    currencyDeal(val){
      if(val.type=="buy" || val.type=="deposits" || val.type=="transfer_in" || val.type=="candy"){
         return "+";
      }
      else{
       return "-";
      }
    },
    USDTdeal(val){
     if(val.type=="buy" || val.type=="deposits" || val.type=="transfer_in" || val.type=="candy"){
         return "-";
      }
      else{
       return "+";
      }
    },
    typeChar: function(row) {
      return this.$t("dealCenter.transactions.feeType." + row.type);
    },
    selectDate: function(time) {
      if (!this.starttime || !this.endtime) {
        this.disabled = true;
        return;
      }
      this.days = (this.endtime - this.starttime) / 24 / 60 / 60 / 1000;
      if (this.days > 30) {
        this.$message.error(this.$t("common.dateover"));
        this.disabled = true;
      } else if (this.days < 0) {
        this.$message.error(this.$t("common.dateless"));
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    handleClick: function(row) {},
    typeChange: function() {
      let params = {};
      if (this.starttime && this.endtime) {
        params = {
          startTime: this.starttime.getTime(),
          endTime: this.endtime.getTime() + 24 * 3600 * 1000
        };
      }
      if (this.type) {
        console.log(this.type)
        params.type = this.type;
      }
      this.$http.get("/account/transactions", { params: params }).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data;
          this.tableData.sort((x1, x2) => {
            return x2.createTime - x1.createTime;
          });
          this.totalPage = this.tableData.length;
          this.showData = this.tableData.slice(0, this.onePage);
        } else {
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      });
    },
    getData: function() {
      let params = {};
      if (this.starttime && this.endtime) {
        params = {
          startTime: this.starttime.getTime(),
          endTime: this.endtime.getTime() + 24 * 3600 * 1000
        };
      }
      if(this.type != ''){
        params.type = this.type;
      }
      this.$http.get("/account/transactions", { params: params }).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data;
          this.tableData.sort((x1, x2) => {
            return x2.createTime - x1.createTime;
          });
          this.totalPage = this.tableData.length;
          this.showData = this.tableData.slice(0, this.onePage);
        } else {
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      });
    },
    changePage(val) {
      this.showData = this.tableData.slice(
        (val - 1) * this.onePage,
        val * this.onePage
      );
    }
  },
  created() {
    // let t1 = new Date()
    // this.time[0] = new Date(t1.setMonth(t1.getMonth() - 1))
    // this.time[1] = new Date(t1.setMonth(t1.getMonth() + 1))
    this.getData();
    let typeArr = [
      "advertiseFee",
      "tradeFee",
      "sell",
      "buy",
      "withdraws",
      "candy",
      "deposits",
      "transfer",
      "issueCurrency"
    ];
    this.typeList = [{ key: "", value: this.$t("common.all") }];
    for (let type of typeArr) {
      this.typeList.push({
        key: type,
        value: this.$t("dealCenter.transactions.feeType." + type)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.transactions {
  margin: 0 auto;
  padding: 30px 16px;
  .date-picker {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    span {
      margin: 0 10px 0 0;
      color: #9b9b9b;
      font-weight: 400;
      font-size: 14px;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .type-picker {
    margin-top: 10px;
    span {
      margin: 0 10px 0 0;
      color: #9b9b9b;
      font-weight: 400;
      font-size: 14px;
    }
  }
  .el-table {
    margin: 20px auto;
  }
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.zidingTable td .cell{
  text-align: center;
}
</style>
