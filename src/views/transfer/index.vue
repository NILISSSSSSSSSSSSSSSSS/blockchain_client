<template>
  <div class="transfer">
    <div class="head">
      <h1>{{$t('transfer.title')}}</h1>
      <router-link tag="div" to="/account/transfer/history">
        <el-button type="success" plain size="mini">{{$t('transfer.seeRecord')}}</el-button>
      </router-link>
    </div>


    <el-form class="form" >
            <!-- 请选择币种 -->
          <el-form-item prop="currency">
            <el-select style="width: 100%" class="margin12" :placeholder="$t('transfer.selectCoin')" v-model="form.currency" @change="changeCur" >
              <el-option :value="item.currency" v-for="item in currencylist" :key="item.currency"></el-option>
            </el-select>
          </el-form-item>
          <!-- 余额 -->
          <div v-if="form.currency">{{form.currency}}余额：{{getAmount}}</div>
          <!-- 请输入转币数量 -->
          <el-form-item prop="amount">
            <el-input type="number"   min=0 :placeholder="$t('transfer.setAmount')" class="margin12" v-model="form.amount"/>
          </el-form-item>

      <!-- 地址，手机，邮箱 -->
           <el-tabs v-model="firstActName" class="margin12" @tab-click="formReset1()">
            <el-tab-pane :label="$t('transfer.walletAddress')" name="address" >
                <!-- 钱包地址 -->
                <el-input :placeholder="$t('transfer.sendToAddress')" class="margin12 v-check" v-model="address" ></el-input>
            </el-tab-pane>
            <el-tab-pane :label="$t('transfer.duiFangShouJi')" name="shouJiHao" >
                <!-- 对方手机号 -->
                <el-input :placeholder="$t('transfer.inputPlaceholder1')" class="margin12 v-check"  v-model="phoneItem.phone"   v-for="(phoneItem,index) in phoneList" :key="index">
                  <callCode slot="prepend"  :currentindex="index"   @callCodeZuanZhang="getCallCode"  ></callCode>
                  <!-- 新增手机号 -->
                    <template slot="append" class="jiaJianBox">
                      <i class="jiaJian el-icon-circle-plus-outline"   @click="changePhone(`jia`)"></i>
                      <i class="jiaJian el-icon-remove-outline"   @click="changePhone(`jian`,index)" v-if="index!==0"></i>
                   </template>
                </el-input>
            </el-tab-pane>

             <el-tab-pane :label="$t('transfer.duiFangYouXiang')" name="youXiang" >
                 <!-- 对方邮箱 -->
                <el-input :placeholder="$t('transfer.inputPlaceholder2')" class="margin12 v-check"  v-model="emailItem.email"   v-for="(emailItem,index) in emailList" :key="index" >
                   <!-- 新增邮箱 -->
                    <template slot="append" class="jiaJianBox">
                      <i class="jiaJian el-icon-circle-plus-outline"   @click="changeEmail(`jia`)"></i>
                      <i class="jiaJian el-icon-remove-outline"   @click="changeEmail(`jian`,index)" v-if="index!==0"></i>
                   </template>
                </el-input>
            </el-tab-pane>
      </el-tabs>
      
      <!-- 验证 -->
      <el-tabs v-model="activeName" class="margin12" >
        <el-tab-pane :label="$t('account.refer.verify')" name="phone" >
          <div class="code" v-if="authlist.phone">
              <el-input v-model="code" :placeholder="$t('account.refer.code')">
                <template slot="append">
                  <el-button type="primary" @click="getCode" :disabled="isGetCode" ref="code">
                    {{ getCodeButton }}
                  </el-button>
                </template>
              </el-input>
          </div>
          <router-link to="/personcenter/verify_phone" v-else target="_blank">{{$t('common.gotoBindPhone')}}</router-link>
        </el-tab-pane>
        <el-tab-pane :label="$t('account.refer.verify_google')" name="twoPhase" >
          <div class="code" v-if="authlist.twoPhase">
              <el-input v-model="code_google" :placeholder="$t('account.refer.code_google')"></el-input>
            
          </div>
          <router-link to="/personcenter/verify_twostep" v-else>{{$t('common.gotoBindTwo')}}</router-link>
        </el-tab-pane>
      </el-tabs>
      <!-- 提交 -->
      <div class="button">
        <el-button type="success" @click="submit" style="width: 100%;">{{$t('common.table.submit')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { getTranInfo, transfer} from '@/api/transfer.js'
  import callCode from "@/components/callCode.vue";
  export default {
    components: {
      callCode
    },
    data() {
      return {
        address: '',
        shouJiHao:"",
        youXiang:"",
        form: {
          currency: '',
          amount: '',
        },
       
        // callCode: "",
        phone: '',
        getAmount: 0,
        totalMoney:0,
        authlist: {},
        currencylist: [],
        relative: {},
        code: '',
        code_google: '',
        getCodeButton: "",
        isGetCode: false,
        firstActName:"address",
        activeName: "phone",

       allLen:1,
       callCodeIndex:0,
       phoneList: [{ phone: "",  callCode:  '86' }],
       emailList:[{email:""}]
      }
    },
    methods: {
       yanZhengChongFu(a){
        return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+a.join("\x0f\x0f") +"\x0f");
      },

    // 增加手机
      changePhone(val,i){
        if(val=="jia"){
           if(this.form.currency == ''){
            this.$message.error(this.$t('transfer.selectCoin'));
            return;
          }

          if(this.form.amount == ''){
            this.$message.error(this.$t('transfer.setAmount'));
            return;
          }
        
          if(this.totalMoney-parseFloat(this.form.amount)*(this.phoneList.length+1)<=0){
            return;
          }
          else{
            this.phoneList.push({ phone: "", callCode:  '86' });
          }
          
        }
       if(val=="jian"){
          this.phoneList.splice(i,1)
        }

        // this.getLength()
        //  this.getAmount=(this.totalMoney-parseFloat(this.form.amount)*this.allLen).toFixed(8);
         console.log(this.phoneList)
      },
      //增加邮箱
      changeEmail(val,i){
      if(val=="jia"){
           if(this.form.currency == ''){
            this.$message.error(this.$t('transfer.selectCoin'));
            return;
          }

          if(this.form.amount == ''){
            this.$message.error(this.$t('transfer.setAmount'));
            return;
          }
       
          if(this.totalMoney-parseFloat(this.form.amount)*(this.emailList.length+1)<=0){
            return;
          }
          else{
            this.emailList.push({ email: ""});
          }
          
        }
       if(val=="jian"){
          this.emailList.splice(i,1)
        }
        //  this.getLength();
        //  this.getAmount=(this.totalMoney-parseFloat(this.form.amount)*this.allLen).toFixed(8);;
         console.log(this.emailList)
      },
      //获取邮箱或者手机的表单个数
      getLength(){
        if(this.firstActName==="shouJiHao"){
          this.allLen=this.phoneList.length
        }else if(this.firstActName==="youXiang"){
            this.allLen=this.emailList.length
        }
      },
      submit() {
         let data={};
        //  币种验证
          if(this.form.currency == ''){
          this.$message.error(this.$t('transfer.selectCoin'));
          return;
        }
          if(this.form.amount == ''){
          this.$message.error(this.$t('transfer.setAmount'));
          return;
        }
        if( isNaN(this.form.amount) || this.form.amount <= 0 ){
          this.$message.error(this.$t('transfer.amountError'));
          return;
        }
        // -------------地址，邮箱，手机号验证-------------
        if(this.firstActName==="address"){
           if(this.address.trim() == ''){
            this.$message.error(this.$t('transfer.sendToAddress'));
            return;
          }
          data.destType = "address";
          data.destVal = this.address;
        }
        // -------------验证手机号----------
        if(this.firstActName==="shouJiHao"){
          var flag=true;
            for(let i=0;i<this.phoneList.length;i++){
              if(this.phoneList[i].phone.trim() == ''){
                 this.$message.error(this.$t('transfer.inputPlaceholder1'));
                  flag=false;
                 return;
              }
            }
              //验证是否有重复的手机号
          if(flag){
             let arrId=this.phoneList.map(value => value.phone);
              if(this.yanZhengChongFu(arrId)){
                 $vm.$message.error($vm.$t('transfer.phoneNotXiangt'));
                 return;
              }
               //验证格式
               if(this.yanZhengGeShi(arrId,/^[1][3-9][0-9]{9}$/)==false){
                  $vm.$message.error($vm.$t('common.errPhone'));
                  return;
               }
              else{
                data.destVal=[];
                //验证手机通过
                 for(let i=0;i<this.phoneList.length;i++){
                   data.destVal.push({
                     val:this.phoneList[i].callCode+this.phoneList[i].phone,
                     code:this.phoneList[i].callCode,
                     phone:this.phoneList[i].phone
                     })
                  }
                   data.destType = "phone";
              }
          }
            }
         // -------------验证邮箱----------
        if(this.firstActName==="youXiang"){
          var flag=true;
          //验证邮箱是否全部输完
           for(let i=0;i<this.emailList.length;i++){
              if(this.emailList[i].email.trim() == ''){
                 $vm.$message.error($vm.$t('transfer.inputPlaceholder2'));
                 flag=false;
                 return;
              }
           }
           //验证是否有重复的邮箱号
          if(flag){
             let arrId=this.emailList.map(value => value.email);
             //验证重复
              if(this.yanZhengChongFu(arrId)){
                 $vm.$message.error($vm.$t('transfer.emailNotXiangt'));
                 return;
              }
               //验证格式
               if(this.yanZhengGeShi(arrId,new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"))==false){
                  $vm.$message.error($vm.$t('common.errEmail'));
                  return;
               }
              else{
                data.destVal=[];
                //验证邮箱通过
                 for(let i=0;i<this.emailList.length;i++){
                   data.destVal.push({
                     val:this.emailList[i].email,
                     })
                  }
                  data.destType = "email";
              }
          }
        }
      
       
     
        // ----------短信验证和两部验证-----------------
        if(this.activeName === 'phone'){
          if(this.code.trim() == ''){
            this.$message.error(this.$t('transfer.code'));
            return;
          }
          data.authCode = this.code;
        }
        if(this.activeName === 'twoPhase'){
          if(this.code_google.trim() == ''){
            this.$message.error(this.$t('transfer.code'));
            return;
          }
          data.authCode = this.code_google;
        }
        
        data.currency=this.form.currency
        data.authMode = this.activeName;// 验证模式，取两步验证和手机验证的一种
        data.amount = parseFloat(this.form.amount);
        // data.userId = this.relative.userId;
        console.log(data);
        transfer(data).then(res=>{
          this.$message.success(this.$t('transfer.success'));
          this.$router.push('/account/transfer/history');
        }).catch(err=>{
          this.$message.error(err.code?this.$t('err.'+err.code):this.$t('common.serverErr'))
        })
      },
       getCallCode(obj) {
         console.log( obj)
        this.phoneList[obj.suoYin].callCode = obj.val;
        console.log(this.phoneList)
      },
      changeCur() {
        this.currencylist.map((item, index)=>{
          if(item.currency === this.form.currency){
            console.log(this.currencylist[index].currAmount);
            this.totalMoney=this.currencylist[index].currAmount.toFixed(8)
            this.getAmount = this.currencylist[index].currAmount.toFixed(8)
          }
        })
      },
      formReset1(){
        this.address=this.shouJiHao="";
        this.getAmount=this.totalMoney;
        this.phoneList=[{ phone: "",  callCode:  '86' }],
        this.emailList=[{email:""}]
      },

      //获取币种
      getTranInfo() {
        getTranInfo().then(res=>{
          this.authlist = res.data.authlist;
          this.currencylist=res.data.currencylist
          this.phone = res.data.phone;
        })
      },
      getCode() {
        const url = "/transfer/phone_authcode";
        this._countDown();
        this.$http
          .post(url, {phone: this.phone})
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success(this.$t("account.send"));
            } else {
              this.$message.error(this.$t(`err.${res.data.code}`));
              this._countOver();
            }
          })
          .catch(err => {
            this.$message.error(this.$t("common.serverErr"));
            this._countOver();
          });
      },
      _countDown(second = 60) {
        const self = this;
        const end = new Date().getTime() + 1000 * second;
        window.timmer = setInterval(() => {
          this.isGetCode = true;
          const differ = Math.floor((end - new Date().getTime()) / 1000);
          self.getCodeButton = `${this.$t("common.getCode")}(${differ})`;
          if (differ < 1) {
            this.isGetCode = false;
            self.getCodeButton = this.$t("common.getCode");
            clearInterval(window.timmer);
          }
        }, 500);
      },
      _countOver() {
        console.log("===================");
        this.isGetCode = false;
        this.getCodeButton = this.$t("common.getCode");
        console.log(window.timmer);
        clearInterval(window.timmer);
      },
      //判断手机或者邮箱格式是否正确
      yanZhengGeShi(obj,reg){
        console.log("验证格式")
         for(let i=0;i<obj.length;i++){
           if(!reg.test(obj[i])){
             return false;
           }
         } 
      }
    },
    destroyed() {
      clearInterval(window.timmer);
    },
    mounted() {
      this.getCodeButton = this.$t("common.getCode");
      // // this.rules.address[0].message = this.$t('transfer.sendToAddress')
      // this.rules.currency[0].message = this.$t('transfer.selectCoin')
      // this.rules.amount[0].message = this.$t('transfer.setAmount')
    },
    created() {
      this.getTranInfo();
    }
  }
</script>

<style>
  .jiaJian{
        color: #409EFF;
    font-size: 22px;
    cursor: pointer;
  }
  .transfer .el-input-group__append{
    width: 89px;text-align: center;
  }
</style>

<style lang="scss" scoped>
.transfer {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 50px 16px;
  .head{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h1{
    margin: 30px 0;
    font-weight: bold;
    font-size: 2em;
  }
  .form{
    width: 560px;
    margin: 0 auto;
    .margin12{
      margin: 12px 0;
    }
    .el-tabs{
      a{
        color: #43cb83;
        display: inline-block;
        padding: 1px 0;
        border-bottom: 1px dotted #43cb83;
      }
    }
    .button{
      margin-top: 35px;
    }
  }
}
</style>
