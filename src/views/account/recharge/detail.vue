<template>
  <layout>
    <div slot="head" class="head">
      <h1>充值详情</h1>
    </div>
    <div slot="body" class="body">
      <div class="card">
        <ul class="list">
          <li>
            <span class="title">状态：</span>
            <span>已完成</span>
          </li>
          <li>
            <span class="title">金额：</span>
            <span>0.01 ETH</span>
          </li>
          <li>
            <span class="title">地址：</span>
            <span>0x8C03605E88b05D85cDc21d0eC15cC69fF4e6201f</span>
          </li>
          <li>
            <span class="title">确认数：</span>
            <span>13</span>
          </li>
          <li>
            <span class="title">日期：</span>
            <span>2018-03-01 09:09</span>
          </li>
          <li>
            <span class="title">交易哈希：</span>
            <span>0x5d5edb459aada773ad3b8582b975976e858db057bf3ce5900ccd05cc08edba7c</span>
          </li>
        </ul>
      </div>
      <div class="operate">
        <router-link tag="div" to="/account/record">
          <el-button>返回</el-button>
        </router-link>
      </div>
    </div>
  </layout>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .head {
    text-align: center;
    .warning {
      display: inline-block;
      padding: 16px 60px;
      background-color: #daedf7;
      color: #31708f;
    }
    .p1 {
      color: rgba(42,42,65,0.5);
    }
  }
  .body {
    text-align: center;
    background-color: #f8f9fa;
    .card {
      width: 480px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0px 1px 1px rgba(0,0,0,0.16);
      background-color: #fff;
      .list {
        li {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          span {
            width: 70%;
            text-align: left;
            word-wrap: break-word;
          }
          .title {
            width: 30%;
            text-align: right;
            color: rgba(42,42,65,0.5);
          }
        }
      }
    }
    .operate {
      width: 480px;
      margin: 0 auto;
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid rgba(222,222,222,0.46);
    }
  }
</style>
