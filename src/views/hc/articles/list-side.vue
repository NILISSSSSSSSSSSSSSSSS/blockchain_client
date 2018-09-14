<template>
  <div class="list-side">
    <h3 class="title">{{$t('hc.other')}}</h3>
    <ul>
      <li class="list" v-for="(item, index) in list" :key="index">
        <span class="link" :class="{active: item.id === id}"
          @click="handleLink(item.id)">{{item.title}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { getArticleList } from 'api/hc'
export default {
  props: {
    tags: null,
    info: null,
    language: null
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    language: {
      handler: '_getArticleList',
      immediate: true
    }
  },
  created() {
  },
  methods: {
    handleLink(id) {
      this.$router.push({path: `/hc/articles/${id}`, query: { ...this.info }})
      this.$emit('refresh')
      this._getArticleList(this.language)
    },
    _getArticleList() {
      this.list = []
      this.id = this.$route.params.id
      getArticleList({tags: this.tags, lang: this.language}).then(data => {
        data.data.forEach(item => {
          this.list.push({
            id: item._id,
            title: item.title
          })
        })
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-side {
    height: auto;
    .title {
      margin-top: 0;
      font-size: 14px;
      font-weight: bold;
    }
    .list {
      .link {
        border-radius: 4px;
        color: #333333;
        display: block;
        font-weight: 300;
        margin-bottom: 10px;
        padding: 10px;
        cursor: pointer;
        &:hover {
          background-color: #48cb83;
          color: #ffffff;
          text-decoration: none;
        }
        &.active {
          background-color: #48cb83;
          color: #ffffff;
          text-decoration: none;
        }
      }
    }
  }
</style>
