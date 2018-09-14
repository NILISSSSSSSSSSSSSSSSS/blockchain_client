<template>
  <div class="container container-box">
    <el-card class="box-card">
      <div class="wide-width user__show user__show-header">
        <div class="user-avatar">
          <img :src="info.avatar" alt="Mdimage f58cdd50 1da6 4563 8f64 fb9859cc7a53" width="120" height="120" v-if="info.avatar" @click="$router.push('')">
          <img src="~assets/imgs/user_default_pic.png" alt="Mdimage f58cdd50 1da6 4563 8f64 fb9859cc7a53" width="120" height="120" v-else>
          <p class="name">{{info.name}}</p>
          <p class="online-status" v-if="info.isOnline"><span class="icon"></span><span class="status-text green-text">{{$t('user.online')}}</span></p>
          <p class="offline-status" v-else><span class="icon"></span><span class="status-text green-text">{{$t('user.offline')}}</span></p>
        </div>
        <div class="info-group user-rating">
          <p class="item"><span class="title">{{$t('user.tradeAmount')}}</span>{{info.tradeCount}}</p>
          <p class="item"><span class="title">{{$t('user.comment')}}</span><span class="good">+{{info.positiveComment}}</span>/<span class="bad">-{{info.negativeComment}}</span></p>
          <p class="item"><span class="title">{{$t('user.rate')}}</span>{{positiveRate}}%</p>
        </div>
        <div class="info-group auth-info">
          <p class="item"><span class="title">{{$t('user.verify1')}}</span><span>{{$t('user.verify2Status')}} </span><i class="fa fa-check verified-checked"></i></p>
          <p class="item"><span class="title">{{$t('user.verify2')}}</span><span>{{info.phone?$t('user.verify2Status'):$t('user.verify1Status')}} </span></p>
          <!--<p class="item"><span class="title">实名验证：</span><span>已完成 </span><i class="fa fa-check verified-checked"></i></p>
          <p class="item"><span class="title">进阶验证：</span><span>未完成 </span></p>-->
        </div>
        <div class="info-group user-log">
          <p class="item"><span class="title">{{$t('user.register')}}</span>{{info.registerTime | dateFormat}}</p>
          <p class="item"><span class="title">{{$t('user.last')}}</span>{{info.signinTime | dateFormat}}</p>
          <!--<div class="item btn"><el-button>加入信任名单</el-button></div>
          <div class="item btn"><el-button>加入黑名单</el-button></div>-->
        </div>

        <div>

        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <el-tabs v-model="activeName">
        <!--<el-tab-pane :label="$t('user.title1')" name="first">
          <ul class="general-lists reivews-lists" v-if="evaluation.length > 0">
            <li class="item header">
              <span class="width-24">{{$t('common.table.tradeAdver')}}</span>
              <span class="width-16">{{$t('common.comment')}}</span>
              <span class="width-auto">{{$t('common.commentContent')}}</span>
              <span class="width-18">{{$t('common.commentDate')}}</span>
              <span class="width-16">{{$t('common.commentUser')}}</span>
            </li>
            <li class="item" v-for="(item, index) in 	evaluation" :key="index">
              <span class="width-24"><a target="_blank" href="/offers/17f3a5688b3eabe2066b4656">diaochan704 购买 OTB</a></span>
              <span class="width-16 review-rating"><i class="fa fa-bookmark good"></i> 好评</span>
              <span class="width-auto review-content">好评好评好评好评好评好评好评好评好评！！！</span>
              <span class="width-18">2018-03-06 17:07</span>
              <span class="width-16"><router-link target="_blank" to="/user">jiangink</router-link></span>
            </li>
          </ul>
          <emptyBox text="暂无相关评价记录" v-else></emptyBox>
        </el-tab-pane>-->
        <el-tab-pane :label="$t('user.title2')" name="first" >
          <ul v-if="adverList_S.length > 0">
            <li class="item header">
              <span class="width-10">{{$t('common.table.sellCurrency')}}</span>
              <span class="width-10">{{$t('common.table.sellCurrency2')}}</span>
              <span class="width-12">{{$t('common.table.sellUnit')}}</span>
              <span class="width-18">{{$t('common.table.quota')}}</span>
              <span class="width-16">{{$t('common.table.tradeType')}}</span>
              <span class="width-16">{{$t('common.table.lastUpdate')}}</span>
              <span class="width-10">{{$t('common.table.adverStatus')}}</span>
              <span class="width-8">{{$t('common.table.operate')}}</span>
            </li>
            <li class="item" v-for="(item, index) in adverList_S" :key="index" >
              <span class="width-10">{{item.currency}}</span>
              <span class="width-10">{{item.fiatCurrency}}</span>
              <span class="width-12">{{item.floatPrice.toFixed(6)}}{{item.fiatCurrency}}</span>
              <span class="width-18">  {{item.orderFloorPrice}}-{{item.orderCeilPrice}}{{item.fiatCurrency}}</span>
              <span class="width-16">
                <span v-for="(paytype, index) in item.allowPay" :key="index">
                  <span class="payment-icon"  v-show="paytype == 'alipay'"><img src="~assets/image/payment_alipay.png" alt="Payment alipay"></span>
                  <span class="payment-icon"  v-show="paytype == 'wechat'"><img src="~assets/image/payment_wechat.png" alt="Payment wechat"></span>
                  <span class="payment-icon"  v-show="paytype == 'unionpay'"><img src="~assets/image/payment_card.png" alt="Payment card"></span>
                  <span class="payment-icon"  v-show="paytype == 'paypal'"><img src="~assets/image/payment_paypal.png" alt="Payment card"></span>
                </span>
              </span>
              <span class="width-16">{{item.createTime | datetimeFormat}}</span>
              <span class="width-10">{{status(item.status)}}</span>
              <span class="width-8"><router-link target="_blank" :to="'/advertisement/'+item._id">{{$t('common.check')}}</router-link></span>
            </li>
          </ul>
          <emptyBox :text="$t('common.noData')" v-else></emptyBox>
        </el-tab-pane>
        <el-tab-pane :label="$t('user.title3')" name="second">
          <ul v-if="adverList_B.length > 0">
            <li class="item header">
              <span class="width-10">{{$t('common.table.buyCurrency')}}</span>
              <span class="width-10">{{$t('common.table.buyCurrency2')}}</span>
              <span class="width-12">{{$t('common.table.buyUnit')}}</span>
              <span class="width-18">{{$t('common.table.quota')}}</span>
              <span class="width-16">{{$t('common.table.tradeType')}}</span>
              <span class="width-16">{{$t('common.table.lastUpdate')}}</span>
              <span class="width-10">{{$t('common.table.adverStatus')}}</span>
              <span class="width-8">{{$t('common.table.operate')}}</span>
            </li>
            <li class="item" v-for="(item, index) in adverList_B" :key="index" >
              <span class="width-10">{{item.currency}}</span>
              <span class="width-10">{{item.fiatCurrency}}</span>
              <span class="width-12">{{item.floatPrice.toFixed(6)}} {{item.fiatCurrency}}</span>
              <span class="width-18"> {{item.orderFloorPrice}}-{{item.orderCeilPrice}} {{item.currency}}</span>
              <span class="width-16">
                <span v-for="(paytype, index) in item.allowPay" :key="index">
                  <span class="payment-icon"  v-show="paytype == 'alipay'"><img src="~assets/image/payment_alipay.png" alt="Payment alipay"></span>
                  <span class="payment-icon"  v-show="paytype == 'wechat'"><img src="~assets/image/payment_wechat.png" alt="Payment wechat"></span>
                  <span class="payment-icon"  v-show="paytype == 'unionpay'"><img src="~assets/image/payment_card.png" alt="Payment card"></span>
                  <span class="payment-icon"  v-show="paytype == 'paypal'"><img src="~assets/image/payment_paypal.png" alt="Payment card"></span>
                </span>
              </span>
              <span class="width-16">{{item.createTime | datetimeFormat}}</span>
              <span class="width-10">{{status(item.status)}}</span>
              <span class="width-8"><router-link target="_blank" :to="'/advertisement/'+item._id">{{$t('common.check')}}</router-link></span>
            </li>
          </ul>
          <emptyBox :text="$t('common.noData')" v-else></emptyBox>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import emptyBox from '@/components/emptyBox.vue'
