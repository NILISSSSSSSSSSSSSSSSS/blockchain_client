import Vue from 'vue'
import Router from 'vue-router'
import Index from 'views/index/index'



Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: resolve=> require (['views/index/index'],resolve)
    },
    {
      path: '/test',
      component: resolve=> require (['views/test.vue'],resolve)
    },
    {
      path: '/user',
      component: resolve=> require (['views/user/userDetail/index'],resolve)
    },
    {
      path: '/user/login',
      component: resolve=> require (['views/user/login/index'],resolve)
    },
    {
      path: '/user/yanZhengMa_login',
      component: resolve=> require (['views/user/yanZhengMa_login/index'],resolve)
    },
    {
      path: '/user/register',
      component: resolve=> require (['views/user/register/index'],resolve)
    },
    {
      path: '/user/resetpw',
      component: resolve=> require (['views/user/resetpw/index'],resolve)
    },
    {
      path: '/advertisement/create',
      component: resolve=> require (['views/advertisement/create/index'],resolve)
    },
    {
      path: '/advertisement/:id',
      component: resolve=> require (['views/advertisement/detail/index'],resolve)
    },
    {
      path: '/advertisement/edit/:id',
      component: resolve=> require (['views/advertisement/edit/'],resolve)
    },
    {
      path: '/outside-trade',
      component: resolve=> require (['views/outside-trade/index'],resolve),
      redirect: '/outside-trade/index/buy',
      children: [
        {
          path: 'index/:trade',
          name: 'outside-trade',
          component: resolve=> require (['views/outside-trade/trade-index/index'],resolve),
        },
        {
          path: 'orders/:id',
          component: resolve=> require (['views/outside-trade/orders/index'],resolve),
        },
        {
          path: 'trading/:id',
          component: resolve=> require (['views/outside-trade/trading/index'],resolve),
        }
      ]
    },
    //快速交易
    {
      path: '/fast-trade',
      component: resolve=> require (['views/fast-trade/index'],resolve),
    },

    {
      path: '/personcenter',
      component: resolve=> require (['views/personcenter/index'],resolve),
      children: [
        {
          path: '/',
          component: resolve=> require (['views/personcenter/personinfo'],resolve),
        },
        {
          path: 'edit',
          component: resolve=> require (['views/personcenter/edit'],resolve),
        },
        {
          path: 'changepassword',
          component: resolve=> require (['views/personcenter/changepw'],resolve),
        },
        {
          path: 'payment',
          component: resolve=> require (['views/personcenter/payment/list'],resolve),
        },
        {
          path: 'notify',
          component: resolve=> require (['views/personcenter/notify'],resolve),
        },
        {
          path: 'paymentSetting',
          component: resolve=> require (['views/personcenter/payment/setting'],resolve),
        },
        {
          path: 'verify_email',
          component: resolve=> require (['views/personcenter/verify/email'],resolve),
        },
        {
          path: 'verify_phone',
          component: resolve=> require (['views/personcenter/verify/phone'],resolve),
        },
        {
          path: 'verify_twostep',
          component: resolve=> require (['views/personcenter/verify/twostep'],resolve),
        }
      ]
    },
    {
      path: '/account',
      component: resolve=> require (['views/account/index'],resolve),
      redirect: '/account/wallets',
      children: [
        {
          path: 'wallets',
          component: resolve=> require (['views/account/wallets/index'],resolve),
        },
        {
          path: 'withdraw',
          component: resolve=> require (['views/account/withdraw/index'],resolve),
        },
        {
          path: 'withdraw/addsite',
          component: resolve=> require (['views/account/withdraw/addsite/'],resolve),
        },
        {
          path: 'withdraw/refer',
          component: resolve=> require (['views/account/withdraw/refer'],resolve),
        },
        {
          path: 'recharge',
          component: resolve=> require (['views/account/recharge/index'],resolve),
        },
        {
          path: 'savings',
          component: resolve=> require (['views/account/savings/'],resolve),
        },
        {
          path: 'recharge/new',
          component: resolve=> require (['views/account/recharge/new'],resolve),
        },
        {
          path: 'record',
          component: resolve=> require (['views/account/record/'],resolve),
        },
        {
          path: 'record/details',
          component: resolve=> require (['views/account/record/details/'],resolve),
        }
      ]
    },
    {
      path: '/account/transfer',
      component: resolve=> require (['views/transfer/'],resolve),
    },
    {
      path: '/account/transfer/history',
      component: resolve=> require (['views/transfer/history'],resolve),
    },
    {
      //我的发币页面
      path: '/account/mysendcoin',
      component: resolve=> require (['views/mysendcoin/index'],resolve),
    },
    {
      path: '/deal-center/orders',
      component: resolve=> require (['views/dealCenter/orders/'],resolve),
    },
    {
      path: '/deal-center/offers',
      component: resolve=> require (['views/dealCenter/offers/'],resolve),
    },
    {
      path: '/deal-center/offers/trash',
      component: resolve=> require (['views/dealCenter/offers/trash/'],resolve),
    },
    {
      path: '/deal-center/statistics',
      component: resolve=> require (['views/dealCenter/statistics/'],resolve),
    },
    {
      path: '/deal-center/transactions',
      name: '资金流水',
      component: resolve=> require (['views/dealCenter/transactions/'],resolve),
    },
    {
      path: '/hc',
      component: resolve=> require (['views/hc/'],resolve),
    },
    {
      path: '/hc/articles/:id',
      component: resolve=> require (['views/hc/articles/'],resolve),
    },
    {
      path: '/hc/more',
      component: resolve=> require (['views/hc/more-list/'],resolve),
    },
    {
      path: '/hc/article/:id',
      component: resolve=> require (['views/hc/articles/article'],resolve),
    },
    {
      path: '/futures',
      component: resolve=> require (['views/futures/futures'],resolve),
    }
  ]
})
