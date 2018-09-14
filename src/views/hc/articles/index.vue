<template>
  <div class="container-box">
    <navigation :centerText="centerText" :lang="info.lang"></navigation>
    <div class="body">
      <div class="side">
        <list-side :language="language"
          :tags="tags" :info="info" @refresh="refresh"></list-side>
      </div>
      <div class="article">
        <article-details :data="data"></article-details>
      </div>
    </div>
  </div>
</template>

<script>
import ListSide from './list-side'
import ArticleDetails from './article-details'
import Navigation from '../components/navigation'
import { getArticleDetail, getArticleTags } from 'api/hc'
import { mapGetters } from 'vuex'

export default {
  components: {
    ListSide,
    ArticleDetails,
    Navigation
  },
  data() {
    return {
      data: {},
      tags: [],
      info: {},
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language(val) {
      this._getArticleDetail(val)
    }
  },
  created() {
    this.init()
    this._getArticleDetail(this.language)
  },
  methods: {
    init() {
      this.id = this.$route.params.id
      this.info.lang = this.$route.query.lang
      this.info.title = this.$route.query.title
      this.info.center = this.$route.query.center
      this.tags.push(this.info.title)
      this.tags.push(this.info.center)
      this.centerText = this.center === 'help' ? this.$t('hc.helpCenter') : this.$t('hc.noticeCenter')
    },
    _getArticleDetail() {
      getArticleDetail({id: this.id, lang: this.language}).then(data => {
        this.data = data.data
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
    },
    refresh() {
      this.init()
      this._getArticleDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
  .container-box {
    padding: 32px 15px;
    .body {
      display: flex;
      justify-content: space-between;
    }
    .side {
      width: 18%;
    }
    .article {
      width: 82%;
      padding: 0 30px;
    }
    .el-breadcrumb {
      margin-bottom: 30px;
      min-height: 50px;
      padding-bottom: 15px;
    }
  }
</style>
