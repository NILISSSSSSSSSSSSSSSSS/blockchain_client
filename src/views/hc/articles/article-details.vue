<template>
  <div class="article-detail">
    <h1 class="title">{{data.title}}</h1>
    <div class="detail" v-html="data.context" ref="eee"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  mounted () {

  },
  watch: {
    data:{
      handler (val) {
        this.$nextTick(()=>{
          var imgs = this.$refs.eee.getElementsByTagName('img');
          for(var img of imgs){
            img.style.maxWidth = '80%';
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .article-detail {
    & > h1 {
      margin-top: 0;
      font-size: 32px;
    }
  }
</style>
