<template>
  <div class="g-container">
    <div class="section-1" :style="{backgroundImage: `url(${require('../../assets/image/bg-index.png')})`}">
      <h1 class="title">{{ $t('index.title1') }}</h1>
      <p class="title">{{ $t('index.title2') }}</p>
      <p class="title">{{ $t('index.title3') }}</p>
      <div class="query">
        <el-row :gutter="14">
          <el-col :span="4">
            <el-select v-model="deal" placeholder="请选择">
              <el-option
                :label="$t('index.buy')"
                value="buy">
              </el-option>
              <el-option
                :label="$t('index.sell')"
                value="sell">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="currency" placeholder="请选择">
              <el-option
                v-for="item in currencyType"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2"><span class="use">{{ $t('index.use') }}</span></el-col>
          <el-col :span="4">
            <el-select v-model="fiatCurrency" placeholder="请选择">
              <el-option
                v-for="(item,index) in fiatCurrencyType"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input type="number" v-model="fiatCurrency_amount" :placeholder="$t('index.inputHint')"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              @click="handleSearch"
              type="success">{{ $t('index.search') }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="section-2 container-box">
      <p class="title">
        <icon name="bullhorn"></icon>
        {{ $t('index.noticeTitle') }}
      </p>
      <p class="news"
        v-for="(item, index) in noticeList" :key="index"
        @click="handleToNotice(item)">{{ item.title }}</p>
    </div>

    <div class="section-3">
      <div class="container-box">
        <div class="title">
          <h3>{{ $t('index.hotData.title', {siteName: $store.state.common.siteName}) }}</h3>
          <el-input size="small" v-model="search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <el-table
          :data="searchData"
          border
          size="small"
          align="center"
          style="width: 100%"
          :empty-text="$t('common.noData')"
          @cell-mouse-enter="showButton"
          @cell-mouse-leave="hideButton">
          <el-table-column
            prop="currency"
            :label="$t('index.hotData.currency')">
          </el-table-column>
          <el-table-column
            :label="$t('index.hotData.bestLow')">
            <template slot-scope="scope">
              <span>{{ scope.row.sell?scope.row.sell.unitPriceUSD.toFixed(6) + ' USD':'-' }}</span>
              <router-link :to="'/outside-trade/index/buy?currency=' + scope.row.currency + '&fiatCurrency=CNY'" v-if="scope.row.sell">
                <el-button class="hide el"
                  type="success" plain size="mini" ref="el-button">
                  {{$t('index.hotData.toBuy')}}
                </el-button>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="buy.unitPriceUSD"
            :label="$t('index.hotData.bestHight')">
            <template slot-scope="scope">
              <span>{{ scope.row.buy?scope.row.buy.unitPriceUSD.toFixed(6) + ' USD':'-' }}</span>
              <router-link :to="'/outside-trade/index/sell?currency=' + scope.row.currency + '&fiatCurrency=CNY'" v-if="scope.row.buy">
                <el-button class="hide"
                  type="danger" plain size="mini" ref="el-button">
                  {{$t('index.hotData.toSell')}}
                </el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="lately">
          <div class="lately-title">
            <h2>{{ $t('index.latelyTitle') }}</h2>
          </div>
          <div class="lately-show">
            <lately-show></lately-show>
          </div>
        </div>
      </div>
    </div>

    <div class="section-4">
      <div class="container-box">
        <h2>{{$t('index.slogan.title')}}</h2>
        <div class="show">
          <div>
            <icon class="icon" name="dollar" scale="5"></icon>
            <p class="title">{{$t('index.slogan.section.title')}}</p>
            <p>{{$t('index.slogan.section.content')}}</p>
          </div>
          <div>
            <icon class="icon" name="dollar" scale="5"></icon>
            <p class="title">{{$t('index.slogan.section.title2')}}</p>
            <p>{{$t('index.slogan.section.content2')}}</p>
          </div>
          <div>
            <icon class="icon" name="dollar" scale="5"></icon>
            <p class="title">{{$t('index.slogan.section.title3')}}</p>
            <p>{{$t('index.slogan.section.content3')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import latelyShow from './latelyShow'
import {getCommon} from '@/api/advertisement.js'
import {getArticleList} from 'api/hc'
import {mapGetters} from 'vuex'
import emptyBox from '@/components/emptyBox.vue'
export default {
  components: {
    latelyShow,
    emptyBox
  },
  data() {
    return {
      deal: 'buy',
      fiatCurrency: 'CNY',
      fiatCurrency_amount: null,
      currency: '',
      search: null,
      fiatCurrencyType: [],
      currencyType: [],
      hotCoin: [
      ],
      hotShow: [],
      noticeList: []
    }
  },
  computed: {
    ...mapGetters(['language']),
    searchData: function() {
      var search = this.search && this.search.toLowerCase();
      if (search) {
        return this.hotShow.filter(function(item) {
          return item.currency.toLowerCase().indexOf(search) > -1;
        });
      }
      return this.hotShow;
    }
  },
  watch: {
    search (val) {
      val = val.toLowerCase()
      if (!val) this.hotShow = this.hotCoin
      this.hotShow = this.hotCoin.filter(item => {
        return item.coin.toLowerCase().indexOf(val) > -1
      })
    },
    language: {
      handler: '_getNoticeList',
      immediate: true
    },
    fiatCurrency_amount(val) {
      if (val < 0) {
        this.fiatCurrency_amount = 1
      }
    }
  },
  created() {
    this.getHotData();
    getCommon('yes').then(res=>{
       this.currency=res.data.currency[0];
      this.currencyType = res.data.currency;
      this.fiatCurrencyType = res.data.fiatCurrency
    }).catch(data => {
      this.$message.error(this.$t(`err.${data.code}`))
    })
  },
  methods: {
    formatFiat: function(row){
      if(row.sell){
        return row.sell.unitPriceUSD + 'USD'
      }else{
        return '-'
      }

    },
    getHotData: function(){
      this.$http.get('/hot').then(res=>{
        if(res.data.code == 0){
          this.hotCoin = res.data.data;
          this.hotShow = this.hotCoin;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    showButton(...argv) {
      const tr = argv[2].parentNode
      const buttons = tr.querySelectorAll('.el-button')
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('hide')
      }
    },
    hideButton(...argv) {
      const tr = argv[2].parentNode
      const buttons = tr.querySelectorAll('.el-button')
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('hide')
      }
    },
    handleSearch() {
      this.$router.push({
        name: 'outside-trade',
        params: {trade: this.deal},
        query: {currency: this.currency, fiatCurrency: this.fiatCurrency, amount: this.fiatCurrency_amount}
      })
    },
    handleToNotice(params) {
      this.$router.push(`/hc/articles/${params.id}?center=${params.center}&title=notice&lang=${params.title}`)
    },
    _getNoticeList() {
      getArticleList({lang: this.language, pageSize: 3, pageType: 'home', tags: ['notice']}).then(data => {
        this.noticeList = []
        data.data.forEach(item => {
          let obj = {}
          obj.id = item._id
          obj.title = item.title
          obj.center = 'notice'

          for (let i of item.tags) {
            if (!i.isDefault) {
              obj._id = i._id
              obj.lang = i.lang
            }
          }
          this.noticeList.push(obj)
        })
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';

  .g-container {
    .section-1 {
      padding: 50px 0 30px;
      text-align: center;
      color: #fff;

      background-size: 100%;
      h1.title {
        font-size: 42px;
      }
      p.title {
        font-size: 16px;
      }
      .query {
        margin: 0 15% 30px 15%;
        padding: 15px 10px;
        border-radius: 3px;
        color: $color-text;
        line-height: 40px;
        background-color: #fff;
      }
      @media screen and (max-width: 768px) {
        .query {
          margin: 0 6% 30px 6%;
        }
      }
    }
    .section-2 {
      display: flex;
      justify-content: center;
      text-align: center;
      font-size: 18px;
      @media screen and (max-width: 1024px) {
        display: block;
      }
      .news {
        padding: 0 30px;
        color: $color-theme;
        cursor: pointer;
      }
    }
    .section-3 {
      background-color: #f8f9fa;
      .container-box {
        padding: 15px;
      }
      .title {
        display: flex;
        justify-content: space-between;
        .el-input {
          margin-top: 6px;
          width: 280px;
        }
      }
      .lately {
        margin-top: $distance-x4;
        margin-bottom: $distance-x3;
        .lately-title {
          text-align: center;
        }
        .lately-show {
          display: flex;
          justify-content: space-between;
        }
      }
      .hide {
        visibility: hidden;
      }
      .show {
        visibility: show;
      }
    }
    .section-4 {
      padding: 70px 0;
      h2 {
        text-align: center;
      }
      .show {
        display: flex;
        justify-content: space-between;
        div {
          margin-top: $distance-x4;
          width: 30%;
          text-align: center;
        }
        .title {
          font-size: 18px;
        }
        p:last-child {
          color: #949494;
        }
      }
    }
  }
</style>
