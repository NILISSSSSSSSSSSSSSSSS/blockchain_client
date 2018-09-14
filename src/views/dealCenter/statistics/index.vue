<template>
  <div class="statistics container-box">

    <deal-bread :currentNav="$t('dealCenter.statistics.title')"></deal-bread>
    <div class="content">
      <deal-panel :title="$t('dealCenter.statistics.header')">
        <div ref="mychart" class="mychart"></div>
        <!--<div class="text-center">总资产 = 0CNY</div>-->
      </deal-panel>
      <div class="flexBox">
        <deal-panel :title="$t('common.sell')" class="deal-panel out">
          <div class="trade-count">
            <div class="trade-title">{{$t('dealCenter.statistics.weekSell')}}</div>
            <ul class="trade-list" v-if="data.weekSell && data.weekSell.length > 0">
              <li class="item"
                v-for="(item, index) in data.weekSell"
                :key="index">
                <span class="num">{{item.sum.toFixed(8)}}</span>
                <span class="currency">{{item.currency}}</span>
              </li>
            </ul>
            <p class="nodata" v-else>{{$t('common.noData')}}</p>
          </div>
          <div class="trade-count">
            <div class="trade-title">{{$t('dealCenter.statistics.allSell')}}</div>
            <ul class="trade-list" v-if="data.allSell && data.allSell.length > 0">
              <li class="item"
                v-for="(item, index) in data.allSell"
                :key="index">
                <span class="num">{{item.sum.toFixed(8)}}</span>
                <span class="currency">{{item.currency}}</span>
              </li>
            </ul>
            <p class="nodata" v-else>{{$t('common.noData')}}</p>
          </div>
        </deal-panel>
        <deal-panel :title="$t('common.buy')" class="deal-panel in">
          <div class="trade-count">
            <div class="trade-title">{{$t('dealCenter.statistics.weekBuy')}}</div>
            <ul class="trade-list" v-if="data.weekBuy && data.weekBuy.length > 0">
              <li class="item"
                v-for="(item, index) in data.weekBuy"
                :key="index">
                <span class="num">{{item.sum.toFixed(8)}}</span>
                <span class="currency">{{item.currency}}</span>
              </li>
            </ul>
            <p class="nodata" v-else>{{$t('common.noData')}}</p>
          </div>
          <div class="trade-count">
            <div class="trade-title">{{$t('dealCenter.statistics.allBuy')}}</div>
            <ul class="trade-list" v-if="data.allBuy && data.allBuy.length > 0">
              <li class="item"
                v-for="(item, index) in data.allBuy"
                :key="index">
                <span class="num">{{item.sum.toFixed(8)}}</span>
                <span class="currency">{{item.currency}}</span>
              </li>
            </ul>
            <p class="nodata" v-else>{{$t('common.noData')}}</p>
          </div>
        </deal-panel>
      </div>

    </div>
  </div>
</template>

<script>
  import { getStatistics } from 'api/deal-center'
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/pie')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  import dealBread from '../components/dealBread.vue'
  import dealPanel from '../components/dealPanel.vue'
  export default {
    components: {
      dealBread,
      dealPanel
    },
    data () {
      return {
        data: {
          allBuy: [],
          allSell: [],
          weekBuy: [],
          weekSell: []
        }
      }
    },
    methods: {
      drawLine(asset) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(this.$refs.mychart);
        // 绘制图表
        myChart.setOption({
          title: { text: this.$t('dealCenter.statistics.title'), subtext: this.$t('dealCenter.statistics.state'),left: 'center' },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            //top: 0,
            //right: 0,
            top: 0,
            left: 'center',
            data: ['BTC', 'EOS','ETH','OB']
          },
          series: [{
            type: 'pie',
            center: ['50%', '58%'],
            data: asset,
            //selectedMode: 'single',
            labelLine: {
              show: false
            },
            //label: {show: false}
          }]
        });
      }
    },
    mounted() {
    },
    created () {
      getStatistics().then(data => {
        this.data = data.data;
        let arr = []
        data.data.asset.forEach(item => {
          let obj = {}
          obj.name = item.currency
          obj.value = item.currencyAmount
          arr.push(obj)
        })
        this.drawLine(arr)
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
    }
  }
</script>

<style lang="scss" scoped>
  .statistics{
    margin: 0 auto;
    padding: 30px 16px;
    .no-data {
      color: #aaa;
    }
    .content{
      margin-top: 40px;
      .mychart{
        height: 400px;
      }
      .text-center{
        text-align: center;
        font-size: 14px;
      }
      .flexBox{
        display: flex;
        .deal-panel{
          width: 49%;
        }
        .in{
          margin-left: 2%;
        }
        .trade-count{
          width: auto;
          margin: 20px auto 30px;
          .nodata{
            font-size: 13px;
            padding-left: 10px;
            margin: 0;
          }
          .trade-title{
            margin: 0 0 10px;
            font-size: 1.2em;
            color: rgba(42,42,65,0.6);
            border-bottom: 1px solid rgba(222,222,222,0.29);
          }
          .trade-list{
            .item{
              display: block;
              padding-left: 10px;
              border-left: 4px solid #43CB83;
              line-height: 1.2;
              margin: 15px 50px 15px 0;
              color: #696464;
              word-break: break-all;
              .num{
                font-size: 2.28em;
              }
              .currency{
                padding-left: 3px;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
</style>
