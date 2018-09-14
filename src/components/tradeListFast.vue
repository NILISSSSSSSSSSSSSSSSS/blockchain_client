<template>
  <div class="tradeList" >
    <ul v-if="showData.length > 0">
      <li v-for="(item, index) of showData" :key="index">
        <!-- 头像部分 -->
        <div class="name">
          <img :src="item.owner.avatar" width="48" height="48" v-if="item.owner.avatar" @click="$router.push('/user?id='+item.owner._id)">
          <img src="~assets/imgs/user_default_pic.png" alt="" width="48" height="48" v-else @click="$router.push('/user?id='+item.owner._id)">
          <router-link :to="'/user?id='+item.owner._id" class="username" style="display: block;">{{ item.owner.name }}</router-link>
        </div>
        <!-- 交易部分 -->
        <div class="trade-info">
          <div class="tradeAmount">
            <p class="p1">
              {{$t('tradeList.limit')}}
              {{ trade === 'buy' ? item.usdtFloorPrice.toFixed(6) + '-' +item.usdtCeilPrice.toFixed(6) : item.orderFloorPrice + '-' + item.orderCeilPrice }}
              <span class="p2">{{ trade === 'buy' ? configFiatBi : item.currency }}</span>
            </p>
          </div>
          <div class="price">
            <p class="p1">{{$t('tradeList.unit')}}
              {{ item.usdt_floatPrice.toFixed(6) }}
              <span class="p2">{{
                configFiatBi + ' / ' + item.currency
            }}</span>
            </p>
          </div>
        </div>
        <!-- 买入按钮 -->
        <div class="handle">
            <el-button type="success" size="mini" @click="showDialog(item)">
                {{ $t('tradeList.trade', {trade: trade === 'buy' ? $t('common.buy') : $t('common.sell')}) }}
            </el-button>
        </div>
      </li>
    </ul>

    <emptyBox :text="$t('common.noData')" v-else></emptyBox>
    
    <el-pagination :background="true"
      v-if="(count > pageSize)"
      @current-change="changePage"
      layout="prev, pager, next, jumper"
      :page-size="pageSize"
      :total="count" >
    </el-pagination>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="orderDialog"
      width="560px"
      center>
      <el-form class="form" >
               <div class="amountBox">
                 <!-- 如果是买，第一个表单就写usdt，第二个表单就写其他币;如果是卖，第一个表单就写卖的币，第二个表单就写usdt -->
                   <!-- 数量1 -->
                  <el-form-item  class="amountDiv">
                    <p>{{trade === 'buy' ? this.$t('outside.orders.input.fiat', {fiatCurrency: configFiatBi}) : this.$t('outside.orders.input.sellCurrency', {currency: currencyLei})}} ?</p>
                    <el-input @input="handLeftAmount"  min="0"  class="margin12" v-model="form.amount"/>
                  </el-form-item>
                    <icon class="icon" name="arrow-right" scale="2"></icon>
                    
                  <!-- 数量2 -->
                  <el-form-item  class="amountDiv">
                      <p>{{trade === 'buy' ? this.$t('outside.orders.input.sellFiat', {fiatCurrency:currencyLei}) : this.$t('outside.orders.input.sellFiat', {fiatCurrency: configFiatBi})}}</p>
                    <el-input  @input="handRightAmount" min="0" class="margin12" v-model="form.amount2"/>
                  </el-form-item>
               </div>
                <el-tabs v-model="activeName" class="margin12" @tab-click="formReset()">
              <!-- 手机号码验证 -->
              <el-tab-pane :label="$t('account.refer.verify')" name="phone" >
                <div class="code" v-if="authlist.phone">
                     <el-input v-model="code" :placeholder="$t('account.refer.code')">
                      <template slot="append">
                        <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
                          {{ getCodeButton }}
                        </el-button>
                      </template>
                    </el-input>
                </div>
                <router-link class="google_a" to="/personcenter/verify_phone" v-else target="_blank">{{$t('common.gotoBindPhone')}}</router-link>
              </el-tab-pane>
                <!-- 谷歌验证 -->
              <el-tab-pane :label="$t('account.refer.verify_google')" name="twoPhase" >
                <div class="code" v-if="authlist.twoPhase">
                    <el-input v-model="code_google" :placeholder="$t('account.refer.code_google')"></el-input>
                </div>
                <router-link class="google_a" to="/personcenter/verify_twostep" v-else>{{$t('common.gotoBindTwo')}}</router-link>
              </el-tab-pane>
            </el-tabs>

    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialog = false">取 消</el-button>
        <el-button type="primary"  @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { convert } from 'api/outside-trade'
