<template>
  <layout>
    <div slot="head" class="head">
      <h1 class="title">{{$t('account.recharge.newTitle', {currency: currency})}}</h1>
    </div>
    <div slot="body" class="body">
      <div class="center">
        <p class="p1">{{$t('account.recharge.confirm', {currency: currency})}}</p>
        <el-button @click="_applyaddress" type="success">{{$t('account.recharge.apply')}}</el-button>
        <router-link to="/account/wallets">
          <el-button>{{$t('common.goBack')}}</el-button>
        </router-link>
      </div>
    </div>
  </layout>
</template>

<script>
import { applyaddress } from 'api/account.js'

export default {
  created() {
    this.currency = this.$route.query.id
  },
  methods: {
    _applyaddress() {
      applyaddress(this.currency).then(data => {
        this.$router.push(`/account/recharge?id=${this.currency}`)
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  .title {
    text-align: center;
  }
}
.body {
  .center {
    width: 440px;
    margin: 0 auto;
    .p1 {
      padding-bottom: 40px;
      margin-bottom: 40px;
      font-size: 16px;
      border-bottom: 1px solid rgba(222,222,222,0.46);
    }
    .el-button {
      display: block;
      width: 100%;
      margin-bottom: 16px;
      margin-left: 0;
    }
  }
}
</style>
