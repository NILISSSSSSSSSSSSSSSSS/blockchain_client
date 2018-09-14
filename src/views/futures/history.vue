<template>
  <div>
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="TX_TM"
          :label="$t('common.time')">
          <template slot-scope="scope">
            {{ scope.row.TX_TM | datetimeFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CRDR_IDEN"
          :label="$t('common.type')">
          <template slot-scope="scope">
            {{ translateType(scope.row.CRDR_IDEN) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="TX_AMT"
          label="划账金额">
          <template slot-scope="scope">
            {{ scope.row.TX_AMT.toFixed(6) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="RMRK"
          :label="$t('futures.remark')">
        </el-table-column>
        <el-table-column
          prop="TX_LOG_NO"
          label="流水号">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getRecord } from 'api/futures'
export default {
  props: {
    update: Number
  },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
    
    }
  },
    computed: {
    
    },
  watch: {
    currentPage(val) {
      this._getRecord()
    },
    update(val) {
      this._getRecord()
    },
  },
  created() {
    this._getRecord();

    this.$root.eventHub.$on('futureHistory', (yourData)=>{
        this._getRecord();
    } )
  },
  methods: {
    changePage(currentPage) {
      this.currentPage = currentPage
    },
    translateType(str) {
      if (str === 'D') return '入账' //this.$t(`futures.D`)
      if (str === 'C') return '出账'  //this.$t(`futures.C`)
      return str
    },
    // 获取历史
    _getRecord() {
      getRecord({page: this.currentPage, count: this.pageSize})
        .then(data => {
          this.tableData = data.data.list
          this.totalCount = data.data.totalCount
        })
        .catch(err => {
          this.$message.error(this.$t(`err.${err.code}`))
        })
    },
  }
}
</script>

<style lang="scss" scoped>
  .table-container {
    margin: 0 10%;
    border-radius: 4px;
  }
  .pagination {
    margin-top: 16px;
    text-align: center;
  }
</style>
