<template>
  <header class="g-header">
    <div class="container-box">
      <div class="nav-l">
        <!-- logo图标 -->
        <router-link tag="div" class="title" to="/">
          <img :src="logoImg" alt="" class="logo" >
          {{$store.state.common.siteName}}
        </router-link>
        <!-- 场外交易按钮 -->
        <router-link tag="div" class="item" :to="'/outside-trade/index/buy?currency='+currencyList[0]+'&fiatCurrency=CNY'">
          <icon class="icon" name="usd"></icon>
          {{ $t('header.deal') }}
        </router-link>
        <!-- 快速交易按钮 -->
        <router-link tag="div" v-if="fastTradeAll" class="item" :to="{path:'/fast-trade',query:{currency:currencyList[0]}}" >
          <icon class="icon" name="exchange"></icon>
            {{$t('fastTrade.fastTradeText')}}
        </router-link>
        <!-- 场内交易 -->
        <router-link tag="div" v-if="changNeiJiaoYi" class="item" to="/futures">
          <icon class="icon" name="gg"></icon>
          {{$t('futures.title')}}
        </router-link>
      </div>
      <div class="nav-r">
        <router-link v-if="$store.state.appDownload" :to="'/hc/article/'+ $store.state.appDownload">{{$t('common.app')}}</router-link>
        <router-link to="/hc">{{$t('hc.helpCenter')}}</router-link>
        <el-dropdown class="account">
          <span class="el-dropdown-link">
            {{ $t('header.assets.title') }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/account/wallets')">
              {{$t('header.assets.wallets')}}
            </el-dropdown-item>
            <el-dropdown-item @click.native="$router.push('/account/record')">
              {{$t('header.assets.record')}}
            </el-dropdown-item>
            <el-dropdown-item @click.native="$router.push('/account/transfer')">
              {{$t('header.assets.transfer')}}
            </el-dropdown-item>
             <!-- 我的发币 如果是路交所和吉交所就不显示-->
             <el-dropdown-item v-if="senCoinIsShow()" @click.native="$router.push('/account/mysendcoin')">
              {{$t('header.assets.mySendCoin')}}
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
        <el-select v-model="lang" placeholder="请选择" @change="toggelLan">
          <el-option v-for="(item,index) in langList" :key="index" :label="item.displayText" :value="item._id">
          </el-option>
        </el-select>
        <el-dropdown v-if="token">
          <span class="el-dropdown-link">
            <router-link to="/personcenter" class="avaBox"><img :src="avatar?avatar:defaultAvatar" alt="" class="avatar" style="width: 35px;height: 35px;">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </router-link>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/personcenter')">{{$t('header.menu.account')}}</el-dropdown-item>
            <el-dropdown-item @click.native="$router.push('/account/wallets')">
              <router-link to="/account/wallets">{{$t('header.menu.wallets')}}</router-link>
            </el-dropdown-item>
            <!--<el-dropdown-item><router-link to="/user">{{$t('header.menu.homepage')}}</router-link></el-dropdown-item>-->
            <el-dropdown-item divided @click.native="logout">{{$t('header.menu.signOut')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <template v-else>
          <router-link class="sign-in" to="/user/login">{{ $t('common.login') }}</router-link>
          <router-link class="sign-up" to="/user/register">{{ $t('common.register') }}</router-link>
        </template>

      </div>
    </div>
    <div class="subnav" id="subnav" :class="subNavFixed == true ? 'isFixed' :''">
      <div class="content">
        <!-- 左边 -->
        <div class="left">
          <!-- 买入按钮BTC -->
          <el-dropdown trigger="click" v-if="!fastTrade" placement="bottom-start">
            <span class="el-dropdown-link" >
              <el-button size="small" type="success">{{headerText}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown" style="padding: 20px;">
              <div style="display:flex; flex-direction:column; align-items: center;">
                <el-radio-group v-model="type">
                  <el-radio label="buy">{{$t('header.select.buy')}}</el-radio>
                  <el-radio label="sell">{{$t('header.select.sell')}}</el-radio>
                </el-radio-group>
                <el-input v-model='quickSearch' style="margin: 10px 0;" :placeholder="$t('header.fast')" suffix-icon="el-icon-search">
                </el-input>
              </div>
              <ul style="max-height: 280px;overflow-y:auto;color: #4A4A4A;font-weight: bold;line-height: 3;text-align:center">
                <li @click="goOutside(item)" :style="{background: index==overIndex ? '#F6F6F6': '#fff', color: index==overIndex ? '#43cb83': 'rgb(74, 74, 74)', cursor: 'pointer'}" @mouseover="overCurrency(index)" v-for="(item,index) in searchData" :key="index">{{item}}</li>
              </ul>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 交易对 -->
           <div class="bibiTrade" v-else>
             <span > {{$t('fastTrade.tradeCp')}} <i class="el-icon-arrow-down"></i></span>
                <ul class="twoNav">
                  <li>
                    <span>{{configFiatBi}} <i class="arrowRight el-icon-arrow-right"></i></span>
                      <ul class="thirdNav">
                          <li v-for="(item,index) in biList" :key="index"><span @click="$router.push({path: '/fast-trade', query:{currency: item} })" >{{item}}</span></li>
                      </ul>
                  </li>

             </ul>
           </div>
          <router-link to="/advertisement/create">{{$t('header.advertisement')}}</router-link>
          <el-dropdown placement="bottom-start">
            <span class="el-dropdown-link">
              {{$t('header.trade.title')}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item>
              <router-link to="/deal-center" class="dropdown-item">
                交易大堂
              </router-link>
            </el-dropdown-item>-->
              <el-dropdown-item @click.native="$router.push('/deal-center/orders')">
                {{$t('header.trade.orders')}}
              </el-dropdown-item>
              <el-dropdown-item @click.native="$router.push('/deal-center/offers')">
                {{$t('header.trade.offers')}}
              </el-dropdown-item>
              <el-dropdown-item @click.native="$router.push('/deal-center/statistics')">
                {{$t('header.trade.statistics')}}
              </el-dropdown-item>
              <el-dropdown-item @click.native="$router.push('/deal-center/transactions')">
                {{$t('header.trade.transactions')}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 右边 -->
        <div class="right">
          <div class="msg">
            <el-badge :value="unread" class="item" :hidden="unread == 0">
              <icon name="comments"></icon>
            </el-badge>
            <div class="msgBox">
              <div class="msgTitle">{{$t('header.message.title')}}</div>
              <div class="msgContent">
                <div class="hasNoMsg" v-if="orderMsg.length == 0">
                  {{$t('header.message.noMsg')}}
                </div>
                <ul v-else>
                  <li class="list" v-for="(item,index) in orderMsg" @click="goOrderDetail(item.orderCode)" :key="index">
                    <span class="listContent" style="font-size:13px;">
                      {{$t('header.message.msg', {orderCode: item.orderCode.slice(-10)})}}</span>
                    <span class="unread">{{$t('header.message.unread', {read: item.unread?$t('header.notice.unread'):''})}}</span>
                  </li>
                </ul>
              </div>
              <div class="msgFooter">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div class="msg" style="margin-right:30px">
            <el-badge :value="unread2" class="item" :hidden="unread2 == 0">
              <icon name="bell"></icon>
            </el-badge>
            <div class="msgBox">
              <div class="msgTitle">{{$t('header.notice.title')}}</div>
              <div class="msgContent">
                <div class="hasNoMsg" v-if="unread2 == 0">
                  {{$t('header.message.noMsg')}}
                </div>
                <ul v-else>
                  <li class="list" v-for="(item,index) in systemMsg" :key="index" @click="handleAppeal(item)">
                    <!--<span class="date"><small>{{$t('header.notice.date', {date: item.time})}}</small></span>-->
                    <span class="listContent" style="font-size:13px;">{{$t('header.notice.appeal.content', {orderCode: item.context.orderCode.slice(-10)})}}</span>
                    <span class="unread">{{$t('common.check')}}</span>
                  </li>
                  <li></li>
                </ul>
              </div>
              <div class="msgFooter">
                <!--<span>{{$t('header.notice.readAll')}}</span><span>{{$t('header.notice.markAll')}}</span>-->
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </header>
</template>

<script>
import { getCommon } from "@/api/advertisement.js";
import { mapMutations, mapGetters } from "vuex";
import { getDetail } from "@/api/user";
export default {
  data() {
    return {
       configFiatBi:"",
      timer1: null,
      logoImg:"",
      avatar: "",
      outsideCoin: "",
      unread: 0,
      unread2: 0,
      headerText: "",
      quickSearch: "",
      currencyList: [],
      orderMsg: [],
      systemMsg: [],
      overIndex: "",
      type: "buy",
      subNavFixed: false,
      lang: "",
      langList: [],

      changNeiJiaoYi:false,
      fastTradeAll:null,
      biList:[],
      fastTrade:false,
    };
  },
  computed: {
    ...mapGetters(["token", "basic", "common", "verify"]),
    searchData: function() {
      var search = this.quickSearch && this.quickSearch.toLowerCase();
      if (search) {
        return this.currencyList.filter(function(currency) {
          return currency.toLowerCase().indexOf(search) > -1;
        });
      }
      return this.currencyList;
    }
  },
  methods: {
    ...mapMutations(["setToken", "setLanguage", "setCommon", "setVerify"]),
       senCoinIsShow() {
         var url=this.getUrl();
        return url.includes('otcah.com') || url.includes('aaaex.vip') || url.includes('bibiex.io') ? false : true;
     },
    checkChangeNeiTrade(){
      if(!this.changNeiJiaoYi && this.$route.path.includes('futures')){
        this.$router.push("/")
      }
    },
    // --------------检测交易对按钮是否显示以及路由禁止-------------
     checkFastTrade(){
       if(this.fastTradeAll && this.$route.path.includes('fast-trade')){
         this.fastTrade=true;
       }
      else{
        if(this.$route.path.includes('fast-trade')){
          this.$router.push("/");
        }
         this.fastTrade=false;
      }
     },
    getAvatar: function() {
      getDetail()
        .then(data => {
          if (data.data.avatar) {
            this.avatar = data.data.avatar;
          }
          this.setVerify({twoPhase: data.data.twoPhase, phone: data.data.phone})
        })
        .catch(err => {
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        });
    },
    handleAppeal: function(item) {
      let orderCode = item.context.orderCode;
      let id = item._id;
      this.$http
        .post("/users/read", { notificationId: id })
        .then(res => {
          if (res.data.code != 0) {
            this.$message.error(this.$t("err." + res.data.code));
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
      const { href } = this.$router.resolve({
        path: `/outside-trade/trading/${orderCode}`
      });
      window.open(href, "_blank");
    },
    goOrderDetail: function(id) {
      const { href } = this.$router.resolve({
        path: `/outside-trade/trading/${id}`
      });
      if (
        this.$route.params.id &&
        this.$route.path.indexOf("/outside-trade/trading") > -1
      ) {
        if (this.$route.params.id == id) {
          this.$router.go(0);
        } else {
          window.open(href, "_blank");
        }
      } else {
        this.$router.push({ path: `/outside-trade/trading/${id}` });
      }
    },
    getCommon: function() {
      getCommon("yes")
        .then(res => {
          this.logoImg=res.data.logo;
          this.biList=(res.data.currency).filter(n=> n!==this.configFiatBi);

          localStorage.officialCurrency = res.data.officialCurrency;
          this.currencyList = res.data.currency;
          this.setCommon({siteName: res.data.siteName, siteDomain: res.data.siteDomain, lampRefresh: res.data.lampRefresh});
          this.$nextTick(()=>{
            document.title = res.data.siteName
          })
          this.langList = res.data.lang;
          let type_s =
            JSON.parse(this.basic).tradeType == "sell"
              ? this.$t("common.sell")
              : this.$t("common.buy");
          const currency = JSON.parse(this.basic).currency;
          var cur = res.data.currency[0];;
          if (this.$route.query.currency) {
            cur = this.$route.query.currency;
          }
          this.headerText = type_s + " " + cur;

          this.fastTradeAll=res.data.enableUSDT;
          this.changNeiJiaoYi=res.data.enableFutures;
          //禁止场内交易路由跳转
          this.checkChangeNeiTrade()
          //检测是否显示快速交易按钮

          this.checkFastTrade()
        })
        .catch(data => {
          this.$message.error(this.$t(`err.${data.code}`));
        });
    },
    logout: function() {
      this.$http
        .post("/users/logout")
        .then(res => {
          if (res.data.code == 0) {
            this.delCookie("token");
            this.setToken("");
            this.$router.push("/user/login");
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
    },
    goOutside: function(item) {
      let type_s =
        JSON.parse(this.basic).tradeType == "sell"
          ? this.$t("common.sell")
          : this.$t("common.buy");
      this.outsideCoin = item;
      const currency = JSON.parse(this.basic).currency || "BTC";
      this.headerText = type_s + " " + currency;
      this.$router.push("/");
      this.$router.push({
        path: `/outside-trade/index/${this.type}`,
        query: { currency: item, fiatCurrency: "CNY" }
      });
    },
    overCurrency: function(index) {
      this.overIndex = index;
    },
    toggelLan: function(val) {
      location.reload();
      localStorage.language = val;
    },
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var offsetTop = document.querySelector("#subnav").offsetTop;
      if (scrollTop > offsetTop) {
        this.subNavFixed = true;
      } else {
        this.subNavFixed = false;
      }
    },
    getAjaxMsg() {
      var time = setInterval(() => {
        if (!this.token) {
          clearInterval(time);
          return;
        }
        var that = this;
        this.$http
          .post("/order/query")
          .then(res => {
            if (res.data.code == 0) {
              var notificationLen=res.data.data.notification.length;
              // 如果另外一边在修改密码，这边就下线
              for(var i=0;i<notificationLen;i++){
                 if(res.data.data.notification[i].msgType=="relogin" && res.data.data.notification[i].time>this.getCookie('loginTime')){
                    this.delCookie('token');
                    this.delCookie('loginTime');
                    this.store.commit('setToken', '');
                    this.$message.error(this.$t(`common.passUpdatePleLogin`));
                    this.$router.push('/user/login');
                }
              }
             

              this.orderMsg = res.data.data.orders;
              var obj = {};
              this.orderMsg.forEach((item, index) => {
                obj[item.orderCode] = item.unread;
              });
              //console.log(obj);
              var oldMsg = localStorage.orderMsg
                ? JSON.parse(localStorage.orderMsg)
                : {};
              //console.log(oldMsg);
              for (let item in obj) {
                //已读 或者 存在这个订单并且订单之前状态未读
                if (
                  obj[item] == false ||
                  (oldMsg.hasOwnProperty(item) && oldMsg[item] == true)
                ) {
                } else {
                  let title = this.$t("common.newMsg");
                  let options = { body: this.$t("header.message.msg", {orderCode: item.slice(-10)}) };
                  this.Notification(title, options);
                }
              }

              localStorage.orderMsg = JSON.stringify(obj);
              this.systemMsg = res.data.data.notification;
              this.unread2 = this.systemMsg.length;
              var i;
              var len = this.orderMsg.length;
              var unread = 0;
              for (i = 0; i < len; i++) {
                if (this.orderMsg[i].unread == true) {
                  unread++;
                }
              }
              this.unread = unread;
            } else {
              this.$message.error(this.$t(`err.${data.code}`));
            }
          })
          .catch(err => {});
      }, 3000);
    }
  },
  watch: {
    token(val) {
      if (val == "") {
        return;
      } else {
        this.getAjaxMsg();
      }
    },
    $route: {
      handler(val) {
        setTimeout(() => {
          let type_s = val.query.tradeType
            ? val.query.tradeType == "sell"
              ? this.$t("common.sell")
              : this.$t("common.buy")
            : JSON.parse(this.basic).tradeType == "sell"
              ? this.$t("common.sell")
              : this.$t("common.buy");
          let currency = JSON.parse(this.basic).currency;
          let cur = currency || "BTC";
          this.headerText = type_s + cur;
        }, 20);
         //检测是否是快速交易
         this.timer1 = setInterval(() => {
           if(this.fastTradeAll !== null){
             this.checkFastTrade();
             clearInterval(this.timer1)
           }
         }, 100)
         
         //检测场内交易是否显示
         this.checkChangeNeiTrade()
      },
      deep: true
    }
  },
  created() {
    this.configFiatBi= localStorage.getItem("configFiatBi");

        this.defaultAvatar = require("../../assets/imgs/user_default_pic.png");
    this.$root.updateAvatar.$on("avatar", avatar => {
      this.avatar = avatar;
    });
    this.lang = localStorage.language ? localStorage.language : "cn";
    //console.log(this.lang);
    this.getCommon();
    if (this.token) {
      this.getAjaxMsg();
      this.getAvatar();
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    clearInterval(this.timer1)
    window.removeEventListener("scroll", this.handleScroll);
    this.$root.updateAvatar.$off("avatar");
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/style/variable";
.logo{
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-top: -5px;
    margin-right: 3px;
}
.el-dropdown {
  &:hover {
    cursor: pointer;
  }
}
.left>div,.left>a{
   margin: 0 5px;
   display:inline-block;
}
.bibiTrade{
  position: relative;
  display:inline-block;
   span{
     cursor: pointer;
   }
   .arrowRight{
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #8f9fa5;
   }

    &:hover >ul{
         display: block;
        }

  >.twoNav{
    position: absolute;
        top: 100%;
        left: 0;
        background: #333a44;
        font-size: 13px;
        left: 0;
        display: none;
    li{
      width: 141px;
    }
    span{
        width: 100%;
       display: inline-block;
       cursor: pointer;
    }
    >li{
          text-align: center;
          line-height: normal;
          position: relative;

         span{
          color: #fafcfe;
          padding: 10px;
          box-sizing: border-box;
        }
            >.thirdNav{
                 width:564px;
                  background-color: #616161;
                  position: absolute;
                  left: 141px;
                  top: 0px;
                  display: none;

                  >li{
                      float: left;
                      border-bottom: 1px solid transparent;
                      height: 35px;
                      &:hover{
                         background:$color-success;
                      }
                  }
            }
          &:hover{
            background:$color-success;
          }
         &:hover>.thirdNav{
          display: block;
        }
    }
  }
}


.isFixed {
  position: fixed;
  background-color: #fff;
  top: 0;
  z-index: 999;
}
.g-header {
  background-color: #616161;
  .container-box {
    display: flex;
    justify-content: space-between;
    .nav-l {
      display: flex;
      line-height: 60px;
      .item,
      .title {
        padding: 0 $distance-x2;
        cursor: pointer;
      }
      .title {
        padding-left: 0;
        font-size: $font-size-large-x;
        font-weight: bold;
        color: $color-text-white;
        .icon {
          color: #fff;
          transform: translate(2px, 6px);
        }
      }
      .item {
        border-left: 1px solid #6f6f6f;
        border-right: 1px solid #6f6f6f;
        color: $color-gray;
        &:hover {
          color: #fff;
        }
        .icon {
          transform: translateY(3px);
        }
      }
      .item + .item {
        border-right: 1px solid #6f6f6f;
      }
    }
    .nav-r {
      line-height: 60px;
      padding-right: $distance-x2;
      .el-select {
        width: 120px;
      }
      .avatar {
        vertical-align: middle;
        border-radius: 50%;
      }
      .avaBox:hover {
        background-color: transparent;
      }
      a {
        padding: 5px 12px;
        border-radius: 2px;
        text-decoration: none;
        color: $color-gray;

        &:hover {
          background-color: $color-theme;
          color: #fff;
        }
      }
      .sign-up {
        border: 1px solid $color-theme;
      }
      .account {
        color: $color-gray;
      }
    }
  }
  .subnav {
    padding-left: $distance-x2;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid rgba(51, 51, 51, 0.27);
    box-shadow: 0 1px 2px 0 rgba(51, 51, 51, 0.12);
    .content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .left>div{
       height: 42px;
       line-height: 42px;
        .el-dropdown {
          margin: 0 10px;
        }
      }

      .right {
        display: flex;
        align-items: center;
        .msg {
          padding: 0 15px;
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          .el-badge {
            line-height: 1;
          }
          &:hover {
            .msgBox {
              display: block;
            }
            & {
              background-color: #eeeeee;
              cursor: pointer;
            }
          }
          .msgBox {
            right: 0px;
            top: 42px;
            display: none;
            position: absolute;
            z-index: 999;
            border: 1px solid #dfdfdf;
            .msgTitle {
              text-align: center;
              padding: 10px 15px;
              border-top: 1px solid #ededed;
              font-size: 1.07em;
              font-weight: bold;
              background: #f8f8f8;
            }
            .msgFooter {
              text-align: center;
              height: 35px;
              background: #f8f8f8;
              border-top: 1px solid #ededed;
              display: flex;
              justify-content: space-between;
            }
            .msgContent {
              width: 430px;
              height: 200px;
              overflow-y: auto;
              background-color: #fff;
              .hasNoMsg {
                color: #9b9b9b;
                margin-top: 70px;
                text-align: center;
              }
              ul {
                .list {
                  padding: 10px 20px;
                  border-bottom: 1px solid #ededed;
                  display: flex;
                  .date {
                    width: 110px;
                    letter-spacing: 0;
                    color: #ccc;
                    small {
                      font-size: 85%;
                    }
                  }
                  .listContent {
                    width: 100%;
                    color: #777;
                  }
                  .unread {
                    width: 50px;
                    font-size: 13px;
                    display: inline-block;
                    text-align: right;
                    color: #85ce61;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
