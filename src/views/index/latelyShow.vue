<template>
  <div style="width:100%;" class="lately-show">
    <!--<ul class="show" v-if="ordersData.length > 0">
      <li :span="8" v-for="(item, i) in ordersData" :key="i">
        <p>{{item.fiatCurrency + ' => ' + item.currencyAmount.toFixed(8) + ' '+ item.currency}}</p>
        <p class="time">{{item.createTime | datetimeFormat}}</p>
      </li>
    </ul>-->
    <!-- <my-marquee class="show" v-if="ordersData.length > 0">
      <li v-for="(item, i) in ordersData" :key="i" class="data" :class="{background: i % 2 == 0}">
        <div class="item" v-for="(val, i) in item" :key="i">
          {{val.order.fiatCurrency}} => {{val.order.amount.toFixed(8)}} {{val.order.currency}}
          <span class="time">{{format(val.time, 'MM-DD hh:mm:ss')}}</span>
        </div>
      </li>
    </my-marquee> -->
    <div class="marqueeCon">
      <my-marquee style="height: 100%" class="marquee" v-if="ordersData.length > 0">
        <li v-for="(val, i) in ordersData" :key="i" class="data" :class="{background: i % 2 == 0}">
          <span>{{val.order.customer}}</span>
          <span>{{val.order.type == 'buy'?$t('common.buy'):$t('common.sell')}}</span>
          <span>{{val.order.amount.toFixed(8)}}{{val.order.currency}}</span>
          <span>{{format(val.time, 'MM-DD hh:mm:ss')}}</span>
        </li>
      </my-marquee>
      <emptyBox :text="$t('common.noData')" style="margin:0 auto" v-else></emptyBox>
    </div>
  </div>
</template>

<script>
import emptyBox from "@/components/emptyBox.vue";
import MyMarquee from "components/marquee";
import { getOrdersInfo } from "api/common";
import { mapGetters } from "vuex";

export default {
    components: {
        emptyBox,
        MyMarquee
    },
    data() {
        return {
            ordersData: [],
            timmer: null
        };
    },
    computed: {
        ...mapGetters(["common"])
    },
    watch: {
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
    methods: {
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
    created() {
        this._getOrdersInfo(true);
    },
    destroyed() {
        clearInterval(this.timmer);
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";
.lately-show {
    height: 220px;
    .marqueeCon {
        width: 100%;
        // float: right;
        // height: 150px;
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
    .background {
        background-color: #f5f7fa;
    }
}
</style>
