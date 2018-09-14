<template>
  <layout>
    <div slot="head" class="head container-box">
      <div>
        <router-link tag="div" to="/account/wallets">
          <el-button type="info" plain size="mini">{{$t('account.return')}}</el-button>
        </router-link>
        <h1>{{$t('account.title2', {currency: data.currency})}}</h1>
        <h3 class="state">{{$t('account.recharge.state')}}</h3>
      </div>

      <div class="erweima_row" v-for="(item, index) in data.address" :key="index">
        <div class="site">
          <!-- 这里 -->
          {{$t("account.recharge.copyAddress",{ msg1:data.currency,msg2:item.baseChain})}}: {{ item.address }}
          <el-button type="success" plain size="mini" style="margin-top: 10px;font-size:13px" v-clipboard:copy="item.address" v-clipboard:success="onCopy" v-clipboard:error="onCopyError">
              {{$t('common.copy')}}</el-button>
        </div>
        <div>
          <qrcode :value="item.address" size="200"></qrcode>
          <span class="state">{{$t('account.recharge.qrcode')}}</span>
        </div>
      </div>
      
        <div class="hint">
          <p class="p1">{{$t('account.recharge.hint', {notice: data.notice})}}</p>
        </div>
    </div>
    <!-- 充值历史记录 -->
    <div slot="body" class="history">
      <div class="container-box">
        <h2>{{$t('account.recharge.title', {currency: data.currency})}}</h2>
        <ul class="list">
          <li class="head">
            <div>{{$t('common.table.currency')}}</div>
            <div>{{$t('common.table.rechargeTime')}}</div>
            <div class="hase">{{$t('common.table.hase')}}</div>
            <div>{{$t('common.table.rechargeNumber')}}</div>
            <div>{{$t('common.table.state')}}</div>
            <div>{{$t('common.table.confirmNumber')}}</div>
          </li>
          <li class="l1" v-for="(item, index) in data.record" :key="index">
            <div>{{ data.currency }}</div>
            <div>{{ $moment(item.time)._format() }}</div>
            <div class="hase">
              <router-link to="#">{{ item.hash }}</router-link>
            </div>
            <div>{{ item.amount + data.currency }}</div>
            <div>{{$t('account.record.status.'+ item.status)}}</div>
            <div>{{ item.affirmCount }}</div>
          </li>
          <li class="l2" v-if="(data.record.length === 0)">
            <emptyBox :text="$t('account.recharge.no')"></emptyBox>
          </li>
        </ul>
      </div>
    </div>
  </layout>
</template>

<script>
import { isDeposits } from "api/account";
import emptyBox from "@/components/emptyBox.vue";
export default {
    components: {
        emptyBox
    },
    data() {
        return {
            data: {
                record: []
            }
        };
    },
    created() {
        this.currency = this.$route.query.id;
        isDeposits(this.currency)
            .then(data => {
                this.data = data.data;
            })
            .catch(data => {
                this.$message.error(this.$t(`err.${data.code}`));
            });
    },
    methods: {
        onCopy() {
            this.$message.success("复制成功！");
        },
        onCopyError() {
            this.$message.console.error("复制失败！");
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/style/variable.scss";

.head {
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    h1 {
        margin: 30px 0;
        font-weight: bold;
    }
    .site {
        padding: 20px 30px;
        border-radius: 4px;
        border: 1px solid #f1f1f1;
        margin-top: 20px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        .el-button {
            transform: translateX(100px);
        }
    }
    .hint {
        margin-top: 32px;
        margin-bottom: 16px;
        p {
            margin: 0;
            color: rgba(42, 42, 65, 0.5);
        }
    }

}
.history {
    background-color: #f8f9fa;
    .list {
        padding-bottom: 24px;
        li {
            display: flex;
            justify-content: space-between;
            padding: 16px;
            .hase {
                padding-right: 16px;
                width: 30%;
                word-break: break-all;
            }
            & > div {
                width: 14%;
            }
        }
        .head {
            color: rgba(42, 42, 65, 0.5);
            flex-direction: row;
        }
        .l1 {
            margin-bottom: 16px;
            border: 1px solid rgba(151, 151, 151, 0.1);
            border-radius: 4px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
            background-color: #fff;
        }
        .l2 {
            margin-bottom: 16px;
            border: 1px solid rgba(151, 151, 151, 0.1);
            border-radius: 4px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
            background-color: #fff;
            text-align: center;
        }
    }
}

.erweima_row {
    display: flex;
    text-align: center;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}
.site {
    margin-top: 20px;
    padding: 20px 30px;
    border-radius: 4px;
    border: 1px solid #f1f1f1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    width: 840px;
    margin-right: 40px;
    text-align: left;
}
</style>
