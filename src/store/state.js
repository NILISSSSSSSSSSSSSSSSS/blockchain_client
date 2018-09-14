import {getCookie} from '@/plugins/cookie'

const now = new Date();
const state = {
  step: {
    steps: 0,
    end: ''
  },
  authlist:{},
  common: {
    siteName: '',
    siteDomain: '',
    lampRefresh: 5
  },
  token: getCookie('token'),
  language: localStorage.language ? localStorage.language : 'cn',
  basic: localStorage.basic ? localStorage.basic : '{}',
  //订单过滤
  orderFilter: {
    orderCode: '',
    orderStatus: '',
    currency: '',
    startTime: null,
    endTime: null,
    orderType: null,
    page: 1
  },
  // 当前用户
  user: {
    name: 'coffce',
    img: 'dist/images/1.jpg'
  },
  verify: {},
  // 会话列表
  sessions: [
  ],
  qrcode: '',
  appDownload: '',

}

export default state
