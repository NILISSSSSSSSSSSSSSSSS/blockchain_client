<template>
  <div class="fast-trade">
    <div class="head">
      <message class="msg" style="float: left;width: 47.2%;"></message>
      <div class="marqueeCon">

        <my-marquee style="height: 100%" class="marquee">
          <li v-for="(val, i) in ordersData" :key="i" class="data" :class="{background: i % 2 == 0}">
            <span>{{val.order.customer}}</span>
            <span>{{val.order.type == 'buy'?$t('common.buy'):$t('common.sell')}}</span>
            <span>{{val.order.amount.toFixed(8)}}{{val.order.currency}}</span>
            <span>{{format(val.time, 'MM-DD hh:mm:ss')}}</span>
          </li>
        </my-marquee>
      </div>
    </div>

    <div class="content">
      <tradeListFast :getAdverts="getBuyAdverts"  :desc="desc" class="list"></tradeListFast>
      <div style="flex: 0.1"></div>
      <tradeListFast :getAdverts="getSellAdverts"  :desc="desc" class="list"></tradeListFast>
    </div>

  </div>
</template>

<script>
import Message from "@/views/outside-trade/trade-index/message.vue";
import MyMarquee from "components/marquee";
import tradeListFast from "components/tradeListFast";

import { mapGetters } from "vuex";
import { getOrdersInfo } from "api/common";
export default {
    components: {
        Message,
        tradeListFast,
        MyMarquee
    },
    data() {
        return {
            timmer: "",
            ordersData: [],
            getBuyAdverts: {
                tradeType: "buy",
                currency: "BTC"
            },
            getSellAdverts: {
                tradeType: "sell",
                currency: "BTC"
            },
            desc: "priceAsc",
            index: 0,
            priceType: "",
            authlist: {}
        };
    },
    computed: {
        ...mapGetters(["common"])
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        $route: "fetchRoute",
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
    created() {
         console.log("进入------------");
        this.fetchRoute();
        //this.getTranInfo();
        this._getOrdersInfo(true);
    },
    destroyed() {
        console.log("leave------------");
        clearInterval(this.timmer);
    },
    mounted() {},
    methods: {
        init() {},
        //跑马灯数据
        _getOrdersInfo(init) {
            const ms = new Date().getTime();
            getOrdersInfo(init)
                .then(list => {
                    this.ordersData = this.ordersData.concat(list);
                })
                .catch(err => {
                    console.error(err);
                    //this.$message.error(this.$t(`err.${data.code}`))
                });
        },
        fetchRoute() {
            if (this.$route.query) {
                var params = this.$route.query;
                this.getBuyAdverts.currency = this.getSellAdverts.currency =
                    params.currency;
            }
        },
    
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";
.fast-trade {
    max-width: 1200px;
    padding: 0 16px;
    margin: auto;
    .head {
        height: 150px;
        overflow: hidden;
        margin-top: 10px;
        .marqueeCon {
            width: 47.6%;
            float: right;
            height: 150px;
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
        }
        .msg {
            flex: 1;
        }
        .marquee {
            .time {
                font-size: 10px;
                padding: 2px 4px;
                color: #fff;
                background-color: #777;
                border-radius: 3px;
            }
        }
    }
    .content {
        display: flex;
        min-height: 650px;
        justify-content: space-around;
        .list {
            flex: 1;
        }
    }
    .background {
        background-color: #f5f7fa;
    }
}
</style>
