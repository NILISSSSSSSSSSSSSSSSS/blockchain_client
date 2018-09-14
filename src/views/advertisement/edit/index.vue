<template>
  <div class="exchange-create-container">
    <!--登录提示警告-->
    <el-alert
      v-if="!token"
      type="warning"
      title=""
      show-icon>
      <slot name="title">{{$t('adver.index.hint.created')}}
          <router-link to="/login">{{$t('adver.index.hint.login')}}</router-link>
          {{$t('adver.index.hint.or')}}
          <router-link to="/register">{{$t('adver.index.hint.register')}}</router-link>
      </slot>
    </el-alert>
    <el-alert
      v-if="!$store.state.verify.twoPhase"
      type="warning"
      title=""
      show-icon>
      <slot name="title">{{$t('adver.index.hint.created')}}
          <router-link to="/personcenter/verify_twostep">{{$t('adver.two')}}</router-link>
      </slot>
    </el-alert>
    <el-alert
      v-if="noTwo"
      title=""
      style="padding: 15px 10px"
      type="warning">
      <slot name="title">{{$t('adver.index.clause.mustTwo')}}
        <router-link style="margin-left: 10px" to="/personcenter/verify_twostep">{{$t('adver.index.clause.goTwo')}}</router-link>
      </slot>
    </el-alert>
    <!--创建广告的条款信息-->
    <div class="clause-of-ads-creation">
      <h2 class="big-title">
        {{$t('adver.index.clause.title')}}
      </h2>
      <ul class="clause-list">
        <li v-if="data.trade === 'sell'" v-html="$t('adver.index.clause.se1', {currency: data.currency, low: data.minAmount})"></li>

        <li v-if="data.adverFee === 'self'"
          v-html="$t('adver.index.clause.se13', {currency: data.currency, amount: data.advertiseCostAmount})"></li>
        <li v-if="data.adverFee === 'official'"
          v-html="$t('adver.index.clause.se14', {currency: data.currency, amount: data.advertiseCostAmount, official: data.officialFee})"></li>
        <li v-if="data.adverFee === 'optional'"
          v-html="$t('adver.index.clause.se15', {currency: data.currency, amount: data.advertiseCostAmount, official: data.officialFee, discount: data.officialFeePercent})"></li>

        <li v-if="data.orderFee === 'self' || data.currency === data.officialFee"
          v-html="$t('adver.index.clause.se16', {currency: data.currency,num: data.orderFeePercent})"></li>
        <li v-else-if="data.orderFee === 'official'"
          v-html="$t('adver.index.clause.se17', {currency: data.currency,num: data.orderFeePercent, currency: data.currency ,official: data.officialFee})"></li>
        <li v-else-if="data.orderFee === 'optional'"
          v-html="$t('adver.index.clause.se18', {currency: data.currency,num: data.orderFeePercent, official: data.officialFee, discount: data.officialFeePercent})"></li>

        <li>{{$t('adver.index.clause.se2')}}</li>
        <li>{{$t('adver.index.clause.se4')}}</li>
        <li>{{$t('adver.index.clause.se5')}}</li>
        <li>{{$t('adver.index.clause.se6')}}</li>
        <li>{{$t('adver.index.clause.se7')}}</li>
        <li>{{$t('adver.index.clause.se8', {siteName: $store.state.common.siteName})}}</li>
        <li>{{$t('adver.index.clause.se9')}}</li>
        <li>{{$t('adver.index.clause.se10')}}</li>
        <li v-html="$t('adver.index.clause.se11', {day: data.adVisibleTime / (1000 * 60 * 60 * 24)})"></li>
      </ul>
    </div>
    <create-form class="exchange-create-form" @twostepEmit="needTwo"
      @update="update"></create-form>
  </div>
</template>
<script>
  import createForm from './adForm.vue';
  import { mapGetters } from 'vuex'
  export default {
    components: {
      createForm
    },
    data () {
      return {
        noTwo: false,
        data: {}
      }

    },
    methods: {
      needTwo :function(){
        this.noTwo=true;
        document.documentElement.scrollTop = document.body.scrollTop = 0;
      },
      update(data) {
        data.orderFeePercent = data.orderFeePercent * 100
        data.officialFeePercent = (1 - data.officialFeePercent) * 100

        this.data = data
      }
    },
    computed: {
      ...mapGetters(['token'])
    }
  }
</script>
<style lang="scss">
.exchange-create-container{
    padding: 16px;
    max-width: 1200px;
    margin: 0 auto;
  /*广告条款*/
  .clause-of-ads-creation{
    margin-top: 30px;
    .clause-list{
      padding-left: 17px;
      font-size: 14px;
      color: #7C828E;
      li{
        list-style: disc;
        strong{
          color: #28292D;
        }
      }
    }
  }
  /*表单*/
  .exchange-create-form{
    margin-top: 30px;
  }
  .el-alert {
    margin-top: 16px;
  }
}
</style>
