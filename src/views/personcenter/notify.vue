<template>
  <el-card class="notify">
    <pc-header :title="$t('personcenter.notify.title')" slot="header"></pc-header>
    <div class="content">
      <h3>{{$t('personcenter.notify.login')}}</h3>
      <div>
        <el-checkbox v-model="form.noLoginMSM">{{$t('personcenter.notify.noSMS')}}</el-checkbox>
        <el-checkbox v-model="form.noLoginEmail">{{$t('personcenter.notify.noMail')}}</el-checkbox>
      </div>
      <h3 style="margin-top: 30px">{{$t('personcenter.notify.trade')}}</h3>
      <div>
        <el-checkbox v-model="form.noTradeMSM">{{$t('personcenter.notify.noSMS')}}</el-checkbox>
        <el-checkbox v-model="form.noTradeEmail">{{$t('personcenter.notify.noMail')}}</el-checkbox>
      </div>
    </div>
    <div style="text-align: center;"><el-button type="success" class="subCls" @click="submit">{{$t('personcenter.notify.submit')}}</el-button></div>
  </el-card>
</template>

<script>
import pcHeader from "./components/pcHeader.vue";
import {notify, getDetail} from '@/api/user';
export default {
  components: {
    pcHeader
  },
  data() {
    return {
      form: {
        noLoginMSM: false,
        noLoginEmail: false,
        noTradeMSM: false,
        noTradeEmail: false
      }
    }
  },
  methods: {
    submit() {
      let data = this.form;
      notify(data).then(data=>{
        this.$message.success(this.$t('personcenter.notify.success'));
        this.$router.push('/personcenter');
      }).catch(err=>{
        this.$message.error(err.code?this.$t('err.'+err.code):this.$t('common.serverErr'))
      })
    },
    getDetail() {
      getDetail().then(data=>{
        for(let item in this.form){
          if(data.data[item] != undefined){
            console.log(data.data[item])
            this.form[item] = data.data[item]
          }
        }
        console.log(this.form)
      })
    }
  },
  created() {
    this.getDetail();
  }
}
</script>

<style lang="scss" scoped>
  .notify{
    width: 100%;
      .subCls{
        margin: 60px auto 0;
        width: 300px;
        height: 40px;
      }
  }
</style>
