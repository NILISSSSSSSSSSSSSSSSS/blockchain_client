<template>
  <div class="trade-state">
    <p class="title">{{$t('common.tradeDesc')}}</p>
    <p style="font-size: 13px;" v-html="State"></p>
  </div>
</template>

<script>
export default {
  props: {
    State: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .trade-state {
    margin: 40px 0;
    padding: 0 15px 0 10px;
    border-left: 5px solid #43CB83;
    .title {
      font-size: 10px;
      color: gray;
    }
  }
</style>
