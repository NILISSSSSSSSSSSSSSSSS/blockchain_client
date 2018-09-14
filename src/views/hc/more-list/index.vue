<template>
  <div class="container-box">
    <navigation :centerText="centerText" :lang="lang"></navigation>
    <div class="body">
      <h1>{{ lang }}</h1>
      <ul>
        <li v-for="(item, index) in list" :key="index"
        class="list" @click="handleLink(item.id)">{{item.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/navigation'
import { getArticleList } from 'api/hc'
import { mapGetters } from 'vuex'

export default {
  components: {
    Navigation
  },
  data() {
    return {
      tags: [],
      list: []
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  created() {
    this.init()
    this._getArticleList(this.language)
  },
  watch: {
    language(val) {
      if (val) this._getArticleList(val)
      this.centerText = this.center === 'notice' ? this.$t('hc.noticeCenter') : this.$t('hc.helpCenter')
    }
  },
  methods: {
    init() {
      this.center = this.$route.query.center
      this.title = this.$route.query.title
      this.tags.push(this.title)
      this.tags.push(this.center)
      this.centerText = this.center === 'notice' ? this.$t('hc.noticeCenter') : this.$t('hc.helpCenter')
      this.lang = this.$route.query.lang
    },
    _getArticleList(language='cn') {
      getArticleList({tags: this.tags, lang: language}).then(data => {
        this.list = []
        data.data.forEach(item => {
          this.list.push({id: item._id, title: item.title})
        })
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    handleLink(id) {
      this.$router.push({path: `/hc/articles/${id}`, query: {
        title: this.title,
        lang: this.lang,
        center: this.center
      }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .container-box {
    padding: 40px 0;
    .body {
      padding: 20px 0 0 240px;
      .list {
        border-bottom: 1px solid #ddd;
        font-size: 16px;
        padding: 15px 0;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
