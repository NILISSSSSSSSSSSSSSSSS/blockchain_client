<template>
  <div class="solution-box">
    <div class="l">
      <el-card :body-style="{padding: 0}">
        <h3>
          {{ $t('outside.box.best', {text: trade === 'buy' ? $t('outside.priceLow') : $t('outside.priceHigh')}) }}
        </h3>
        <div v-if="bestPrice.amountLimit" v-show="(bestPrice.amountLimit.length > 0)">
          <div class="recommend">
            <div>
              <span @click="$router.push('/user?id='+bestPrice.userId)"><img :src="bestPrice.avatar" width="28" height="28" v-if="bestPrice.avatar">
                <img src="~assets/imgs/user_default_pic.png" alt="" width="28" height="28" v-else>
                <span class="name">
                  {{ bestPrice.name }}
                </span>
              </span>
              <p class="price p2">
                {{ bestPrice.amountLimit[0] + ' - ' + bestPrice.amountLimit[1] + unit }}
              </p>
            </div>
            <div>
              <p class="price">
                {{ bestPrice.floatPrice.toFixed(6) }}
              </p>
              <p class="currency p2">
                {{ fiatCurrency + '/' + currency }}
              </p>
            </div>
          </div>
          <router-link tag="div" :to="'/outside-trade/orders/' + bestPrice.offersId">
            <el-button type="success" size="small">{{ $t('common.tradeText', {text: tradeText}) }}</el-button>
          </router-link>
        </div>
        <div v-else class="nodata">{{$t('common.noData')}}</div>
      </el-card>
      <el-card :body-style="{padding: 0}">
        <h3>{{$t('outside.box.credit')}}</h3>
        <div v-if="highCredit.amountLimit" v-show="(highCredit.amountLimit.length > 0)">
          <div class="recommend">
            <div>
              <span @click="$router.push('/user?id='+highCredit.userId)"><img :src="highCredit.avatar" width="28" height="28" v-if="highCredit.avatar">
                <img src="~assets/imgs/user_default_pic.png" alt="" width="28" height="28" v-else>
                <span class="name">{{ highCredit.name }}</span>
              </span>
              <p class="price p2">{{highCredit.amountLimit[0] + ' - ' + highCredit.amountLimit[1] + unit}}</p>
            </div>
            <div>
              <p class="price">{{ highCredit.floatPrice.toFixed(6) }}</p>
              <p class="currency p2">
                {{ fiatCurrency + '/' + currency }}
              </p>
            </div>
          </div>
          <router-link tag="div" :to="'/outside-trade/orders/' + highCredit.offersId">
            <el-button type="success" size="small">{{ $t('common.tradeText', {text: tradeText}) }}</el-button>
          </router-link>
        </div>
        <div v-else class="nodata">{{$t('common.noData')}}</div>
      </el-card>
    </div>
    <div class="r">
      <my-marquee style="height: 100%">
        <li v-for="(val, i) in ordersData" :key="i" class="data" :class="{background: i % 2 == 0}">
          <span>{{val.order.customer}}</span>
          <span>{{val.order.type == 'buy'?$t('common.buy'):$t('common.sell')}}</span>
          <span :title="val.order.amount.toFixed(8) + val.order.currency">{{val.order.amount.toFixed(8)}}{{val.order.currency}}</span>
          <span>{{format(val.time, 'MM-DD hh:mm:ss')}}</span>
        </li>
      </my-marquee>

      <!--<div class="title">
          <h3>批量交易</h3>
          <router-link class="state" to="/">什么是批量交易？</router-link>
        </div>
        <el-table
          :data="batchData"
          style="width: 100%">
          <el-table-column
            prop="currency"
            label="单价(CNY/BTC)">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="数量"
            width="80">
          </el-table-column>
          <el-table-column
            prop="price"
            label="一口价(CNY)">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button type="success" size="mini" plain>购买</el-button>
            </template>
          </el-table-column>
        </el-table>-->

    </div>
  </div>
</template>

<script>
import { getAdvertsBasic } from "api/outside-trade";
import MyMarquee from "components/marquee";
import { getOrdersInfo } from "api/common";
import { mapGetters } from "vuex";

