<template>
  <layout>
    <div slot="head" class="head container-box">
      <router-link tag="div" to="/account/wallets">
        <el-button type="info" plain size="mini">{{$t('account.return')}}</el-button>
      </router-link>
      <h1>{{ $t('account.withdraw.title', {currency: currency})}}</h1>
      <p class="state">
        {{ $t('account.withdraw.hint') }}
      </p>
      <!--<router-link class="how" tag="p" to="#">
        {{ $t('account.withdraw.how') }}
      </router-link>-->
      <!--<el-alert
        :title="$t('account.withdraw.warning')"
        type="warning"
        :closable="false">
      </el-alert>-->
    </div>
    <div slot="body" class="body">
      <div class="container-box">
        <div class="box">
          <div class="head">
            <h1>{{ $t('account.withdraw.address', {address: currency}) }} </h1>
            <!--<p class="p1">{{ $t('account.withdraw.limit', {currency: currency, total: 20, now: 20}) }}
              <router-link class="boost" to="#">{{ $t('account.withdraw.improve') }}</router-link>
              <router-link tag="span" :to="'/account/withdraw/addsite?currency='+currency">
                <el-button size="mini" type="success">{{ $t('account.withdraw.addsite') }}</el-button>
              </router-link>
            </p>-->
            <router-link tag="span" :to="'/account/withdraw/addsite?currency='+currency">
                <el-button size="mini" type="success">{{ $t('account.withdraw.addsite') }}</el-button>
              </router-link>
          </div>
          <ul class="list">
            <li class="l1">
              <div>{{$t('common.table.currency')}}</div>
              <div>{{$t('common.table.label')}}</div>
              <div class="site">{{$t('common.table.site')}}</div>
              <div>{{$t('common.table.operate')}}</div>
            </li>
            <li class="l2" v-for="(item,index) in withdrawsAddress" :key="index">
              <div>{{item.currency}}</div>
              <div class="breakAll">{{item.toMark}}</div>
              <div class="breakAll site">{{item.to}}</div>
              <div>
                <!--<router-link to="/account/withdraw/addsite">
                  <el-button plain size="mini">编辑</el-button>
                </router-link>-->
                <el-button plain size="mini" @click.native="deleteAddress(item._id)">{{$t('common.table.delete')}}</el-button>
                <a href="javascript:void(0)" @click="goRefer(item, mount)">
                  <el-button type="success" plain size="mini">{{$t('common.table.withdraw')}}</el-button>
                </a>
              </div>
            </li>
          </ul>
        </div>
        <div class="box">
          <div class="head">
            <h1>{{$t('common.table.history')}}</h1>
          </div>
          <ul class="list">
            <li class="l1">
              <div>{{$t('common.table.currency')}}</div>
              <div>{{$t('common.table.time')}}</div>
              <div>{{$t('common.table.number')}}</div>
              <div>{{$t('common.table.siteLabel')}}</div>
              <div>{{$t('common.table.state')}}</div>
              <div>{{$t('common.table.detail')}}</div>
            </li>
            <li class="l2" v-for="(item,index) in records" :key="index">
              <div>{{item.currency}}</div>
              <div>{{item.createTime | datetimeFormat}}</div>
              <div>{{item.amount}}</div>
              <div class="breakAll">{{item.toRemark}}</div>
              <div>{{$t('account.record.status.'+ item.status)}}</div>
              <router-link :to="'/account/record/details?type=withdraws&id='+item._id" tag="div">
                <el-button plain size="mini">{{$t('common.table.showDetail')}}</el-button>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  data () {
    return {
      records: [],
      withdrawsAddress: [],
      mount: {
        currencyAmount: 0,
        availableAmount: 0,
        feeAmount: 0,
        withdrawsMin: 0
      }
    }
  },
  methods: {
    goRefer: function(address, mount){
      this.$router.push({path: '/account/withdraw/refer', query:{address: JSON.stringify(address), mount: JSON.stringify(mount)} })
    },
    deleteAddress: function(id){
      this.$http.post('/account/withdraws_delete', {addressId: id}).then(res=>{
        if(res.data.code == 0){
          this.$message.success(this.$t('account.delete'));
          this.getCoinList();
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    },
    getCoinList: function(){
      this.$http.get('/account/withdraws_apply', {params: {
        currency: this.currency
      }}).then(res=>{
        if(res.data.code == 0){
          this.records = res.data.data.records;
          this.withdrawsAddress = res.data.data.withdrawsAddress;
          this.mount.availableAmount = res.data.data.availableAmount;
          this.mount.currencyAmount = res.data.data.currencyAmount;
          this.mount.feeAmount = res.data.data.feeAmount;
          this.mount.withdrawsMin = res.data.data.withdrawsMin;
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    }
  },
  created () {
    this.currency = this.$route.query.currency;
    this.getCoinList();
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

  .head {
    h1 {
      margin: 30px 0;
      font-weight: bold;
    }
    .state {
      font-size: 16px;
      font-weight: bold;
      color: rgba(42,42,65,0.7);
    }
    .how {
      color: $color-theme;
      cursor: pointer;
    }
  }
  .body {
    .box {
      h1 {
        margin-top: 40px;
        margin-bottom: 24px;
      }
      .head {
        display: flex;
        justify-content: space-between;
        .boost {
          border-bottom: 1px dotted #333333;
          margin: 0 8px;
        }
      }
      .p1 {
        line-height: 50px;
      }
      .list {
        .l1 {
          padding: 0 16px;
          color: gray;
        }
        .l2 {
          margin-top: 16px;
          line-height: 28px;
          border: 1px solid rgba(151,151,151,0.1);
          box-shadow: 0 1px 1px 0 rgba(0,0,0,0.15);
          border-radius: 4px;
          background-color: #fff;
        }
        li {
          display: flex;
          justify-content: space-between;
          padding: 16px;

          &>div {
            width: 20%;
          }
          .site {
            width: 40%;
          }
        }
      }
    }
  }
</style>
