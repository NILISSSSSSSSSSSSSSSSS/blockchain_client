<template>
  <div class="empty">
    <img src="~assets/image/empty-box.png" alt="Empty box">
    <p class="empty-tips-text">{{text}}</p>
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
<style lang="scss" scoped>
.empty{
      width: 100%!important;
      padding: 50px 20px;
      text-align: center;
      font-size: 1.14em;
      img{
        max-width: 100%;
      }
      p{
        margin: 20px auto 0;
        color: #9B9B9B;
        letter-spacing: 2.4px;
      }
}
</style>