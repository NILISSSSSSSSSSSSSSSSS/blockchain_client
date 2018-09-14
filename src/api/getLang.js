import $http from '@/plugins/$http'
import VueI18n from 'vue-i18n'
import Vue from 'vue'
Vue.use(VueI18n);
const i18n = new VueI18n({
  //locale: language,
  // fallbackLocale: language,
  //messages
})
export function getLang(){
  return new Promise ( (resloveP,reject)=>{
    $http.get(`/common?isPubAdvertise=true`).then(res=>{
    res = res.data;
    localStorage.officialCurrency = res.data.officialCurrency;
    var langList = res.data.lang;
    var i,filePath;
    var len = langList.length;
    for( i = 0; i < len; i++){
      if('cn' == langList[i]._id){
        filePath = langList[i].jsonFilePath;
      }
    }
    loadLanguageAsync('cn', filePath, resloveP);
  }).catch(err => {
      console.log(err)
    })
  })
}
function setI18nLanguage (lang) {
  i18n.locale = lang
  $http.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}
function loadLanguageAsync (lang, filePath, resloveP) {
  console.log(i18n.locale !== lang)
  if (i18n.locale !== lang) {
      return new Promise ( (reslove,reject)=>{
        $http.get(filePath).then(res => {
          localStorage.language = lang;
          i18n.setLocaleMessage(lang, res.data)
          setI18nLanguage(lang)
          resloveP();
        })
      } )

    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
