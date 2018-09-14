<template>
  <div class="container-box">
    <h1>{{ title }}</h1>
    <div class="apply" v-html="context"></div>
  </div>
</template>

<script>
import {getArticleDetail} from 'api/hc'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      title: '',
      context: ''
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language: {
      handler: '_getArticleDetail',
      immediate: true
    },
    '$route': {
      handler: '_getArticleDetail'
    }
  },
  created() {
  },
  methods: {
    _getArticleDetail() {
      let id = this.$route.params.id
      getArticleDetail({id, lang: this.language})
        .then(data => {
          this.title = data.data.title
          this.context = data.data.context
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container-box {
    padding: 30px 50px;
    h1 {
      text-align: center;
    }
  }
</style>
