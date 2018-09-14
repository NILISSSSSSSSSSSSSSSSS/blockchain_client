<template>

</template>

<script>
export default {
  methods: {
    post: function(){
      this.$http.post('', this.newSite).then(res=>{
        if(res.data.code == 0){
          this.$message.success( '创建成功');
          this.$router.push({path:'', query: {}})
        }else{
          this.$message.error(this.$t(`err.${res.data.code}`));
        }
      }).catch(err=>{
        this.$message.error( this.$t('common.serverErr'));
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

