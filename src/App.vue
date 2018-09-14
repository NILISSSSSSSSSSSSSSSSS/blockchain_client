<template>
  <div id="app">
    <g-header></g-header>
    <router-view :key="$route.fullpath" ></router-view>
     <!-- 客户服务按钮 -->
     <div class="kefuWrapper">
      <div class="wolive-form" id="wolive-kefu"   @click="lianXiKeFu()" >
        <img src="./assets/image/kefu.png" alt="">
        在线咨询
     </div>
     
    </div>

    <g-footer></g-footer>
  </div>
</template>

<script>
import GHeader from 'views/header/header'
import GFooter from 'views/footer/footer'
import { getDetail } from "@/api/user";
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      userInfo: {},
    }
  },
  components: {
    GHeader,
    GFooter
  },
  computed: {
    ...mapGetters(["token"]),
  },
  watch:{
    token(val) {
      if (val == "") {
        return;
      } else {
        this.lianXiKeFu()
      }
    },
  },
  created() {
    this.getAvatar();
  },
  methods: {
    lianXiKeFu(){
      var url=this.getUrl();
      let visiter_id=null;
      let visiter_name=null; 
      let avatar=null; 
      this.getAvatar();
      if(this.token){
        visiter_id=this.userInfo.id
        visiter_name=this.userInfo.nickName
        if(this.userInfo.avatar){
          avatar=this.userInfo.avatar; 
        }
       else{
        avatar=url+"/static/user_default_pic.png" 
       }
      }
      else{
        visiter_id=parseInt(Math.random()*(100000000000-1000)+1000);
        visiter_name=`访客${visiter_id}`;
        avatar=url+"/static/user_default_pic.png" 
      };
      console.log(visiter_id)
      console.log(visiter_name)
      console.log(avatar)
      window.open('http://kefu.servicevip.net/index/index/home?visiter_id='+visiter_id+'&visiter_name='+visiter_name+'&avatar='+avatar+'&business_id=service&groupid=1')
    },
    getAvatar: function() {
      getDetail()
        .then(data => {
          this.userInfo = data.data
          
        })
        .catch(err => {
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        });
    },
  },
  
}
</script>

<style lang="scss">
@import 'assets/style/index.scss';
#app{
  min-width: 768px;
  background: #F8F9FA;
}

.wolive-form {
  height: 110px;
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 555555;
  -webkit-transition: 0.2s ease-out;
    font-size: 12px;
    background-color: #67c23a;
    z-index: 9999;
    color: white;
    cursor: pointer;
    border-radius: 7px;
    width: 100px;
 
    /* display: flex; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
     font-size: 15px;
      img{
       width: 36px;
       height: 36px;
       margin-top:3px;
       margin-bottom:8px;
      }
    }
</style>
