<template>
  <div class="share">
    <el-popover
      ref="code" placement="bottom-start" width="280" trigger="hover" >
      <div v-if="inviUrl">
        <el-input readonly :value="inviUrl" style="width: 100%">
        <el-button class="paste" slot="append" plain size="mini"
            v-clipboard:copy="inviUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">{{$t('personcenter.copy')}}</el-button>
        </el-input>
        <qrcode :value="inviUrl" size="254" style="margin-top: 10px"></qrcode>
      </div>
      <div v-else>{{$t('personcenter.mustNew')}}</div>
    </el-popover>

    <el-button v-popover:code>
      {{$t('personcenter.invite')}}
    </el-button>
  </div>
</template>

<script>
import { getShare } from 'api/futures'

export default {
  props: {
    code: String
  },
  data() {
    return {
      inviUrl: ''
    }
  },
  watch: {
    code (val) {
      if (!val) return
      if(process.env.NODE_ENV == 'development'){
        this.inviUrl = `${this.serverIP}/qh/invite?code=${this.code}`
      }else{
        this.inviUrl = `${window.location.protocol}//${window.location.host}/qh/invite?code=${this.code}`
      }
    }
  },
  methods: {
    onCopy: function (e) {
      this.$message({
        message: this.$t('adver.copySuccess'),
        type: 'success'
      });
    },
    onError: function (e) {
      this.$message.error(this.$t('adver.copyErr'));
    }
  }
}
</script>

<style lang="scss" scoped>
  .share {
    margin-top: 16px;
    text-align: center;
  }
</style>
