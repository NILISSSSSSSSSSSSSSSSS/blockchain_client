<template>
  <div class="container">
      <div class="left">
        <currentRate :getAdverts="{}"></currentRate>
      </div>
      <div class="right">
        <div class="deadline">
           <i class="el-icon-time"></i>{{$t('adver.detail.expire', {time: $moment(data.deadline)._format()})}}
        </div>

        <div class="content">
          <el-alert
            class="error"
            v-if="status !== 'online'"
            :title="errorText"
            type="error">
          </el-alert>

          <el-button class="paste"
            v-clipboard:copy="copyUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">{{$t('adver.detail.copy')}}</el-button>
          <div class="desc">
            <div class="desc_title">{{$t('common.tradeDesc')}}</div>
            <div class="desc_content">
              <p style="font-size: 13px;" v-html="data.desc"></p>
            </div>
          </div>

          <div class="detail">
            <div class="line1">
              <div><small>{{$t('common.table.name')}}</small><span class="uname">{{data.owner.name}}</span></div>
              <div><small>{{$t('common.table.tradeCount')}}</small><span class="deal_count">{{data.owner.tradeCount}}</span></div>
              <div><small>{{$t('common.table.tradeHistory')}}</small><span class="hostory">{{data.tradeSum.amount == 0? '0' : data.tradeSum.amount.toFixed(8)}} {{data.currency}}</span></div>
              <div><small>{{$t('common.table.rate')}}</small><span class="review_p">{{data.owner.positiveRate * 100 + '%'}}</span></div>
              <div><small>{{$t('common.commentCount')}}</small><span class="review">{{'+' + data.owner.positiveComment + ' / ' + '-' + data.owner.negativeComment}}</span></div>
            </div>
            <div class="line2">
              <div>
                <span>{{$t('common.table.float')}}</span>
                <p>{{data.floatPrice.toFixed(6) + ' ' + data.fiatCurrency + ' / ' + data.currency}}</p>
              </div>
              <div>
                <span>{{$t('common.table.quota')}}</span>
                <p>{{isSoldOut}}</p>
              </div>
              <div>
                <span>{{$t('common.table.tradeType')}}</span>
                <p>
                  <img v-for="item in data.allowPay" :key="item" :src="require('../../../assets/image/payment_'+item+'.png')">
                  <img height="17" style="vertical-align: middle;margin-top: -14px; width: 18px;" :src="require('../../../assets/image/payment_USDT.png')" alt="" :hidden="!data.isUSDT" :value="data.isUSDT">
                </p>
              </div>
              <div>
                <span>{{$t('common.table.deadline')}}</span>
                <p>{{data.LockMinute / 1000 / 60 + ' 分钟'}}</p>
              </div>
              <div>
                <span>{{$t('common.table.state')}}</span>
                <p>{{$t('adver.status.'+data.status)}}</p>
              </div>
            </div>

          </div>
          <div class="edit" @click="edit"><span>{{$t('common.table.editAdver')}}</span></div>
          <el-button type="success" class="down" @click.native="switchStatus()">{{statusText}}</el-button>
          <div class="hr"></div>
          <ul class="notice">
            <li>
              {{$t('adver.detail.notice1')}}
            </li>
            <li v-html="$t('adver.detail.notice2')">
            </li>
            <li>
              {{$t('adver.detail.notice3')}}
            </li>
            <li>
              {{$t('adver.detail.notice4')}}
            </li>
            <li>
              {{$t('adver.detail.notice5')}}
            </li>
            <li>
              {{$t('adver.detail.notice6')}}
            </li>
            <li>
              {{$t('adver.detail.notice7')}}
            </li>
          </ul>
          <!--<ul class="verify">
            <li><i class="el-icon-success"></i>{{$t('adver.detail.verify1', {num1: 500, num2: 5000, fiatCurrency: 'CNY'})}}</li>
            <li><i class="el-icon-success"></i>{{$t('adver.detail.verify2', {num: 5000, fiatCurrency: 'CNY'})}}</li>
            <li><i class="el-icon-warning"></i>{{$t('adver.detail.verify3')}}</li>
            <li>{{$t('adver.detail.state')}}</li>
          </ul>-->
        </div>

      </div>
  </div>
</template>

