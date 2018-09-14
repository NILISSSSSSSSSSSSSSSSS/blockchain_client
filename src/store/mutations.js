const mutations = {
  setAuthlist (state,authlist) {
    state.authlist = authlist
  },
 
  setStep (state, step) {
    state.step.steps = step.steps
    state.step.end = step.end || $vm.$t('steps.trade')
  },
  setToken (state, token) {
    state.token = token
  },
  setLanguage (state, language) {
    state.language = language
  },
  setBasic (state, basic) {
    state.basic = basic
    localStorage.setItem('basic', basic)
  },
  INIT_DATA (state) {
    let data = localStorage.getItem('vue-chat-session');
    if (data) {
        state.sessions = JSON.parse(data);
    }
  },
  updateSession (state, sessions) {
    state.sessions.push(sessions);
  },
  orderFilterHandle (state, filter) {
    if(!filter){
      state.orderFilter = {
        orderCode: '',
        orderStatus: '',
        currency: '',
        startTime: null,
        endTime: null,
        orderType: null,
        page: 1
      }
    }else{
      state.orderFilter[filter.key] = filter.val;
      if(filter.key != 'page'){
        state.orderFilter['page'] = 1;
      }
    }

  },
  setQRcode (state, qrcode){
    state.qrcode = qrcode
  },

  setCommon (state, common) {
    state.common = common
  },
  setAppDownload(state, appDownload) {
    state.appDownload = appDownload
  },
  setVerify(state, verify) {
    state.verify = verify
  }
}

export default mutations
