<template>
  <div class="trade-state">
    <p class="title">{{$t('common.tradeRemark')}}</p>
    <p v-html="remarks"></p>
  </div>
</template>

<script>
export default {
  props: {
    remarks: ''
  }
}
</script>

<style lang="scss" scoped>
  .trade-state {
    margin: 40px 0;
    padding: 0 15px 0 10px;
    border-left: 5px solid #FFCF49;
    .title {
      font-size: 10px;
      color: gray;
    }
  }
</style>
