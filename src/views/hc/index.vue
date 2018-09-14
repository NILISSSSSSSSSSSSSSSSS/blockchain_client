<template>
  <div class="hc">
    <!--<div class="section-1" :style="{backgroundImage: `url(${require('../../assets/image/bg-index.png')})`}">
      <el-input :placeholder="$t('common.search')" v-model="search" class="input-with-select">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix">
        </i>
      </el-input>
    </div>-->
    <div class="body">
      <div class="container-box">
        <!--<div class="center">
          <div class="notice">
            <el-button type="success" plain>公告中心</el-button>
          </div>
          <div class="help">
            <el-button type="success" plain>帮助中心</el-button>
          </div>
        </div>-->
        <div class="notice-center">
          <h2 class="title">{{$t('hc.noticeCenter')}}</h2>
          <div v-if="noticeArr.length > 0" class="list-container">
            <help-list v-for="(item, index) in noticeArr"
              :key="index" :lang="item.lang"
              :title="item.title" :id="item.id" center="notice"></help-list>
          </div>
          <div v-else class="no-data">
            <h2>{{ $t('common.noData') }}</h2>
          </div>
        </div>
        <div class="help-center">
          <h2 class="title">{{$t('hc.helpCenter')}}</h2>
          <div v-if="helpArr.length > 0" class="list-container">
            <help-list v-for="(item, index) in helpArr"
              :key="index" :len="item.list.length"
              :lang="item.lang" :title="item.title" :list="item.list.slice(0, 6)" center="help"></help-list>
          </div>
          <div v-else class="no-data">
            <h2>{{ $t('common.noData') }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HelpList from './components/helpList'
import { getArticleList } from 'api/hc'
import { mapGetters } from 'vuex'

export default {
  components: {
    HelpList
  },
  data() {
    return {
      search: '',
      helpArr: [],
      noticeArr: [],
      info: []
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language: {
      handler (val) {
        this._getArticleList(val)
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    _getArticleList(language='cn') {
      // 存放一级标题下的2级标题
      let helpTitle = []
      let noticeTitle = []
      // 存放一级标题下的所有数据
      let help = []
      let notice = []
      getArticleList({lang: language, tags: ['help']}).then(data => {
        data.data.forEach(item => {
          item.tags.forEach(tag => {
            if (tag._id !== 'help' && helpTitle.indexOf(tag._id) === -1) {
              helpTitle.push(tag._id)
            }
          })
          help.push(item)
        })
        this.normalize(helpTitle, help, 'helpArr')
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
      getArticleList({lang: language, tags: ['notice']}).then(data => {
        this.noticeArr = []
        data.data.forEach(item => {
          this.noticeArr.push({
            title: item.title,
            id: item._id,
            lang: item.tags[0].lang
          })
        })
        //this.normalize(noticeTitle, notice, 'noticeArr')
      }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    // 将数据序列化为需要的数据结构
    normalize(titleArr, dataArr, arr) {
      this[arr] = []
      titleArr.forEach(item => {
        let obj = {}
        obj.title = item
        obj.list = []
        dataArr.forEach(x => {
          for (let j of x.tags) {
            if (j._id === item) {
              obj.lang = j.lang
              let o = {}
              o.id = x._id
              o.title = x.title
              obj.list.push(o)
            }
          }
        })
        this[arr].push(obj)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .hc {
    .section-1 {
      padding: 64px 0;
      text-align: center;
      background-position: center;
      .el-input {
        width: 36%;
        min-width: 300px;
        border-radius: 30px;
      }
    }
    .body {
      padding: 24px 0;
      background-color: #fff;
      .center {
        display: flex;
        justify-content: space-between;
        & > div {
          width: 48%;
        }
        .el-button {
          width: 100%;
          padding: 28px 0;
          font-size: 16px;
        }
      }
      .help-center, .notice-center {
        .title {
          margin-top: 48px;
          text-align: center;
        }
      }
      .list-container {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .no-data {
      padding: 32px;
      text-align: center;
      color: #aaa;
    }
  }
</style>
