<template>
  <div class="futures">
    <div slot="head" class="head"
      :style="{backgroundImage: `url(${require('../../assets/image/futures-bg.jpg')})`}">
      <div class="go-exchange">
        <a :href="qhAddress" target="_blank">
          <el-button type="success" @click="goQh">
            {{$t('futures.go')}}
            <!-- 进入期货市场 -->
          </el-button>
        </a>
      </div>
     <!-- 上面这个 -->
      <transfer :base="base" @getBase="_getBase"></transfer>

    </div>
    <div slot="body" class="body">
      <h2 class="table-title">
        {{$t('futures.history')}}
        <!-- 历史记录 -->
      </h2>
      <history :update="update"></history>
    </div>
  </div>
</template>

<script>
import { getRecord, getBase, transfer, qhEnter } from 'api/futures'
import History from './history'
import Share from './share'
import Transfer from './transfer'

export default {
  data() {
    return {
      // 划账
      balanceNumber: 0,
      currency: '',
      transfer: 0,
      qhAddress: '',
      update: 0,
      inviteCode: '',
      isCreateQh: false,

      base: {}
    }
  },

  watch: {
    transfer(val) {
      if (val < 0) {
        this.transfer = 1
      }
    }
  },
  created() {
    this._getBase()
  },
  methods: {
    goQh() {
      qhEnter()
        .then(data => {
          window.location.href = data.data.address
        })
       
    },

    // 获取余额等信息
    _getBase() {
      getBase()
        .then(data => {
          this.base = data.data
          this.balanceNumber = data.data.amount
          this.currency = data.data.currency
          this.qhAddress = data.data.qhAddress
          this.inviteCode = data.data.inviteCode
          //临时注释，待会改过来
          this.isCreateQh = data.data.isCreateQh
          // this.isCreateQh = true
        })
        
    }
  },
  components: {
    History,
    Share,
    Transfer
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';
  .head {
    padding: 32px 0;
    background-repeat: no-repeat;
    background-size: cover;
    .transfer {
      margin: 0 5%;
      padding: 15px 8px;
      border-radius: 3px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 40px;
      background-color: #fff;
    }
    .go-exchange {
      text-align: center;
      margin-bottom: 32px;
    }
    .balance {
      text-align: center;
      span {
        cursor: pointer;
      }
      span::selection {
        background: transparent;
      }
    }
  }
  .body {
    padding: 32px 0;
    .table-title {
      text-align: center;
    }
  }
  .futures{
    min-height: $minContent-height;
  }
</style>