export default {
    props: {
        getAdverts: {}
    },
    data() {
        return {
            timmer: "",
            trade: "",
            bestPrice: {
                amountLimit: [],
                floatPrice: 0
            },
            highCredit: {
                amountLimit: [],
                floatPrice: 0
            },
            fiatCurrency: null,
            currency: null,
            unit: "",

            ordersData: [],
            timmer: null
        };
    },
    computed: {
        ...mapGetters(["common"])
    },
    created() {
        this._getOrdersInfo(true);
    },
    destroyed() {
        console.log("leave------------");
        clearInterval(this.timmer);
    },
    methods: {
        getAdver: function(params) {
            getAdvertsBasic(params)
                .then(data => {
                    this.bestPrice = data.data.bestPrice;
                    this.highCredit = data.data.highCredit;
                    this.unit =
                        this.trade === "buy"
                            ? data.data.fiatCurrency
                            : data.data.currency;
                    this.fiatCurrency = data.data.fiatCurrency;
                    this.currency = data.data.currency;
                })
                .catch(data => {
                    this.$message.error(this.$t(`err.${data.code}`));
                });
        },
        _getOrdersInfo(init) {
            getOrdersInfo(init)
                .then(list => {
                    this.ordersData = this.ordersData.concat(list);
                })
                .catch(err => {
                    console.error(err);
                    //this.$message.error(this.$t(`err.${data.code}`))
                });
        }
    },
    watch: {
        $route: {
            handler(val) {
                var params = val.query;
                this.trade = val.params.trade;
                this.tradeText =
                    this.trade === "buy"
                        ? this.$t("common.nowBuy")
                        : this.$t("common.nowSell");
                params.tradeType = val.params.trade;
                this.getAdver(params);
            },
            deep: true,
            immediate: true
        },
        common: {
            handler(val) {
                if (this.timmer) clearInterval(this.timmer);
                this.timmer = setInterval(() => {
                    this._getOrdersInfo();
                }, 1000 * val.lampRefresh);
            },
            immediate: true,
            deep: true
        }
    },
    components: {
        MyMarquee
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

.solution-box {
    display: flex;
    justify-content: space-between;

    a {
        color: #fff;
    }
    img {
        border-radius: 50%;
        vertical-align: middle;
    }
    .el-card::before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0px;
        left: 20px;
        width: 5px;
        height: 30px;
        background-color: $color-danger;
    }
    .el-card {
        position: relative;
        padding: 8px 15px 20px;
        height: 100%;
        h3 {
            margin: 0;
            transform: translate(16px, 0);
            color: $color-danger;
        }
    }
    .l {
        width: 48%;
        height: 328px;
        display: flex;
        flex-direction: column;
        .el-card:first-of-type {
            margin-bottom: 18px;
        }
        .el-card {
            height: calc(50% - 9px);
            .nodata {
                text-align: center;
                margin-top: 40px;
                font-size: 13px;
                color: #aaa;
                letter-spacing: 1px;
            }
            .recommend {
                display: flex;
                justify-content: space-between;
                margin-left: 16px;
                margin-top: 16px;
                .name {
                    display: inline-block;
                    width: 90px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    vertical-align: middle;
                }
                p {
                    margin: 0;
                }
                .p2 {
                    margin: 4px 0 12px;
                }
            }
            .el-button {
                transform: translateX(16px);
            }
        }
    }
    .r {
        width: calc(52% - 18px);
        height: 328px;
        // padding: 8px 15px 20px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        color: #303133;
        border-radius: 4px;
        .data {
            padding: 10px 0;
            span {
                display: inline-block;
                // float: left;
                width: 24%;
                text-align: center;
                text-overflow: ellipsis;
                overflow: hidden;
                &:nth-of-type(2) {
                    width: 10%;
                }
                &:nth-of-type(3) {
                    width: 38%;
                }
            }
        }
        .el-card {
            height: 100%;
        }
        .title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .el-card::before {
            display: none;
        }
    }

    .time {
        float: right;
        font-size: 10px;
        padding: 2px 4px;
        color: #fff;
        background-color: #777;
        border-radius: 3px;
    }
    .background {
        background-color: #f5f7fa;
    }
}
</style>
