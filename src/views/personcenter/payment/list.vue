<template>
  <el-card class="payment">
    <pc-header :title="$t('personcenter.tradeSet')" slot="header"></pc-header>
    <div class="notice">
      <ul>
        <li>
          {{$t('personcenter.please1')}}
        </li>
        <li>
          {{$t('personcenter.please2')}}
        </li>
      </ul>
    </div>
    <el-table
      :data="tableData"
      :empty-text="$t('common.noData')"
      style="width: 100%">
      <el-table-column :label="$t('common.table.tradeType')" >
          <template slot-scope="scope">
             <span>{{ scope.row.paytype}} / {{scope.row.paytype | payTypeFilter}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="isSet"
        :formatter="hasSet"
        :label="$t('common.set')"
        >
      </el-table-column>
      <el-table-column
        :label="$t('common.table.operate')"
        >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('common.manage')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
import pcHeader from '../components/pcHeader.vue'
export default {
  components: {
    pcHeader
  },
  data () {
    return {
      debounce: false,
      tableData: []
    }
  },
  methods: {
    handleClick: function(row){
      this.$router.push({path: '/personcenter/paymentSetting', query:{payType: row.paytype}})
    },
    hasSet: function(row, column){
      return row.isSet==true?this.$t('personcenter.hasSet'):this.$t('personcenter.noSet')
    },
    getPayList () {
      if(this.debounce == true){
        return;
      }
      this.debounce = true;
      this.$http.get('/users/qrcode?payType=all').then(res=>{
        if(res.data.code == 0){
          this.tableData = res.data.data;
        }else {
          this.$message.error(this.$t(`err.${res.data.code}`));
          this.debounce = false;
        }
      }).catch(err=>{
        this.$message.error(this.$t('common.serverErr'));
        this.debounce = false;
      })
    }
  },
  created () {
    this.getPayList();
  }
}
</script>

<style lang="scss" scoped>
  .payment{
    width: 100%;
    .el-card__body{
      padding: 0;
    }
    .notice{
      padding: 15px 25px;
      background-color: #d9edf7;
      border-color: #bce8f1;
      color: #31708f;
      border: 1px solid transparent;
      margin-bottom: 30px;
      ul{
        list-style-type: disc;
      }
    }

  }
</style>

