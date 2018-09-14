<template>
  <div class="leftside">
    <div class="baseinfo">
      <img class="avatar" :src="info.avatar" alt="" v-if="info.avatar" @click="goUserDetail()">
      <img class="avatar" src="~assets/imgs/user_default_pic.png" alt="" v-else @click="goUserDetail()">
      <div class="baseinfo-login">
        <p class="uname">{{info.name}}</p>
        <p class="mail">{{info.email}}</p>
        <span>{{$t('personcenter.last')}}{{info.signinTime | datetimeFormat}}</span>
        <div class="review">{{$t('personcenter.comment')}}<span class="review_p">+{{info.positiveComment}}</span>/<span class="review_n">-{{info.negativeComment}}</span></div>
      </div>
    </div>
    <div class="btn_group">
      <el-button @click.native="$router.push('/personcenter/edit')">{{$t('personcenter.modify1')}}</el-button>
      <el-button @click.native="$router.push('/personcenter/changepassword')">{{$t('personcenter.modify2')}}</el-button>
      
    </div>
    <div class="verify">
      <div class="id">
        <div class="verifyTitle">
          <img class="icon" src="~assets/image/IDVerification.png" alt="">
          <span>{{$t('personcenter.verify1')}}</span>
        </div>
        <div>
          <div class="verify-one"><icon :name="isVerifyEmail" scale="1.5"></icon> <router-link to="/personcenter/verify_email">{{$t('personcenter.verify2')}}</router-link></div>
          <!--<div class="verify-one"><icon name="circle-thin" scale="1.5"></icon> <span>实名验证</span></div>
          <div class="verify-one"><icon name="circle-thin" scale="1.5"></icon> <span>进阶验证</span></div>-->
        </div>
      </div>
      <div class="secury">
        <div class="verifyTitle">
          <img class="icon" src="~assets/image/SecurityVerification.png" alt="">
          <span>{{$t('personcenter.verify3')}}</span>
        </div>
        <div>
          <div class="verify-one"><icon :name="isVerifyPhone" scale="1.5"></icon> <router-link to="/personcenter/verify_phone">{{$t('personcenter.verify4')}}</router-link ></div>
          <div class="verify-one"><icon :name="isVerifyTwo" scale="1.5"></icon> <router-link to="/personcenter/verify_twostep">{{$t('personcenter.verify5')}}</router-link></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info'],
  data () {
    return {
      verify1: '1',
      verify2: '0',
      verify3: '0',

    }
  },
  
  methods: {
    goUserDetail: function(){
      this.$router.push({path: '/user', query: {id: this.info._id}})
    }
  },
  computed: {
    isVerifyEmail() {
      return this.info.email ? 'check-circle': 'circle-thin'
    },
    isVerifyPhone () {
      return this.info.phone ? 'check-circle': 'circle-thin'
    },
    isVerifyTwo () {
      return this.info.twoPhase ? 'check-circle': 'circle-thin'
    }
    // dateFormat: function(date){
    //   console.log(date);
    //   return new Date().Format("yyyy-MM-dd hh:mm:ss")
    // }
  },
  created () {
  },
  
}
</script>

<style lang="scss" scoped>
  .leftside{
    width: 380px;
    line-height: 20px;
    margin-right: 20px;
    .baseinfo{
      display: flex;
      align-items: center;
      .avatar{
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin-right: 15px;
        cursor: pointer;
      }
      .baseinfo-login{
        display: flex;
        flex-direction: column;
        .uname{
          font-weight: bold;
          color: #2A2A41;
          font-size: 1.2em;
        }
        span{
          letter-spacing: 0;
          font-size: 12px;
          opacity: 0.5;
          color: #2A2A41;
        }
        .review{
          color: rgba(42,42,65,0.5);
          font-size: 12px;
          .review_p{
            color: #43CB83;
            padding-right: 5px;
          }
          .review_n{
            padding-left: 5px;
            color: #D0021B;
          }
        }
        p{
          margin: 0;
        }
      }
    }
    .btn_group{
      margin-top: 20px;
      .el-button{
        padding: 7px;
      }
    }
    .verify{
      margin-top: 30px;
      border-top: 1px solid #E1E2EA;
      padding-top: 30px;
      .icon{
        width: 33px;
        margin-right: 10px;
        vertical-align: bottom;
      }
      .el-checkbox-group{
        display: flex;
        flex-direction: column;
        .el-checkbox{
          margin-left: 0px;
          .el-checkbox__inner{
            border-radius: 50%;
          }
        }
      }
      .verifyTitle{
        margin-bottom: 25px;
        font-weight: bold;
      }
      .verify-one{
        color: rgba(42,42,65,0.5);
        margin-bottom: 10px;
        span{
          margin-left: 25px;
          display: inline-block;
          vertical-align: super;
        }
        a{
          margin-left: 25px;
          display: inline-block;
          vertical-align: super;
          color: rgba(42, 42, 65, 0.5);
        }
      }

    }
  }
</style>