import { getFastAdverts } from 'api/fastTrade'
import emptyBox from '@/components/emptyBox.vue'
 import { fastTradeBuy } from '@/api/fastTrade.js'
 import { getTranInfo } from "@/api/transfer.js";
 import {mapGetters,mapMutations} from 'vuex'
 let isYanZheng=false;
export default {
  components: {
    emptyBox
  },
   computed: {
    ...mapGetters(['authlist'])
  },
  props: {
    getAdverts: {},
    desc: '',
   
  },
  computed: {
   
  },
  data() {
    return {
       configFiatBi:"",
       authlist: {},
      listData: [],
      showData: [],
      pageSize: 10,
      count: 0,
      orderDialog: false,
      dialogTitle: '',
      advertiseId:"",
      currencyLei:"",

      convertType:"",
    //  -------
       form: {
          amount: 0,
          amount2:0,
        },
        phone: '',
        code: '',
        code_google: '',
        getCodeButton: "",
        isGetCode: false,
        activeName: "phone",
    } 
  },
    destroyed() {
      clearInterval(window.timmer);
    },
    mounted() {
      this.getCodeButton = this.$t("common.getCode");
    },
    created() {
      this.configFiatBi= localStorage.getItem("configFiatBi");
    },
  methods: {
     ...mapMutations(['setAuthlist']),
       //修改左边来改变右边
        handLeftAmount(oldVal) {
          let val = Number(oldVal)
          if (isNaN(val)) {
            oldVal= 0
            return
          }
          if (val == 0){
            this.form.amount2=0;
            return
          }
          this.trade === 'buy' ? this.convertType="currency" : this.convertType="fiatCurrency"
          convert({id: this.advertiseId, amount: val, convertTo: this.convertType}).then(data => {
            if(data.code===0){
              this.form.amount2=data.data.usdtAmount.toFixed(8)
            }
          }).catch(data => {
              this.$message.error(this.$t(`err.${data.code}`))
            })
    },
    //修改右边来改变左边
        handRightAmount(oldVal) {
          let val = Number(oldVal)
          if (isNaN(val)) {
            oldVal= 0
            return
          }
          if (val == 0){
            this.form.amount=0;
            return
          }
          this.trade === 'buy' ? this.convertType="fiatCurrency" : this.convertType="currency"
          convert({id: this.advertiseId, amount: val, convertTo: this.convertType}).then(data => {
            if(data.code===0){
              this.form.amount=data.data.usdtAmount.toFixed(8)
            }
          }).catch(data => {
              this.$message.error(this.$t(`err.${data.code}`))
            })
      },
    showDialog (item) {
       if(JSON.stringify(this.authlist) === '{}'){
         //验证个人信息
        this.getTranInfo();
       }
      this.formReset();
      
      this.orderDialog = true;
      this.dialogTitle = (this.trade === 'buy' ? this.$t('common.buy') : this.$t('common.sell')) +" "+item.currency;
      this.advertiseId=item._id;
      this.currencyLei=item.currency;
    },
      //验证个人信息
      getTranInfo() {
          getTranInfo().then(res => {
              this.authlist = res.data.authlist;
              this.setAuthlist(this.authlist)
          });
      },
    // 快速交易 广告列表接口
    getAdverList: function(params){
        getFastAdverts(params).then(data => {
          this.listData = data.data.list;
          this.count = data.data.count;
           this.showData = this.listData;
           console.error(this.showData)
          
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    //分页
    changePage(val) {
      var params = this.$route.query;
      params.tradeType = this.trade;
      params.page = val;
      this.getAdverList(params)
    },
      submit() {
        if(isNaN(this.form.amount) || isNaN(this.form.amount2)){
          this.$message.error(this.$t('common.extradeGeShiError'));
          return;
        }
       if(this.form.amount <=0 || this.form.amount2 <=0){
          this.$message.error(this.$t('common.extradeNums0'));
          return;
        }
        let data={};
        data.authMode = this.activeName;
        if(this.activeName === 'phone'){
          if(this.code.trim() == ''){
            this.$message.error(this.$t('transfer.code'));
            return;
          }
          data.authMode="phone";
          data.authCode = this.code;
        }
        if(this.activeName === 'twoPhase'){
          if(this.code_google.trim() == ''){
            this.$message.error(this.$t('transfer.code'));
            return;
          }
           data.authMode="twophase";
          data.authCode = this.code_google;
        }
        data.convertAmount = parseFloat(this.trade === 'buy' ? this.form.amount2 : this.form.amount);
        data.advertiseId = this.advertiseId;

        console.log(data);
        fastTradeBuy(data).then(res=>{
          this.$message.success(this.trade === 'buy' ? this.$t('fastTrade.buySuccess') : this.$t('fastTrade.sellSuccess'));
          this.orderDialog=false;
        }).catch(err=>{
          this.$message.error(err.code?this.$t('err.'+err.code):this.$t('common.serverErr'))
        })
      },

      // 获取验证码
      getCode() {
        const url = "/order/sendmsg";
        this._countDown();
        this.$http
          .post(url)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success(this.$t("account.send"));
            } else {
              this.$message.error(this.$t(`err.${res.data.code}`));
              this._countOver();
            }
          })
          .catch(err => {
            this.$message.error(this.$t("common.serverErr"));
            this._countOver();
          });
      },
      // 倒计时
      _countDown(second = 60) {
        const self = this;
        const end = new Date().getTime() + 1000 * second;
        window.timmer = setInterval(() => {
          this.isGetCode = true;
          const differ = Math.floor((end - new Date().getTime()) / 1000);
          self.getCodeButton = `${this.$t("common.getCode")}(${differ})`;
          if (differ < 1) {
            this.isGetCode = false;
            self.getCodeButton = this.$t("common.getCode");
            clearInterval(window.timmer);
          }
        }, 500);
      },
      _countOver() {
        console.log("===================");
        this.isGetCode = false;
        this.getCodeButton = this.$t("common.getCode");
        console.log(window.timmer);
        clearInterval(window.timmer);
      },
      // --------------
      formReset(){
        if(!this.orderDialog){
          this.form.amount=0;this.form.amount2=0;
        }
        this.code_google=this.code="";
      }
  },
  watch: {
    'getAdverts':{
      handler (val) {
        console.log(val)
        this.getAdverList(val);
        this.trade = val.tradeType
      },
      deep: true,
      immediate: true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';
  .el-dialog--center{
      width: 462px;
  }
  .content{
    min-height: 650px;
  }
  .google_a{
    color: #43cb83;
    display: inline-block;
    padding: 1px 0;
    border-bottom: 1px dotted #43cb83;
  }
  .tradeList {
     padding-top: 16px;
    padding-bottom: 16px;
    border-top: 1px solid #eeeeee;
    p {
      margin: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .name{
        width: 80px;
        text-align: left;
      }
      &.head {
        color: gray;
        padding: 0 16px;
      }
    }
    ul>li{
      padding: 8px 10px 8px 10px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 2px 0 rgba(180,180,180,0.3);
      .name {
        &:hover {
          cursor: pointer;
        }
        img {
          border-radius: 50%;
          vertical-align: middle;
          margin-bottom: 10px;
        }
        .username {
          vertical-align: middle;
        }
        .icon {
          vertical-align: middle;
        }
        .out {
          background-color: gray;
        }
        .time {
          margin: 0;
          font-size: 10px;
          color: gray;
          vertical-align: middle;
          .line {
            transform: translateY(4px);
          }
          .online {
            color: $color-theme;
          }
        }
      }
      .credit, .tradeAmount, .price {
        .p2 {
          font-size: 10px;
          color: gray;
        }
      }
      .tradeType {
        img {
          width: 20px;
          height: 20px;
        }
      }
      .handle {
        display: flex;
        align-items: center;
        a {
          color: #fff;
        }
      }
    }
    .el-pagination {
      text-align: center;
      margin-top: $distance-x2;
    }
  }
  .tradeAmount{
    margin-bottom: 5px;
  }
  .trade-info>.tradeAmount:last-child{
    margin-bottom: 0px;
  }
  .amountDiv{
    //  width: 50%;
    display: inline-block;
  }
  .amountBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon{
          color: #4aca85;
          margin-top: 13px;
    }
  }
</style>
