<template>
 <div class="c-transfer" v-if="base.isCreateQh">
 <!-- <div class="c-transfer" v-if="true"> -->
    <el-row :gutter="14">
      <!-- usdt余额 -->
      <el-col :span="6">
        <div class="balance">
          
          <span> {{base.fromCurrency}} {{$t("futures.balance")}}: {{usdtYeE}}</span>
        </div>
      </el-col>

      <!-- USDT数量 -->
      <el-col :span="6">
        
        <el-input
          :placeholder="$t('futures.transferNumber')"
          v-model="amount"
          type="number" min=0>
        </el-input>
      </el-col>

      <el-col style="  padding-right: 17px; float: left; width: auto;">
         <!-- panda数量 -->
        <span class="sub-title"><em style="margin-right: 10px;font-style: normal;">{{$t('futures.innerAmount')}}</em>{{transAmount}}</span>
      </el-col>
      <el-col :span="5">
            <!-- 转入场内交易按钮 -->
            <el-button type="success" @click="_transfer">
              {{$t('futures.transfer')}}
            </el-button>
          </el-col>
    </el-row>
  </div>
</template>

<script>
import { getBase, transQH ,transfer,membercheck} from 'api/futures'
export default {
  props: {
    base: Object,
  },
  data() {
    return {
      amount: 0,
      isToQH: true,
      usdtYeE:0,
      allBase:"",
      member:false,
    }
  },
   created() {
     this._membercheck();
    this._getBase()
  },
  computed: {
    balance() {
      return `${this.base.fromCurrency} ${this.$t('futures.balance')} ${this.base.fromAmount.toFixed(8)}`
    },
    activeText() {
      return `${this.$t('futures.convert')}${this.base.currency}`
    },
    inactiveText() {
      return `${this.$t('futures.convert')}${this.base.fromCurrency}`
    },
    trans() {
      return `${this.$t('futures.convert')}${this.isToQH ? this.base.currency : this.base.fromCurrency}`
    },
    // usdt数量
    transAmount() {
      if (this.isToQH) {
        if (+this.amount <= 0) return `0 `  // ${this.base.currency}
        return `${(this.amount * this.base.rate).toFixed(8)} ` //${this.base.currency}
      } else {
        if (+this.amount <= 0) return `0 ` //${this.base.fromCurrency}
        return `${(this.amount / this.base.rate).toFixed(8)} ` //${this.base.fromCurrency}
      }
    }
  },
  watch: {
    isToQH(val) {
      this.amount = 0
    }
  },
  methods: {
    //检测是否是会员
    _membercheck(){
      membercheck().then(data => {
          this.member=true;
        }).catch(err => {
          this.member=false;
        })
     },
        // 获取余额等信息
    _getBase() {
      getBase()
        .then(data => {
          this.allBase = data.data
          console.log(this.allBase,22222)
          this.usdtYeE=data.data.fromAmount.toFixed(6);
        })
        .catch(err => {
          this.$message.error(this.$t(`err.${err.code}`))
        })
    },
 
    _transQH() {
      if (+this.amount <= 0) {
        this.$message.error(this.$t('futures.error'))
        return
      }
      transQH({fromAmount: +this.amount, isToQH:this.isToQH})
        .then(data => {
          this.$message.success(this.$t('futures.transferSuccess'))
          this.amount = 0
          this.$emit('getBase')
        })
        .catch(err => {
          this.$message.error(this.$t(`err.${err.code}`))
        })
    },
     // 转入场内交易
    _transfer() {
      if(!this.member){
        this.$message.error(this.$t('futures.notMember'))
        return
      }
      //不能超过余额
      if (+this.amount > +this.usdtYeE) {
        this.$message.error(this.$t(`futures.limit`))
        return
      }
      if (+this.amount <=0) {
         this.$message.error(this.$t(`futures.null`))
        return
      }
      transfer({amount: +this.amount})
        .then(data => {
          this.$message.success(this.$t('futures.sucess'))
         this.$root.eventHub.$emit('futureHistory', true)
          this._getBase()
        })
    },
  }
}
</script>

<style lang="scss" scoped>
  .c-transfer {
    position: relative;
    margin: 0 5%;
    margin-bottom: 16px;
    padding: 20px 8px;
    border-radius: 3px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 40px;
    background-color: #fff;

    .balance {
      text-align: center;
    }
    .sub-title {
          padding-left: 24px;
        font-size: 14px;
        color: #666;
    }
  }
</style>
