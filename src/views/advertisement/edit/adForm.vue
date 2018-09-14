<template>
  <el-form :model="form" label-width="80px">
    <h2 class="big-title form-title">{{$t('adver.adform.title1')}}</h2>
    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se1.title')}}
        </el-col>
        <el-col :span="6" class="form-input">
          <el-radio-group v-model="form.tradeType" @change="canSubmit(true)" disabled>
            <div class="form-radio"><el-radio label="sell">{{$t('adver.adform.se1.sell')}}</el-radio></div>
            <div class="form-radio"><el-radio label="buy">{{$t('adver.adform.se1.buy')}}</el-radio></div>
          </el-radio-group>
        </el-col>
        <el-col :span="14" class="form-description">
          {{$t('adver.adform.se1.state', {siteName: $store.state.common.siteName})}}
        </el-col>
      </el-row>
    </div>

    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se2.title')}}
        </el-col>
        <el-col :span="6" class="form-input">
          <el-select v-model="form.currency" @change="canSubmit(true)" disabled>
            <el-option
              v-for="(item, index) in coin_data"
              :key="index"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="14" class="form-description">
          {{$t('adver.adform.se2.state')}}
        </el-col>
      </el-row>
    </div>

    <h2 class="big-title form-title">{{$t('adver.adform.title2')}}</h2>

    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se3.title')}}
        </el-col>
        <el-col :span="6" class="form-input">
          <el-select v-model="form.fiatCurrency" placeholder="请选择法币" @change="canSubmit(true)" disabled>
            <el-option v-for="(item, index) in fiatCurrency_data"
              :key="index"
              :label="item.name"
              :value="item.name"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se4.title')}}
        </el-col>
        <el-col :span="6" class="form-input">
          <el-select
            @change="canSubmit"
            v-model="form.allowPay"
            multiple
            filterable
            allow-create
            default-first-option
            :placeholder="$t('adver.adform.se4.placeholder')">
            <el-option
              v-for="item in allowPayData"
              :key="item.payType"
              :label="$t('common.'+ item.payType)"
              :value="item.payType"
              :disabled="!item.canUse">
              <span style="float: left">{{ $t('common.'+ item.payType) }}</span>
              <router-link :to="'/personcenter/paymentSetting?payType='+item.payType" target="_blank" style="float: right; color: #8492a6; font-size: 13px">{{ item.canUse?'':$t('common.goSetPay') }}</router-link>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" style="margin-top: 8px;">
          <el-checkbox :label="usdtLabel" v-model="form.isUSDT" :disabled="!usdtSelect"></el-checkbox>
        </el-col>
      </el-row>
    </div>

    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se5.title')}}
        </el-col>
        <el-col :span="20" class="form-input">
          <el-row>
            <el-col :span="7" style="margin-right: 16px;">
              <adverInput :title="$t('adver.adform.se5.exchange')">
                <el-select
                v-model="form.exchange" placeholder="选择对标交易所"
                @change="handleExchange(form.exchange)"
                slot="content">
                  <el-option v-for="(item, index) in exchangeList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"></el-option>
                </el-select>
              </adverInput>
            </el-col>
            <el-col :span="7">
              <adverInput :title="$t('adver.adform.se5.unit')">
                <h3 slot="content">{{ unitPrice + ' ' + form.fiatCurrency }}</h3>
              </adverInput>
            </el-col>
            <el-col :span="6">
              <adverInput :title="$t('adver.adform.se5.bestHight')">
                <h3 v-if="marketPrice!=''" slot="content">{{marketPrice.toFixed(6) + ' ' + form.fiatCurrency}}</h3>
                <h3 slot="content" style="padding-left: 20px;" v-else>
                  <del slot="content">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</del>
                </h3>
              </adverInput>
            </el-col>

            <el-col :span="8" style="margin-right:20px;">
              <adverInput :title="$t('adver.adform.se5.percent')">
                <el-input
                  ref="overPercent"
                  @input="handlePercent"
                  v-model="form.overPercent" placeholder="请输入内容" slot="content">
                  <template slot="append">%</template>
                </el-input>
              </adverInput>
              <div class="explain">
                <span>
                  {{$t('adver.adform.se5.percentLimit', {min: overPercentLimit.min * 100, max:overPercentLimit.max * 100})}}
                </span>
              </div>
            </el-col>
            <el-col :span="8">
              <adverInput :title="$t('adver.adform.se5.bestText', {bestText: bestText})">
                <el-input
                  ref="limitPrice"
                  @input="canSubmit"
                  v-model="form.limitPrice" slot="content">
                  <template slot="append">{{form.fiatCurrency}}</template>
                </el-input>
              </adverInput>
            </el-col>
          </el-row>
        </el-col>

      </el-row>
    </div>

    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se6.title')}}
        </el-col>
        <el-col :span="20" class="form-input" >
          <el-row type="flex" align="middle">
            <el-col :span="8" style="margin-right:20px;">
              <adverInput :title="$t('adver.adform.se6.bestLow')">
                <el-input
                  ref="orderFloorPrice"
                  @change="canSubmit"
                  v-model="form.orderFloorPrice" slot="content">
                  <template slot="append">{{tradeUnit}}</template>
                </el-input>
              </adverInput>
            </el-col>
            <el-col :span="8">
              <adverInput :title="$t('adver.adform.se6.bestHight')">
                <el-input
                  ref="orderCeilPrice"
                  @change="canSubmit"
                  v-model="form.orderCeilPrice" slot="content">
                  <template slot="append">{{tradeUnit}}</template>
                </el-input>
              </adverInput>
            </el-col>
          </el-row>
          <div class="explain">
            <span>{{$t('adver.adform.se6.state1')}}</span>
          </div>
          <adverInput :title="$t('adver.adform.se6.validity')" style="margin-top:20px;">
            <h3 slot="content">{{$t('adver.adform.se6.expire', {expire: expire})}}</h3>
          </adverInput>
          <div class="explain">
            {{$t('adver.adform.se6.state2')}}
          </div>
          <el-col :span="8">
          <adverInput :title="$t('adver.adform.se6.max')">
            <el-input
              ref="maxOrderLimit"
              @change="canSubmit"
              type="number" slot="content" v-model="form.maxOrderLimit"></el-input>
          </adverInput>
          </el-col>
        </el-col>
      </el-row>
    </div>

    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se7.title')}}
        </el-col>
        <el-col :span="20" class="form-input">
          <el-row>
            <el-col :span="20" style="margin-right:20px;">
              <adverInput :title="$t('adver.adform.se7.state1')">
                <el-input
                  @change="canSubmit"
                  v-model="form.autoReplyBefore" slot="content">
                </el-input>
              </adverInput>
            </el-col>
            <el-col :span="20">
              <div class="explain">
                {{$t('adver.adform.se7.state2')}}
              </div>
            </el-col>

            <!-- <el-col :span="20">
              <adverInput :title="$t('adver.adform.se7.state3')">
                <el-input
                  @change="canSubmit"
                  v-model="form.autoReplyAfter" slot="content">
                </el-input>
              </adverInput>
            </el-col>

            <el-col :span="20">
              <div class="explain">
                {{$t('adver.adform.se7.state4')}}
              </div>
            </el-col> -->
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se8.title')}}
        </el-col>
        <el-col :span="20" class="form-input">
          <el-row>
            <el-col :span="20">
              <adverInput :title="$t('adver.adform.se8.title')">
                <el-input
                  @change="canSubmit"
                  type="textarea" :rows="10" resize="none" v-model="form.desc" slot="content"></el-input>
              </adverInput>
            </el-col>
            <el-col :span="20">
              <div class="explain">
                {{$t('adver.adform.se8.state1')}}
              </div>
            </el-col>
            <el-col :span="20">
              <adverInput :title="$t('adver.adform.se8.remark')">
                <el-input
                  @change="canSubmit"
                  type="textarea" :rows="10" resize="none" v-model="form.remark" slot="content"></el-input>
              </adverInput>
            <el-col :span="20">
              <div class="explain">
                {{$t('adver.adform.se8.state2')}}
              </div>
            </el-col>
            </el-col>
          </el-row>

        </el-col>

      </el-row>
    </div> -->

    <br>
    <div class="form-control">
      <el-row>
        <el-col :span="4" class="form-label">
          {{$t('adver.adform.se9.title')}}
        </el-col>
        <el-col :span="20" class="form-input">
          <el-row>
            <el-col :span="8">
              <adverInput :title="$t('adver.adform.se9.must1')">
                <el-input type="number"
                  @change="canSubmit"
                  v-model="form.tradeCountLimit" slot="content"></el-input>
              </adverInput>
            </el-col>
            <el-col :span="20">
              <div class="explain">
                  <el-checkbox :label="$t('adver.adform.se9.must2')" v-model="form.isIdentityVerify"></el-checkbox>
                  <el-checkbox :label="$t('adver.adform.se9.must3')" v-model="form.isadvancedVerify"></el-checkbox>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="explain">
                {{$t('adver.adform.se9.state')}}
              </div>
            </el-col>
          </el-row>

        </el-col>

      </el-row>
    </div>

    <div class="form-control">
      <el-row>
        <el-col :span="4">
          <span>&nbsp; </span>
        </el-col>
        <el-col :span="20">
          <el-button type="primary" :disabled="isSubmit" @click="onSubmit" style="width:50%;">{{$t('adver.adform.se10.button')}}</el-button>
        </el-col>
      </el-row>
      <!--<el-button @click="cancel">取消</el-button>-->
    </div>
  </el-form>
