<template>
    <div class="sendCoin">
        <el-row class="sendRow">
        <!-- 我要发币 按钮-->
            <el-button type="success" @click="wanFaBi()">{{$t('mySendCoin.wanToSend')}}</el-button>
        </el-row>
        <!-- 表格数据 -->
        <el-table :data="tableData" stripe style="width: 100%;margin:20px 0;">
            <el-table-column prop="currency" :label="$t('common.table.currency')" align="center" style="width:80px">
                <template slot-scope="scope">
                <span>{{ scope.row.currency }}</span>
                </template>
            </el-table-column>
                <el-table-column prop="amount" :label="$t('common.count')" align="center" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.amount }}</span>
                    </template>
            </el-table-column>
            <!-- 发币时间 -->
            <el-table-column prop="faBiTime" :label="$t('common.table.faBiTime')" style="width:100px" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('common.table.state')" align="left" style="width:180px">
                    <template slot-scope="scope">
                        <span class="statue_span">{{ scope.row.status | statusFilter}}</span>
                          <!-- 如果等于申请中,显示取消按钮 -->
                        <el-button type="success" size="small" v-if="scope.row.status=='PUTIN' " @click="cancelApplication(scope.row)">{{ $t('el.datepicker.cancel') }}</el-button>
                    </template>
            </el-table-column>
       </el-table>
    <el-pagination :background="true" @current-change="changePage" :page-size="onePage" layout="prev, pager, next, jumper" :total="allCount">
    </el-pagination>

    <!-- 我要发币弹框 -->
        <el-dialog
            :title="$t('mySendCoin.wanToSend')"
            :visible.sync="sendDialog"
            width="560px"
            center>
      <el-form class="form" >
        <el-form-item  :label="$t('mySendCoin.faBiName')" class="faBiNameDiv">
            <el-input v-model="currencyName" :placeholder="$t('mySendCoin.faBiPlaceholder1')"></el-input>
        </el-form-item>
          <el-form-item  :label="$t('mySendCoin.faBiNum')">
            <el-input v-model="faBiShuLiang"   @keyup="onlyNumber"  @blur="onlyNumber"   min="0" ></el-input>
        </el-form-item>
        <p class="faBi_text" v-if="ethAddress">{{$t('mySendCoin.walletAddress')}}: {{ ethAddress }}</p>
         <p class="faBi_text">{{$t('mySendCoin.faBiTips')}}</p>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary"  @click="submit">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
             tableData: [],
            allCount: 0,
            onePage: 10,
            currentPage:1,

            // 弹框
            sendCoinTitle:"",
            sendDialog:false,
            currencyName:"",
            faBiShuLiang:"1000,000,000",
            ethAddress:"",
        }
    },
 
    created(){
      this.getData();
      this.getAddress();
      if(this.$route.query.yiJianFaBi){
        this.sendDialog=true;
      }
    },
    // 状态过滤
    filters:{
        statusFilter:function(value){
           if (value == 'PUTIN') return $vm.$t('mySendCoin.yiShenQing');
           else if (value == 'INPROGRESS') return $vm.$t('mySendCoin.jinXingZhong');
           else if (value == 'FINISHED') return $vm.$t('mySendCoin.yiWanCheng');
           else if (value == 'CANCELLED') return $vm.$t('mySendCoin.yiQuXiao');
        }
    },
    methods: {
        getAddress(){
         this.$http.get("/issue_currency/ethaddr").then(res => {
            if (res.data.code == 0) {
                this.ethAddress=res.data.data.address
              console.log(this.ethAddress)
            }
            else{
              this.$message.error(this.$t(`err.${res.data.code}`));
            } 
            })
        },
     wanFaBi(){
       this.currencyName="";
       this.faBiShuLiang="1000,000,000";
       this.sendDialog=true;
    },
    getData: function() {
      let params = {page:this.currentPage,pageSize:this.onePage};
      this.$http.get("/issue_currency/list", { params: params }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.list;
          this.allCount=res.data.data.count;
        } 
        else{
             
           this.$message.error(this.$t(`err.${res.data.code}`));
        }
     
      }).catch(err => {
         
          console.log(err)
             
            });
    },
    changePage(val) {
      this.currentPage=val;
      this.getData()
    },
    // 取消申请
    cancelApplication(val){
        console.log(val)
         this.$confirm(this.$t('mySendCoin.tip1'), this.$t('mySendCoin.tip4'), {
          confirmButtonText: $vm.$t('common.confirm'),
          cancelButtonText: $vm.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
             let data={};
            data.issueId=val.issueId;
           this.$http.patch("/issue_currency/cancel",data).then(res => {
                if (res.data.code == 0) {
                    this.$message.success(this.$t("mySendCoin.tip2"));
                    this.getData();
                } 
                else{
                    this.$message.error(this.$t(`err.${res.data.code}`));
                }
            })
           
        })
      },

     
      //表单提交
      submit(){
        if(this.currencyName.trim() == ''){
             this.$message.error(this.$t('mySendCoin.faBiPlaceholder1'));
             return;
        }
         if(this.currencyName.length>5){
                this.$message.error(this.$t("mySendCoin.faBiNameXiaoYu5"))
                return;
            }
         if(!( /^[0-9a-zA-Z]+$/).test(this.currencyName)){
                this.$message.error(this.$t("mySendCoin.faBiPlaceholder3"))
                return;
            }
          
         this.faBiShuLiang=this.faBiShuLiang.split(",").join("")//把逗号去掉并转成数字
         console.log(this.faBiShuLiang)
        //  console.log(this.faBiShuLiang)
         if(this.faBiShuLiang ===""){
             this.$message.error(this.$t('mySendCoin.faBiPlaceholder2'));
             return;
        }
         if(this.faBiShuLiang<=0){
             this.$message.error(this.$t('mySendCoin.shuLiangDaYu0'));
             return;
        }
    
        let data={};
        data.currency=this.currencyName.toUpperCase();
        data.amount=+this.faBiShuLiang;

           this.$http.post("/issue_currency/submit",data).then(res => {
            if (res.data.code == 0) {
                this.$message.success(this.$t("mySendCoin.faBiSuccess"));
                 this.getData();
                 this.sendDialog=false;
            } 
            else{
                   if(res.data.code == 60001){
                            this.$message.error(this.$t(`err.${res.data.code}`,{msg:res.data.data.amount}));
                            return;
                   }
                   else{
                      this.$message.error(this.$t(`err.${res.data.code}`));
                   }
               
            }
            })
      },
      //000的转换
      onlyNumber(e) {
      let value = e.target.value + ""
      value = value.split(",").join();
      // console.log("onlyNumber",value )
      //得到第一个字符是否为负号
      var t = value.charAt(0);
      //先把非数字的都替换掉，除了数字和.
      value = value.replace(/[^\d\.]/g, "");
      //必须保证第一个为数字而不是.
      value = value.replace(/^\./g, "");
      //保证只有出现一个.而没有多个.
      value = value.replace(/\.{2,}/g, ".");
      //保证.只出现一次，而不能出现两次以上
      value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      //如果第一位是负号，则允许添加
      // if (t == "-") {
      //   obj.value = "-" + obj.value;
      // }
      let dotIndex = value.indexOf('.') 
      let haveDot =  dotIndex > -1 ? true : false
      let tmpValue = ""
      if(haveDot){
        let dotPrev = value.slice(0,dotIndex)
        let dotNext = value.slice(dotIndex+1)
        // console.log(dotPrev,dotNext)
        tmpValue = this.addSysbom(dotPrev) + '.' + this.addSysbom(dotNext)
      }else{
        tmpValue = this.addSysbom(value)
      }
      
      this.faBiShuLiang = tmpValue
    },
    addSysbom(value){
      let tmpArr = value.split("")
      let count = 0
      let tmpValue = ""
      for(var i = tmpArr.length - 1; i >= 0; i-- ){
        count++
        if(count % 3 === 0){
          tmpValue = ',' + tmpArr[i] + tmpValue  
        }else{
          tmpValue = tmpArr[i] + tmpValue
        }
      }
      if(tmpValue.indexOf(',') === 0){
        tmpValue = tmpValue.slice(1)
      }
      return tmpValue
    },
  
  },
}
</script>
<style scoped>
.faBi_text{
      color: #38f;
    word-break: break-word;
    line-height: 1.7;
    font-size: 13px;
    text-align: justify;
}
  .sendCoin{
      max-width: 1200px;
          padding: 0 16px;
    margin: auto;
  }
  .sendRow{
      margin: 20px 0px;text-align: right;
  }
  .statue_span{
     margin-right: 20px
  }
</style>
<style>
  .faBiNameDiv .el-input__inner{
          text-transform: uppercase;
  }
</style>