export default {
  components: {
    emptyBox
  },
  data () {
    return {
      adverList_S: [],
      adverList_B: [],
      userId: '',
      activeName: 'first',
      debounce: false,
      info: '',
      adverList: [],
      evaluation: []
    }
  },
  computed: {
    positiveRate: function(){
      return (this.info.positiveRate*100).toFixed(2);
    },

  },
  methods: {
    status: function(s){
      switch (s) {
        case 'online':
          return this.$t('user.yetOnline');
        case 'offline':
          return this.$t('user.yetOffline');
        case 'delete':
          return this.$t('user.yetDelete');
        case 'complete':
          return this.$t('user.yetCompelete');
        case 'expire':
          return this.$t('user.yetExpire');
      }
    },
    getInfo () {
      this.$http.get(`/users/pubDetail/${this.userId}`).then(res=>{
        if(res.data.code == 0){
          localStorage.userInfo = JSON.stringify(res.data.data);
          this.info = res.data.data;
        }else {
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error(this.$t('common.serverErr'));
      }).catch(res => {
          this.$message.error(res.data.msg[0])
        })
    },
    getAdverList_B () {
      this.$http.get(`/shop/pubList?tradeType=buy&userId=${this.userId}`).then(res=>{
        if(res.data.code == 0){
          this.adverList_B = res.data.data.list;
        }else {
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error(this.$t('common.serverErr'));
      })
    },
    getAdverList_S () {
      this.$http.get(`/shop/pubList?tradeType=sell&userId=${this.userId}`).then(res=>{
        if(res.data.code == 0){
          this.adverList_S = res.data.data.list;
        }else {
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error(this.$t('common.serverErr'));
      })
    },
  },
  created() {
    this.userId = this.$route.query.id;
    this.getInfo();
    this.getAdverList_B();
    this.getAdverList_S()
  }
}
</script>

<style lang="scss" scoped>
  .container{
    margin: auto;
    padding: 10px 16px;
    .wide-width{
      display: flex;
      justify-content: space-between;
      .user-avatar{
        width: 19%;
        min-width: 200px;
        text-align: center;
        line-height: 1.2;
        img{
          width: 120px;
          height: 120px;
          border-radius: 50%;
        }
        .name{
          margin: 10px auto 5px;
          font-size: 1.28em;
        }
        .online-status{
          margin-top: 5px;
          .icon{
            display: inline-block;
            vertical-align: top;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 3px solid #5cb85c;
          }
          .status-text{
            color: #43CB83;
            margin-left: 3px;
            font-size: 13px;
          }
        }
        .offline-status{
          margin-top: 5px;
          .icon{
            display: inline-block;
            vertical-align: top;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 3px solid #e1d4d4;
          }
          .status-text{
            color: #bbc1c8;
            margin-left: 3px;
            font-size: 13px;
          }
        }
      }
      .info-group{
        width: 27%;
        .item{
          margin-bottom: 12px;
          color: #4A4A4A;
          .title{
            display: inline-block;
            letter-spacing: 0;
            width: 150px;
            text-align: right;
            color: rgba(42,42,65,0.5);
          }
          .good{
            color: #43CB83;
            padding-right: 4px;
          }

        }
        .btn{
          text-align: center;
          .el-button{
            font-size: 13px;
          }

        }
      }
    }
    .el-tabs{
      .item{
        padding-bottom: 15px;
        display: flex;
        .width-24{
          width: 24%;
        }
        .width-auto{
          width: auto;
          flex: 1;
        }
        .width-16{
          width: 16%;
        }
        .width-18{
          width: 18%;
        }
        .width-10{
          width: 10%;
        }
        .width-12{
          width: 12%;
        }
        .width-8{
          width: 8%;
        }
        .payment-icon img{
          display: inline-block;
          vertical-align: baseline;
          width: 20px;
          height: 20px;
          margin: 0 2px 0 0
        }
      }
      .header{
        padding: 0 0 25px;
        color: rgba(42,42,65,0.5);
      }
      a{
        color: #43CB83;
      }
    }
  }
</style>