</template>
<script>
import adverInput from '@/components/adverInput'
import { getPreset, getCommon } from 'api/advertisement'
import { getEditAdvertsDetails } from 'api/outside-trade'
import {getDetail} from '@/api/user'

export default {
  components: {
    adverInput
  },
  data() {
    return {
      form: {
        tradeType: "buy",
        currency: "BTC",
        fiatCurrency: "CNY",
        allowPay: [],
        isUSDT: false,
        exchange: 'average',
        overPercent: 0,
        limitPrice: null,
        orderFloorPrice: null,
        orderCeilPrice: null,
        lockMinute: 15,
        maxOrderLimit: 5,
        tradeCountLimit: 0,
        isIdentityVerify: false,
        isadvancedVerify: false,
        autoReplyBefore: '',
      },
      configFiatBi:"",
      myPay: [],
      usdtLabel: '',
      usdtSelect: true,
      isSubmit: true,
      fiatCurrency_data: ['CNY', 'USD'],
      coin_data: ["BTC", "ETH"],
      exchangeList: [],
      allowPayData: [],
      remark: '',
      unitPrice: 0,
      u2: null,
      expire: null,
      bestText: '',
      overPercentLimit: {},
      tradeUnit: 'CNY',
      marketPrice: '',
    };
  },
  watch: {
    form: {
      handler (val) {
        if(val.currency === 'USDT'){
          this.form.isUSDT = false;
          this.usdtSelect = false;
        }else{
          this.usdtSelect = true;
          if (val.tradeType === 'buy') {
            this.usdtLabel = this.$t('common.useUSDT',{msg:this.configFiatBi})
          } else {
            this.usdtLabel = this.$t('common.recieveUSDT1',{msg:this.configFiatBi})
          }
        }
        if (val.tradeType === 'buy') {
          this.bestText = this.$t('adver.bestHight');
        } else {
          this.bestText = this.$t('adver.bestLow');
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
     
   this.configFiatBi= localStorage.getItem("configFiatBi");
    this.id = this.$route.params.id
    this._getAdvertsDetails().then(() => {
      this._getPreset()
    })
   
    await this.getDetail();
    this._getCommon()
    //this._getPreset()
  },
  mounted() {
    setTimeout(() => {
      this.canSubmit();
    }, 200);
  },
  destroyed () {
    this.$root.updateLang.$off('toggelLang')
  },
  methods: {
    //获取用户信息
    getDetail: function() {
      return new Promise( (reslove, reject)=>{
        var _this = this;
        getDetail().then(data=>{
          data.data.tradeQRCode.forEach((item)=>{
            _this.myPay.push(item.payType)
          });
          console.log('done')
          reslove();
        }).catch(err=>{
          reject();
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        })
      } )
    },
    onSubmit() {
      if (!this._isSubmit()) return;
      this.isSubmit = true;
      // this.form.desc = this.form.desc.replace(new RegExp("\n", "gm"), "<br>");
      // this.form.remark = this.form.remark.replace(new RegExp("\n", "gm"), "<br>");
      this.$http
        .put(`/shop/${this.id}`, Object.assign({}, this.form, {
          overPercent: this.accuracy2(this.form.overPercent)
        }))
        .then(res => {
          this.isSubmit = false
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              duration: 1000,
              message: this.$t('adver.modify')
            })
            this.$router.push("/advertisement/"+this.id);
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
            // this.form.desc = this.form.desc.replace(new RegExp("<br>", "gm"), "\n");
            // this.form.remark = this.form.remark.replace(new RegExp("<br>", "gm"), "\n");
          }
        })
    },
    // 获取数据
    _getPreset() {
      return getPreset({tradeType: this.form.tradeType, currency: this.form.currency, fiatCurrency: this.form.fiatCurrency})
        .then(res => {
          this.form.fiatCurrency = res.data.fiatCurrency
          this.exchangeList = res.data.exchange
          this.remark = res.data.remark
          this.expire = res.data.expire
          this.overPercentLimit = res.data.overPercentLimit
          this.marketPrice = res.data.marketPrice;

          let obj = {}
          obj.trade = this.form.tradeType
          obj.currency = res.data.currency
          // 广告可见时间
          obj.adVisibleTime = res.data.adVisibleTime
          // 成交手续费应交比例
          obj.orderFeePercent = res.data.orderFeePercent
          // 挂单展示必须数量(卖)
          obj.minAmount = res.data.minAvailableAmountOfSell
          // 挂广告费用（当前币）
          obj.advertiseCostAmount = res.data.advertiseCostAmount
          // 官方手续费折扣
          obj.officialFeePercent = res.data.officialFeePercent
          // 官方币种
          obj.officialFee = res.data.officialCurrency
          // 广告费,self 本币支付，official官方币支付，optional优先使用官方币
          obj.adverFee = res.data.advertiseFeeSetting
          // 订单交易费，self 本币支付，official官方币支付，optional优先使用官方币
          obj.orderFee = res.data.orderFeeSetting

          this.$emit('update', obj)

          if (this.form.tradeType === 'buy') {
            this.tradeUnit = res.data.currency
          } else {
            this.tradeUnit = res.data.fiatCurrency
          }

          this.exchangeList.forEach(item => {
            if (item.name === this.form.exchange) {
              this.unitPrice = parseFloat(item.value * (1 + this.form.overPercent / 100)).toFixed(6)
              this.u2 = parseFloat(item.value).toFixed(6)
            }
          })
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    _getCommon() {
      getCommon('yes').then(data => {
        this.coin_data = data.data.currency
        this.fiatCurrency_data = data.data.fiatCurrency
        this.changeAllowPay(this.form.fiatCurrency)
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    accuracy(num) {
      if(num.toString().indexOf('.') == -1){
        return num * 100
      }
      let cifang = num.toString().split('.')[1].length;
      return num * Math.pow(10, cifang) * 100 / Math.pow(10, cifang)
    },
    accuracy2(num) {
      if(num.toString().indexOf('.') == -1){
        return num / 100
      }
      let cifang = num.toString().split('.')[1].length;
      return num * Math.pow(10, cifang) / (100 * Math.pow(10, cifang))
    },
    _getAdvertsDetails() {
      return getEditAdvertsDetails(this.id).then(data => {
        data = data.data
        this.form = Object.assign({}, data, {
          lockMinute: data.LockMinute,
          overPercent: this.accuracy(data.overPercent)
        })
        if (this.form.tradeType === 'buy') {
            this.tradeUnit = this.form.currency
          } else {
            this.tradeUnit = this.form.fiatCurrency
          }
        // this.form.desc = this.form.desc.replace(new RegExp("<br>", "gm"), "\n");
        // this.form.remark = this.form.remark.replace(new RegExp("<br>", "gm"), "\n");
        this.unitPrice = parseFloat(data.floatPrice).toFixed(6)
        this.canSubmit()
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    // 能否点击发布交易
    canSubmit(refresh=false) {
      if (refresh === true) {
        this._getPreset()
        this.changeAllowPay(this.form.fiatCurrency)
        this.form.overPercent = 0
        this.form.allowPay = []
        this.form.exchange = 'average'
        if (this.form.tradeType === 'buy') {
          this.form.orderFloorPrice = 1
          this.form.orderCeilPrice = 10
        } else {
          this.form.orderFloorPrice = 100
          this.form.orderCeilPrice = 1000
        }
      }
      this.isSubmit = true;
      for (let x in this.form) {
        if (this.form.hasOwnProperty(x)) {
          if (this.form[x] == null && x!=='usdt_floatPrice' && x!=='usdtFloorPrice' && x!=='usdtCeilPrice' ){
            console.log(x);
            return;
          } 
          if (this.form[x] instanceof Array && this.form[x].length === 0) return
        }
      }
      this.isSubmit = false;
    },
    // 发布交易合法性校验
    _isSubmit() {
      let noEmpty = this.$refs;
      console.log(noEmpty);
      for(var item in noEmpty){
        if(this.$refs[item].value.toString().trim() == ''){
          this.$message.error(this.$t('common.inputEmpty'))
          this.$refs[item].focus();
          return false;
        }
      }
      if (
        Number(this.form.overPercent) < this.overPercentLimit.min * 100 ||
        Number(this.form.overPercent) > this.overPercentLimit.max * 100 ||
        isNaN(Number(this.form.overPercent))
      ) {
        this.$message.error(this.$t('adver.overPercent', {min: this.overPercentLimit.min * 100, max: this.overPercentLimit.max * 100}));
        return false;
      }
      if (
        isNaN(Number(this.form.orderFloorPrice)) ||
        isNaN(Number(this.form.orderCeilPrice)) ||
        Number(this.form.orderFloorPrice) < 0 ||
        Number(this.form.orderCeilPrice) < 0
      ) {
        this.$message.error(this.$t('adver.limitErr'));
        return false;
      }
      if (Number(this.form.orderFloorPrice) > Number(this.form.orderCeilPrice)) {
        this.$message.error(this.$t('adver.noCan'));
        return false;
      }
      if (Number(this.form.orderFloorPrice) < 0) {
        this.$message.error(this.$t('adver.minLimit'))
        return false
      }
      if(this.form.orderFloorPrice.toString().indexOf('.') > -1){
        if(this.form.tradeType == 'buy'){
          if(this.form.orderFloorPrice.toString().replace(/^\d+\./, '').length > 8){
            this.$message.error(this.$t('common.fixed8'));
            return false;
          }
        }else{
          if(this.form.orderFloorPrice.toString().replace(/^\d+\./, '').length > 2){
            this.$message.error(this.$t('common.fixed2'));
            return false;
          }
        }
      }
      if(this.form.orderCeilPrice.toString().indexOf('.') > -1){
        if(this.form.tradeType == 'buy'){
          if(this.form.orderCeilPrice.toString().replace(/^\d+\./, '').length > 8){
            this.$message.error(this.$t('common.fixed8'));
            return false;
          }
        }else{
          if(this.form.orderCeilPrice.toString().replace(/^\d+\./, '').length > 2){
            this.$message.error(this.$t('common.fixed2'));
            return false;
          }
        }
      }
      /*
      if (this.form.tradeType === 'buy' && +this.form.limitPrice < +this.unitPrice) {
        this.$message.error('可接受最高价不能小于浮动单价')
        return false
      }
      if (this.form.tradeType === 'sell' && +this.form.limitPrice > +this.unitPrice) {
        this.$message.error('可接受最低价不能大于浮动单价')
        return false
      }
      */
      return true;
    },
    // 取消按钮
    cancel() {
      location.reload();
    },
    handleExchange(exchange) {
      this.canSubmit()
      this.exchangeList.forEach(item => {
        if (item.name === exchange) {
          this.unitPrice = Number(item.value).toFixed(6)
          this.u2 = this.unitPrice
        }
      })
    },
    handlePercent() {
      this.canSubmit()
      let n = Number(this.form.overPercent)
      if (!isNaN(n)) {
        n = n / 100
        this.unitPrice = parseFloat((1 + n) * this.u2).toFixed(6)
      } else {
        this.unitPrice = this.u2
      }
    },
    // 根据货币切换支付方式
    changeAllowPay(fiatCurrency) {
      let _this = this;
      let allowPay = [];
      _this.allowPayData = [];
      console.log(_this.myPay)
      this.fiatCurrency_data.forEach(item => {
        if (fiatCurrency === item.name) {
          allowPay = item.allowPay
        }
      })
      console.log(allowPay)
      allowPay.forEach((item)=>{
        console.log(allowPay);
        console.log(item )
        if(_this.myPay.includes(item)){
          _this.allowPayData.push(
            {payType: item, canUse: true}
          )
        }else{
          _this.allowPayData.push(
            {payType: item, canUse: false}
          )
        }
      })
      console.log(_this.allowPayData)
    }
  }
};
</script>
<style lang="scss">
.explain{
  font-size: 12px;
  color: #999;
  margin: 10px 0 20px 0;
  width: 100%;
}
.exchange-create-form {
  .form-title {
    padding-bottom: 10px;
    margin-bottom: 25px;
    border-bottom: 1px solid #dfe4ed;
  }
  .form-control {
    /*padding-top: 10px;*/
    padding-bottom: 30px;

    .form-label,
    .form-input {
      /*line-height: 35px;*/
    }
    .form-label {
      color: #28292d;
    }
    .form-input {
      color: #5a5e66;
      .form-radio {
        margin-bottom: 15px;
      }
      .el-input {
        width: 100%;
      }
    }
    .form-description {
      padding-left: 15px;
      color: #abb4c5;
    }
  }
}
</style>
