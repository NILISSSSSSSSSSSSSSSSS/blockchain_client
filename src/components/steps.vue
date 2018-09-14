<template>
  <div class="steps">
    <el-steps direction="vertical"
      finish-status="success" :active="steps" space="80px">
      <el-step :title="$t('steps.search')" >
        <div v-if="form.currency" slot="description" class="step-search">
          <span>{{form.currency}} > {{form.fiatCurrency}}</span>
          <el-button type="text" @click="show()">{{$t('steps.modify')}}</el-button>
        </div>
      </el-step>
      <el-step :title="$t('steps.scheme')" description=""></el-step>
      <el-step :title="$t('steps.new')" description=""></el-step>
      <el-step :title="$t('steps.trading')"></el-step>
      <el-step :title="$t('steps.turn')"></el-step>
      <el-step :title="end" description="" style="flex-basis: 20px;"></el-step>
    </el-steps>
    <el-dialog
      :title="$t('steps.hint')"
      :visible.sync="dialog"
      width="60%">
      <div style="display: flex;justify-content: space-between;flex-wrap:wrap;">
        <div>
          <p style="margin: 0 0 5px 0">{{$t('steps.use')}}</p>
          <el-select v-model="form.fiatCurrency" >
            <el-option v-for="(item, index) in fiatCurrency" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div>
          <p style="margin: 0 0 5px 0">{{$t('steps.amount')}}</p>
          <el-input type="number" v-model="form.amount"></el-input>
        </div>
        <div>
          <p style="margin: 0 0 5px 0">{{$t('steps.convert')}}</p>
          <el-select v-model="form.currency">
            <el-option v-for="(item, index) in currency" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div>
          <p style="margin: 0 0 5px 0">{{$t('common.table.tradeType')}}</p>
          <el-select v-model="form.payType">
            <el-option v-for="(item,index) in payList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">{{$t('steps.cancel2')}}</el-button>
        <el-button type="primary" @click="submit()">{{$t('steps.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {getCommon} from '@/api/advertisement.js'
export default {
  data () {
    return {
      form: {
        currency: '',
        fiatCurrency: '',
        amount: '',
        payType: '',
      },
      dialog: false,
      fiatCurrency: [],
      currency: [],
      payList: [],
      amount: '',
      pay: '',
      steps: 0,
      end: ''
    }
  },
  computed: {
    ...mapGetters([
      'step'
    ])
  },
  methods: {
    submit: function(){
      let type= this.$route.params.trade;
      this.$router.push('/');
      this.$router.push({path: '/outside-trade/index/'+type, query: {...this.form} });
      this.dialog = false;
    },
    changeFC: function(){
      this.fiatCurrency.forEach((item)=>{
        if(item.name == this.form.fiatCurrency){
          this.payList = item.allowPay;
          this.pay = this.payList[0]
          return;
        }
      })

    },
    show: function(){
      this.dialog = true;
    },
    common: function(){
      getCommon('yes').then(res=>{
        this.currency = res.data.currency;
        this.fiatCurrency = res.data.fiatCurrency;
        this.changeFC();
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
    }
  },

  created() {
    this.common();
  },
  watch: {
    '$route.query': {
      handler (val) {
        this.form = val;
      },
      deep: true,
      immediate: true
    },
    step: {
      handler(val) {
        this.steps = val.steps
        this.end = val.end
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  .steps {
    padding: 20px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(180,180,180,0.5);

  }
  .step-search{
    color: #4A4A4A;
    font-weight: 600;
    .el-step__title{
      font-size: 13px;
    }
    .el-button{
      color: #67c23a;
    }
  }
  .el-step{
  }
  .desCls{
    margin: 0 0 5px 0;
    color: #9B9B9B;
    font-weight: 400;
    font-size: 12px;
  }
</style>
