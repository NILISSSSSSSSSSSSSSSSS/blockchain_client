<template>
  <div class="message">
    <el-card class="box-card">
      <p class="notice" @click="handleToNotice(item)"
        v-for="(item, index) in noticeList" :key="index">{{ item.title }}</p>
      <p v-if="noticeList.length === 0" class="no-data">{{$t('common.noData')}}</p>
    </el-card>
  </div>
</template>

<script>
import {getArticleList} from 'api/hc'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      noticeList: []
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language: {
      handler: '_getArticleList',
      immediate: true
    }
  },
  methods: {
    _getArticleList() {
      getArticleList({tags: ['notice'], pageSize: 3, lang: this.language, pageType: 'outside'})
        .then(data => {
          this.noticeList = []
          data.data.forEach(item => {
            let obj = {}
            obj.id = item._id
            obj.title = item.title
            obj.center = 'notice'

            obj._id = item.tags[0]._id
            obj.lang = item.tags[0].lang

            this.noticeList.push(obj)
          })
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    handleToNotice(params) {
      this.$router.push(`/hc/articles/${params.id}?center=${params.center}&title=${params._id}&lang=${params.lang}`)
    },
  }
}
</script>

<style lang="scss" scoped>
  .el-card {
    height: 150px;
    overflow-y: auto;
    background-color: #daedf7;
    color: #31708f;
    .notice {
      cursor: pointer;
    }
    .no-data {
      text-align: center;
    }
  }
</style>
