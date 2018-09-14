<template>
  <div class="layout">
    <div class="head">
      <slot name="head"></slot>
    </div>
    <div class="body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .layout {
    & > .head {
      padding-top: 32px;
      padding-bottom: 32px;
      background-color: #fff;
    }
    & > .body {
      padding-top: 32px;
      padding-bottom: 32px;
      background-color: #f8f9fa;
    }
  }
</style>