<script>
  import currentRate from '@/views/outside-trade/current-rate'
  import { getAdvertsDetails } from 'api/outside-trade'
  import { mapMutations } from 'vuex'
  export default {
    components: {
      currentRate
    },
    data () {
      return {
        copyUrl: '',
        data: {
          owner: {},
          floatPrice: 0,
          allowPay: [],
          tradeSum: {
            amount: 0
          }
        },
        statusText: '',
        errorText: '',
        status: 'online'
      }
    },
    computed: {
      isSoldOut () {
        if(this.data.orderFloorPrice > this.data.orderCeilPrice){
          return this.$t('common.soldOut')
        }else{
          return this.data.orderFloorPrice + ' ~ ' + this.data.orderCeilPrice + ' ' + (this.data.tradeType === 'buy' ? this.data.currency : this.data.fiatCurrency)
        }
      }
    },
    created() {
      this.getAD();
    },
    mounted () {

    },
    methods: {
      ...mapMutations(['setBasic']),
      getAD: function(){
        getAdvertsDetails(this.$route.params.id).then(data => {
          this.data = data.data;
          this.statusText = this.data.status == 'online'?this.$t('adver.off'):this.$t('adver.up')
          this.copyUrl = location.href.split('#')[0] + '#/outside-trade/orders/' + this.$route.params.id;
          this.status = data.data.status
          this.errorText = this.status === 'offline' ? this.$t('adver.offline') : this.$t('adver.delete')
          this.setBasic(JSON.stringify({currency: data.data.currency, fiatCurrency: data.data.fiatCurrency, tradeType: data.data.tradeType}))
        }).catch(data => {
          if(data.code == 40001){
            this.$router.push({path: '/outside-trade/orders/'+ this.$route.params.id});
            return
          }
          this.$message.error(this.$t(`err.${data.code}`))
        })
      },
      switchStatus: function(){
        let status = this.statusText == this.$t('adver.up') ? 'online':'offline'
        let data = {advertIds: [this.$route.params.id], status: status}
        this.$http.patch('/shop', data).then(res=>{
          if(res.data.code == 0){
           this.getAD();
          }
          else{
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        }).catch(err=>{
          this.$message.error(this.$t('common.serverErr'));
        })

      },
      edit: function(){
        this.$router.push('/advertisement/edit/'+this.$route.params.id)
      },
      onCopy: function (e) {
        this.$message({
          message: this.$t('adver.copySuccess'),
          type: 'success'
        });
      },
      onError: function (e) {
        this.$message.error(this.$t('adver.copyErr'));
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container{
    width: 1200px;
    margin: auto;
    padding: 30px 16px;
    display: flex;
    .left{
      width: 270px;
      margin-right: 20px;
    }
    .right{
      width: 100%;
      .deadline{
        width: 100%;
        background-color: #fcf8e3;
        border-color: #faebcc;
        color: #8a6d3b;
        padding: 15px;
      }
      .content{
        background-color: #ffffff;
        padding: 35px;
        box-shadow: 0 2px 4px 0 rgba(176,176,176,0.5);
        border-radius: 4px;
        position: relative;
        z-index: 99;
        .error {
          margin-bottom: 16px;
        }
        .paste{
          float: right;
        }
        .desc{
            line-height: 1.8em;
            margin: 20px 0 30px 2px;
            padding: 0 15px 0 10px;
            border-left: 5px solid #43CB83;
          .desc_title{
            font-size: 12px;
            color: #9B9B9B;
            margin-bottom: 10px;
          }
        }
      }
      .detail{
        background-color: #F6F6F6;
        border-radius: 4px;
        padding: 8px 0px 5px 0px;
        margin: 10px 0 10px 0;
        color: #4A4A4A;
        .line1{
          display: flex;
          padding: 10px 0 5px 0px;
          div{
            width: 20%;
            text-align: center;
            color: gray;
            font-size: 12px;
            font-weight: bold;
            small{
              font-size: 12px;
              color: #9B9B9B;
              margin: 0 3px 0 0;
              font-weight: 400;
            }
            span{
              font-size: 13px;
            }
          }
        }
        .line2{
          display: flex;
          margin-bottom: 5px;
          border-top: 3px solid #EDEDED;
          div{
            width: 20%;
            text-align: center;
            span{
              font-size: 10px;
              color: #9B9B9B;
            }
            p{
              img{
                width: 22px;
              }
            }
          }
        }

      }
      .edit{
        text-align: center;
        span{
          color: #43CB83;
          text-decoration: underline;
          &:hover{
            color: #333;
            cursor: pointer;
          }
        }
      }
      .down{
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
        float: initial;
      }
      .hr{
        width: 100%;
        height: 1px;
        margin:10px 0 20px 0;
        background-color: #eeeeee;
      }
      .notice{
        line-height: 1.8em;
        letter-spacing: 0.01em;
      }
      .verify{
        background-color: #d9edf7;
        border-color: #bce8f1;
        color: #31708f;
        border: 1px solid transparent;
        padding: 15px;
        margin-top: 20px;
        li{
          line-height: 1.8em;
          letter-spacing: 0.01em;
          span{
            text-decoration: underline;
            color: #555;
          }
        }
      }
    }

  }
</style>
