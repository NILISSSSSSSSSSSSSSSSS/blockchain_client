<template>
  <layout>
    <div slot="head" class="head container-box">
      <h1>{{$t('account.refer.title', {currency: address.currency})}}</h1>
      <p class="notice">
        {{$t('account.refer.notice')}}
        <!--<span>{{$t('account.refer.see')}}</span>-->
      </p>
      <span class="state">
        {{$t('account.refer.confirm')}}
      </span>
      <div class="info">
        <ul class="list">
          <li class="l1">
            <div>{{$t('common.table.currency')}}</div>
            <div>{{$t('common.table.siteLabel')}}</div>
            <div class="site">{{$t('common.table.withdrawSite')}}</div>
            <div>{{$t('common.table.balance')}}</div>
          </li>
          <li class="l2">
            <div>{{address.currency}}</div>
            <div>{{address.toMark}}</div>
            <div class="site">{{address.to}}</div>
            <div>{{mount.currencyAmount}} {{address.currency}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div slot="body" class="body container-box">
      <div class="wrap">
        <div class="hint">
          <div v-if="currencyInfo.setFee === 'self' || currencyInfo.currency === currencyInfo.officialCurrency">
            <p class="p1">{{$t('account.refer.cost', {feeAmount: currencyInfo.selfFee, currency: currencyInfo.selfCurrency})}}</p>
          </div>
          <div v-else-if="currencyInfo.setFee === 'official'">
            <p class="p1">{{$t('account.refer.costOfficial', {fee: currencyInfo.officialFee, official: currencyInfo.officialCurrency})}}</p>
          </div>
          <div v-else-if="currencyInfo.setFee === 'optional'">
            <p class="p1">{{$t('account.refer.costOptional', {feeAmount: currencyInfo.selfFee, currency: currencyInfo.selfCurrency, fee: currencyInfo.officialFee, official: currencyInfo.officialCurrency})}}</p>
          </div>
          <p class="p2">{{$t('account.refer.min', {withdrawsMin: mount.withdrawsMin, currency: address.currency}) }}</p>

        </div>
        <div class="number">
          <el-input v-model="form.amount" type="number" :placeholder="$t('account.refer.number')"></el-input>
          <span class="click">{{$t('account.refer.can', {availableAmount: mount.availableAmount, currency: address.currency})}}</span>
        </div>
        <div>
          <el-input v-model="form.userMessage" :placeholder="$t('common.remark')"></el-input>
        </div>
        <div class="verify">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('account.refer.verify')" name="mobile">
              <div class="code" v-if="$store.state.verify.phone">
                <el-input v-model="code" :placeholder="$t('account.refer.code')">
                  <template slot="append">
                    <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
                      {{ getCodeButton }}
                    </el-button>
                  </template>
                </el-input>
              </div>
              <router-link to="/personcenter/verify_phone" v-else target="_blank">{{$t('common.gotoBindPhone')}}</router-link>
            </el-tab-pane>
            <el-tab-pane :label="$t('account.refer.verify_google')" name="twophase">
              <div class="code" v-if="$store.state.verify.twoPhase">
                <el-input v-model="code_google" :placeholder="$t('account.refer.code_google')"></el-input>
              </div>
              <router-link to="/personcenter/verify_twostep" v-else>{{$t('common.gotoBindTwo')}}</router-link>
            </el-tab-pane>
          </el-tabs>

          <label for="checked">
            <input type="checkbox" id="checked" v-model="promise"> {{$t('account.refer.promise')}}
          </label>
        </div>
        <div class="button">
          <el-button type="success" @click="submit">{{$t('common.table.submit')}}</el-button>
        </div>
        <div class="button">
            <el-button @click="$router.go(-1)">{{$t('common.table.cancel')}}</el-button>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  data() {
    return {
      promise: false,
      mount: {
        currencyAmount: 0,
        availableAmount: 0,
        feeAmount: 0,
        withdrawsMin: 0
      },
      form: {
        amount: 0,
        userMessage: null
      },
      address: null,
      code: "",
      code_google: "",
      checked: false,
      getCodeButton: "",
      isGetCode: false,
      activeName: "mobile",
      currencyInfo: {
        setFee: "official",
        selfFee: "",
        selfCurrency: "",
        officialFee: "",
        officialCurrency: "",
        currency: ""
      }
    };
  },
  methods: {
    getCode() {
      const url = "/account/phone_withdraws";
      this._countDown();
      this.$http
        .get(url)
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
    submit: function() {
      if (this.form.amount < this.mount.withdrawsMin) {
        this.$message.error(this.$t("account.less"));
        return;
      }
      if (!this.promise) {
        this.$message.error(this.$t("account.promise"));
        return;
      }
      if (this.activeName == "mobile" && this.code.trim() == "") {
        this.$message.error(this.$t("reg.error.code"));
        return;
      }
      if (this.activeName == "twophase" && this.code_google.trim() == "") {
        this.$message.error(this.$t("reg.error.code"));
        return;
      }
      this.form.amount = parseFloat(this.form.amount);
      this.form.addressId = this.address._id;
      this.form.code =
        this.activeName == "mobile" ? this.code : this.code_google;
      this.form.way = this.activeName;
      this.$http
        .post("/account/withdraws", this.form)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(this.$t("account.confirm"));
            this.$router.push({
              path: "/account/withdraw",
              query: { currency: this.address.currency }
            });
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
    },
    getCoinList: function() {
      this.$http
        .get("/account/withdraws_apply?currency=" + this.address.currency)
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.data;
            this.currencyInfo.setFee = data.withdrawsFeeSetting;
            this.currencyInfo.selfFee = data.feeAmount;
            this.currencyInfo.selfCurrency = data.feeCurrency;
            this.currencyInfo.officialFee = data.officialFeeAmount;
            this.currencyInfo.officialCurrency = data.officialFeeCurrency;
            this.currencyInfo.currency = this.address.currency;
            console.log(this.currencyInfo);
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
    }
  },
  created() {
    this.address = JSON.parse(this.$route.query.address);
    this.mount = JSON.parse(this.$route.query.mount);
    this.getCoinList();
    this.getCodeButton = this.$t("common.getCode");
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";
.el-tabs {
  a {
    color: #43cb83;
    display: inline-block;
    padding: 1px 0;
    border-bottom: 1px dotted #43cb83;
  }
}
.head {
  text-align: center;
  .notice {
    color: rgba(42, 42, 65, 0.5);
    span {
      color: $color-theme;
    }
  }
  .state {
    display: inline-block;
    padding: 16px 56px;
    color: #31708f;
    background-color: #daedf7;
  }
  .info {
    width: 80%;
    margin-top: 60px;
    padding-top: 40px;
    margin-left: auto;
    margin-right: auto;
    border-top: 1px solid rgba(42, 42, 65, 0.15);
  }
  .list {
    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      & > div {
        width: 20%;
      }
      .site {
        width: 40%;
      }
    }
    .l1 {
      color: rgba(42, 42, 65, 0.5);
    }
  }
}
.body {
  .wrap {
    width: 440px;
    margin: 0 auto;
    & > div {
      margin-bottom: 24px;
    }
    .number {
      .click {
        border-bottom: 1px dashed #ccc;
        line-height: 2;
        color: #737373;
        cursor: pointer;
      }
    }
    .hint {
      padding-left: 24px;
      border: 1px solid #faebcc;
      color: #8a6d3b;
      background-color: #fcf8e3;
    }
    .verify {
      margin-top: 40px;
      padding-bottom: 24px;
      border-top: 1px solid #e1e2ea;
      border-bottom: 1px solid #e1e2ea;
      h3 {
        text-align: center;
      }
      .code {
        margin-bottom: 16px;
      }
    }
    .button {
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
