<template>
  <div class="operate">
    <p v-show="(status === 'waitPay')" class="t1">{{$t('outside.trading.operate.time1', {currency: currency})}}<span class="time">{{ countDown }}</span> {{ $t('outside.trading.operate.time2') }}</p>
    <p v-show="(trade === 'buy' && status === 'waitPay')" class="t2">{{$t('outside.trading.operate.hint')}}</p>
    <div>
      <el-button
        :disabled="canClick"
        v-show="showStatusBtn"
        @click="dialogVisible = true" type="success" >{{statusText}}</el-button>
    </div>
    <div>
      <el-button
        @click="handleExtend"
        v-show="showExtend"
        type="primary">{{$t('outside.trading.operate.extend')}}</el-button>
    </div>
    <div>
      <el-button
        @click="handleCancel"
        v-show="showCancel"
        type="primary">{{$t('outside.trading.operate.cancel')}}</el-button>
    </div>
    <div>
      <el-button
      @click="appeal_dialog = true"
      v-show="showAppeal"
      >
        {{$t('outside.appeal.appeal')}}
      </el-button>
    </div>
    <div>
      <el-button
      v-show="showAppeal_cancel"
      @click="cancel_appeal"
      >
        {{$t('outside.appeal.appeal_cancel')}}
      </el-button>
      
    </div>
    <p v-show="trade === 'buy'" class="warning">{{$t('outside.trading.operate.warning')}}</p>
    <div v-if="statusText == $t('outside.tradeText.release')" class="releaseTips" style="margin-top: 30px">
      <p>{{$t('outside.trading.release.tips1')}}</p>
      <p>{{$t('outside.trading.release.tips2')}}</p>
      <p>{{$t('outside.trading.release.tips3')}}</p>
      <p class="redTips" v-for="(item, i) in 3" :key="i">{{$t('outside.trading.release.tipsRed3')}}</p>
      <p>{{$t('outside.trading.release.tips4')}}</p>
      <p class="redTips" v-for="(item, i) in 3" :key="i">{{$t('outside.trading.release.tipsRed4')}}</p>
    </div>
    <!--申诉dialog模态窗-->
    <el-dialog :title="$t('outside.appeal.title')" :visible.sync="appeal_dialog" class="eva-dialog">
      <div>
        <div>{{$t('outside.appeal.must1')}}</div>
        <div>{{$t('outside.appeal.must2')}}</div>
        <div>{{$t('outside.appeal.must3')}}</div>
      </div>
      <p style="margin-bottom: 5px;">{{$t('outside.appeal.appealType')}}</p>
      <el-radio-group v-model="appeal.appealType">
        <div style="margin-top: 10px;"><el-radio label="no_pay" value="no_pay">{{$t('outside.appeal.typeList.no_pay')}}</el-radio></div>
        <div style="margin-top: 10px;"><el-radio label="no_coin" value="no_coin">{{$t('outside.appeal.typeList.no_coin')}}</el-radio></div>
        <div style="margin-top: 10px;"><el-radio label="no_response" value="no_response">{{$t('outside.appeal.typeList.no_response')}}</el-radio></div>
        <div style="margin-top: 10px;"><el-radio label="spite" value="spite">{{$t('outside.appeal.typeList.spite')}}</el-radio></div>
        <div style="margin-top: 10px;"><el-radio label="other" value="other">{{$t('outside.appeal.typeList.other')}}</el-radio></div>
      </el-radio-group>
      <el-input type="textarea" style="margin-top:10px;" :rows="4" v-model="appeal.msg" :placeholder="$t('outside.appeal.textarea')"></el-input>
      <p style="margin-bottom: 5px;">{{$t('outside.appeal.email')}}</p>
      <el-input v-model="appeal.tempEmail" :placeholder="$t('outside.appeal.notRequire')"></el-input>
      <p style="margin-bottom: 5px;">{{$t('outside.appeal.phone')}}</p>
      <el-input v-model="appeal.tempPhone" :placeholder="$t('outside.appeal.notRequire')"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appeal_dialog = false">{{$t('outside.appeal.btn_cancel')}}</el-button>
        <el-button type="primary" @click="sub_appeal">{{$t('outside.appeal.btn_ok')}}</el-button>
      </div>
    </el-dialog>
    <!--评价dialog模态窗-->
    <el-dialog :title="$t('outside.evaluation.evaluate')" :visible.sync="eva_dialog" class="eva-dialog">
      <el-radio-group v-model="evaluate.comment">
        <el-radio label="good" value="good">{{$t('outside.evaluation.grade1')}}</el-radio>
        <el-radio label="middle" value="middle">{{$t('outside.evaluation.grade2')}}</el-radio>
        <el-radio label="bad" value="bad">{{$t('outside.evaluation.grade3')}}</el-radio>
      </el-radio-group>
      <el-input type="textarea" style="margin-top:10px;" :rows="4" v-model="evaluate.str"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eva_dialog = false">{{$t('outside.evaluation.btn_cancel')}}</el-button>
        <el-button type="primary" @click="sub_evaluate">{{$t('outside.evaluation.btn_ok')}}</el-button>
      </div>
    </el-dialog>
    <!--备注付款信息-->
    <el-dialog
      v-if="trade == 'buy'"
      :title="$t('outside.trading.operate.confirm')"
      :visible.sync="dialogVisible"
      width="55%"
      center>
      <div v-if="trade === 'buy'">
        <p>{{$t('outside.trading.operate.state1')}}</p>
        <p>{{$t('outside.trading.operate.state2')}}</p>
        <p>{{$t('outside.trading.operate.state3')}}</p>
      </div>
      <div v-else>
        <p>{{$t('outside.trading.operate.sell1')}}</p>
        <p>{{$t('outside.trading.operate.sell2')}}</p>
        <p>{{$t('outside.trading.operate.sell3')}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="message">{{$t('outside.trading.operate.message')}}</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          resize="none"
          v-model="message">
        </el-input>
        <el-button type="primary" @click="handleSubmit">{{$t('outside.trading.operate.submit', {text: submitText})}}
        </el-button>
        <!--<el-button @click="dialogVisible = false">{{$t('outside.trading.operate.cancel')}}</el-button>-->
      </span>
    </el-dialog>

    <!--备注放币信息-->
    <el-dialog
      v-if="trade == 'sell'"
      :title="$t('outside.trading.operate.confirm_sell')"
      :visible.sync="dialogVisible"
      width="40%"
      center>
      <p>{{$t('outside.trading.operate.state_sell')}}</p>
      <span slot="footer" class="dialog-footer">
        <span class="message">{{$t('outside.trading.operate.message_sell')}}</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          resize="none"
          v-model="message">
        </el-input>
        <el-button type="primary" @click="handleSubmit">{{$t('outside.trading.operate.submit', {text: submitText})}}
        </el-button>
        <!--<el-button @click="dialogVisible = false">{{$t('outside.trading.operate.cancel')}}</el-button>-->
      </span>
    </el-dialog>
    <!-- 显示评价内容 -->

    <div class="has-eva" v-if="this.statusText == $t('outside.tradeText.complete')">
      <h3>{{$t('outside.evaluation.evaluation')}}</h3>
      <div class="eva-box" v-if="commentToOther.comment">
        <p><span>{{$t('outside.evaluation.mine')}}</span><span class="eva-rate" >{{$t(`outside.${commentToOther.comment}`)}}</span></p>
        <div class="content">{{commentToOther.str}}</div>
      </div>
      <div class="eva-box" v-else>
        <p><span>{{$t('outside.evaluation.mine')}}</span></p>
        <el-button type="primary"  @click.native="eva_dialog = true" >{{$t('outside.evaluation.evaluate')}}</el-button>
      </div>
      <div class="eva-box" v-if="commentToMe.comment">
        <p><span>{{$t('outside.evaluation.others')}}</span><span class="eva-rate">{{$t(`outside.${commentToMe.comment}`)}}</span></p>
        <div class="content">{{commentToMe.str}}</div>
      </div>
      <div class="eva-box" v-else >
        <p><span>{{$t('outside.evaluation.others')}}</span></p>
        <div style="font-size: 13px;">{{$t('outside.evaluation.noComment')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderUpdate, appeal} from 'api/outside-trade'
import { mapMutations } from 'vuex'
export default {
  props: {
    currency: '',
    orderCode: '',
    status: '',
    timeOut: 0,
    trade: '',
    system: '',
    commentToMe: null,
    commentToOther: null,
    appealStatus: null,
    appealUser: '',
    socketId: ''
  },
  data() {
    return {
      appeal_dialog: false,
      appeal: {
        appealType: '',
        msg: '',
        tempEmail: '',
        tempPhone: '',
      },
      showAppeal_cancel: false,
      eva_dialog: false,
      evaluate: {
        comment: 'good',
        str: '',
      },
      countDown: 0,
      dialogVisible: false,
      message: this.$t('outside.complete'),
      submitText: '',
      canClick: true,
      showExtend: false,
      showCancel: false,
      showAppeal: false,
      showStatusBtn: true,
      systemStatus: '', //聊天上传的系统状态
      statusText: ''
    }
  },
  watch: {
    appealStatus(val){
      if(val === 'normal'){
        this.showAppeal = true;
        this.showAppeal_cancel = false;
        console.log(this.status);
        if(this.status === 'waitCoin'){
          this.showStatusBtn = true;
          this.statusText = this.trade === 'buy' ? this.$t('outside.tradeText.waitConfirm') : this.$t('outside.tradeText.release')
          this.canClick = this.trade === 'buy' ? true : false;
        }
      }
      if(val != 'normal'){
        this.showExtend = false;
        this.showCancel = false;
        this.showAppeal = false;
        this.showStatusBtn = false;
      }
      if(val === 'commit'){
        console.log(this.socketId)
        console.log(this.appealUser)
        window.timer_delay = setInterval(()=>{
          if(this.socketId){
            clearInterval(window.timer_delay)
            if(this.socketId === this.appealUser){
              this.showAppeal_cancel = true
            }
          }
        }, 10)
        
      }
    },
    status(val) {
      val === 'waitPay' && this.trade === 'buy' && this.notify(this.$t('outside.trading.tips.tip1Con'), this.$t('outside.trading.tips.tip1'));
      val === 'waitCoin' && this.trade === 'buy' &&  this.notify(this.$t('outside.trading.tips.tip2Con'), this.$t('outside.trading.tips.tip2'))
      
      if(val !== 'waitCoin'){
        this.showAppeal = false;
      }
      if (val === 'waitPay') {
        this.setStep({steps: 4})
        this.statusText = this.trade === 'buy' ? this.$t('outside.tradeText.signPay') : this.$t('outside.tradeText.waitPay')
        this.canClick = this.trade === 'buy' ? false : true
        this.showExtend = this.trade === 'buy' ? true : false
        this.showCancel = this.trade === 'buy' ? true : false
      } else {
        this.showExtend = false
        this.showCancel = false
        if (val === 'waitCoin') {
          this.setStep({steps: 5})
          this.statusText = this.trade === 'buy' ? this.$t('outside.tradeText.waitConfirm') : this.$t('outside.tradeText.release')
          this.canClick = this.trade === 'buy' ? true : false;
          if(this.appealStatus == 'normal'){
            this.showAppeal = true;
          }
        } else {
          this.canClick = true
        }
        if (val === 'success') {
          this.setStep({steps: 6})
          this.statusText = this.$t('outside.tradeText.complete')
        }
        if (val === 'cancel') {
          this.setStep({steps: 6, end: this.$t('steps.cancel')})
          this.statusText = this.$t('outside.tradeText.cancel')
        }
        if (val === 'expire') {
          this.setStep({steps: 6, end: this.$t('steps.timeOut')})
          this.statusText = this.$t('outside.tradeText.expire')
        }
      }
    },
    system: {
      handler(data) {
        let userId = data.userId;
        let val = data.context;
        this.systemStatus == val;
        this.$emit('updateState');
        if(val=='pay_ok'){
          this.statusText = this.trade === 'buy' ? this.$t('outside.tradeText.waitConfirm') : this.$t('outside.tradeText.release')
          this.canClick = this.trade === 'buy' ? true : false
        }
        if(val=="cancel_order"){
          this.statusText = this.$t('outside.tradeText.cancel')
        }
        if(val=="coin_ok"){
          this.statusText = this.$t('outside.tradeText.complete')
        }
        if(val=="appeal"){
          this.showExtend = false;
          this.showCancel = false;
          this.showAppeal = false;
          this.showStatusBtn = false;
          if(userId === this.socketId){
            this.showAppeal_cancel = true;
          }
        }
        if(val == "appeal_cancel"){
          this.showStatusBtn = true;
          this.statusText = this.trade === 'buy' ? this.$t('outside.tradeText.waitConfirm') : this.$t('outside.tradeText.release')
          this.canClick = this.trade === 'buy' ? true : false;
        }
      },
      deep: true
    },
    timeOut(val) {
      if (new Date(val).getTime() > new Date().getTime()) {
        clearTimeout(this.timmer)
        this._showTime(val)
      }
    },
    trade(val) {
      if (val) {
        this.submitText = this.trade === 'buy' ?
        this.$t('outside.tradeText.submitBuy')
        : this.$t('outside.tradeText.submitSell')
        this.message = this.trade == 'buy'?this.$t('outside.complete'):this.$t('outside.complete_sell')
      }
    }
  },
  created() {
    this.message = this.trade == 'buy'?this.$t('outside.complete'):this.$t('outside.complete_sell')
  },
  destroyed() {
    clearTimeout(this.timmer)
    clearInterval(window.timer_delay)
  },
  methods: {
    ...mapMutations(['setStep']),
    //取消申诉的请求
    cancel_appeal_req() {
      let data = {orderCode: this.orderCode}
      this.$http.post('/order/cancelappeal', data).then(res=>{
        if(res.data.code == 0){
          this.$message({
            message: this.$t('outside.appeal.cancel_success'),
            type: 'success'
          });
          this.$emit('updateState');
        }else{
          this.$message.error(this.$t('err.'+ res.data.code))
        }
      }).catch(err=>{
        this.$message.error($t('err.undefined'))
      })
    },
    //取消申诉提交
    cancel_appeal() {
      this.$confirm(this.$t('outside.appeal.cancel_comfirm'), this.$t('outside.appeal.noticeText'), {
        confirmButtonText: this.$t('el.messagebox.confirm'),
        cancelButtonText: this.$t('el.messagebox.cancel'),
        type: 'warning'
      }).then(() => {
        this.cancel_appeal_req();
      }).catch(() => {
               
      });
    },
    //温馨提示
    notify(message,title) {
      this.$alert(message, title, {
        type: 'warning'
      });
    },
    sub_appeal: function(){
      if(this.appeal.appealType == ''){
        this.$message.error(this.$t('outside.appeal.empty'))
        return;
      }
      let data = {
        orderCode: this.orderCode,
        ...this.appeal
      }
      appeal(data).then(data=>{
        this.$emit('updateState');
        this.appeal_dialog = false;
      }).catch(err=>{
        if(err.code){
          this.$message.error(this.$t('err'+err.code));
        }else{
          this.$message.error(this.$t('common.serverErr'));
        }
      })
    },
    sub_evaluate: function(){
      this.eva_dialog = false;

      let data = {
        ...this.evaluate
      }
      data.orderCode = this.orderCode

      this.$http.post('/order/comment', data).then(res=>{
        if(res.data.code == 0){
          this.$emit('updateState');
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error(this.$t('common.serverErr'));
      })
    },
    _showTime (endTime) {
      let time = (new Date(endTime) - new Date()) / 1000
      let timeStr = ''
      if (time >= 60) {
        let m = Math.floor(time/60) >= 10 ? Math.floor(time/60) :
                                            '0' + Math.floor(time/60)
        let s = Math.floor(time%60) >= 10 ? Math.floor(time%60) :
                                            '0' + Math.floor(time%60)
        timeStr = m + ':' + s
      } else {
        timeStr = '00:' + parseInt(time)
      }
      this.countDown = timeStr
      this.timmer = setTimeout(this._showTime, 1000, endTime)
      if (new Date(endTime).getTime() <= new Date().getTime()) {
        clearTimeout(this.timmer)
        setTimeout(() => this.$emit('updateState'), 3000)
        setTimeout(() => this.$emit('updateState'), 5000)
        setTimeout(() => this.$emit('updateState'), 7000)
        setTimeout(() => this.$emit('updateState'), 9000)
      }
    },
    handleSubmit() {
      orderUpdate(this.orderCode, 'affirm', this.message).then(data => {
        this.$emit('updateState')
        this.$message.success(this.$t('dealCenter.sign'))
        this.$emit('remark', this.message);
        
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
      this.dialogVisible = false
    },
    handleExtend() {
      orderUpdate(this.orderCode, 'delay').then(data => {
        this.$emit('updateState')
        this.$message.success(this.$t('dealCenter.extend'))
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
    },
    handleCancel() {
      this.$confirm(this.$t('outside.trading.operate.confirmCancel'), this.$t('outside.trading.operate.cancelText'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        orderUpdate(this.orderCode, 'cancel').then(data => {
          this.$emit('updateState')
          this.$message.success(this.$t('dealCenter.cancelSuccess'))
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
      }).catch(() => {

      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";
  .operate {
    padding: 40px;
    text-align: center;
    .releaseTips{
      width: 60%;
      margin: 0 auto;
      p{
        text-align: left;
      }
      .redTips{
        text-align: center;
        color: red;
        font-weight: bold;
      }
    }
    .has-eva{
      width: 100%;
      margin: 0 auto;
      h3{
        text-align: left;
        font-weight: 600;
        font-size: 17px;
        padding-bottom: 10px;
        border-bottom: 1px solid #cadae9;
      }
      .eva-box{
        margin-top: 20px;
        .content{
          height: 100px;
          overflow-y: auto;
          background: #ddd;
          border-radius: 5px;
          text-align: left;
          padding: 10px;
          border: 2px solid #f3e9e9;
          font-size: 13px;
        }
        p{
          display: flex;
          justify-content: space-between;
          color: #a18686;
          margin: 5px 0;
          .eva-rate{
            color: #9a69e7;
          }
        }
      }
    }
    .eva-dialog{
      text-align: left;
      .dialog-footer{
        display: flex;
        justify-content: space-between;
      }
      .el-button{
        width: 20%;
      }
    }
    & > p {
      color: #aaa;
    }
    .el-button {
      width: 60%;
      margin-top: 16px;
    }
    .warning {
      margin-top: 16px;
    }
    .time {
      color: $color-theme;
      font-size: 16px;
    }
  }
</style>
