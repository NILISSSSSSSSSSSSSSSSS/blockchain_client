<template>
  <footer class="g-footer">
    <div class="container-box">
      <div class="main">
        <div class="recommend">
          <h3 class="title">{{$store.state.common.siteName}}</h3>
          <p>{{ $t('footer.recommond', {siteName: $store.state.common.siteName}) }}</p>
        </div>
        <div class="list">
          <ul>
            <li class="title">{{ $t('footer.serve') }}</li>
            <router-link tag="li" to="/hc">{{ $t('hc.helpCenter') }}</router-link>
            <router-link tag="li" :to="'/hc/article/' + item.id"
              v-for="(item, index) in serviceList" :key="index">{{ item.title }}</router-link>
          </ul>
          <ul>
            <li class="title">{{ $t('footer.aboutUs') }}</li>
            <!-- <li><a href="https://doc-1256300176.cos.ap-hongkong.myqcloud.com/OTCEX.pdf"> {{ $t('footer.white') }} </a></li> -->
            <router-link tag="li" :to="'/hc/article/' + item.id"
              v-for="(item, index) in aboutList" :key="index">{{ item.title }}</router-link>
          </ul>
          <ul>
            <li class="title">{{ $t('footer.contact') }}</li>
            <li v-for="(item, index) in contact" :key="index">
              <a :href="item.url" target="_blank">
                <icon :name="item.icon"></icon> {{item.title}}
              </a>
            </li>

          </ul>
        </div>
      </div>
      <div class="copyright">
        <p>{{$t('footer.copyRight')}}</p>
      </div>
    </div>
  </footer>
</template>

<script>
import {getArticleList} from 'api/hc'
import {mapGetters} from 'vuex'
import {getContact} from 'api/hc'
export default {
  data() {
    return {
      serviceList: [],
      aboutList: [],
      contact: []
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language: {
      handler() {
        this._getArticleList(['service'], 3, 'serviceList')
        this._getArticleList(['about'], 4, 'aboutList')
      },
      immediate: true
    }
  },
  created() {
    this._getContact();
  },
  methods: {
    _getArticleList(tags, pageSize, str) {
      getArticleList({tags, pageSize, lang: this.language})
        .then(data => {
          this.normalize(data.data, str)
        }).catch(data => {
          this.$message.error(this.$t(`err.${data.code}`))
        })
    },
    normalize(arr, str) {
      this[str] = []
      arr.forEach(item => {
        let obj = {}
        obj.title = item.title
        obj.id = item._id
        for (let val of item.tags) {
          if (val._id === 'download') {
            this.$store.commit('setAppDownload', item._id)
          }
        }
        this[str].push(obj)
      })
    },
    _getContact() {
      getContact().then(data => {
        this.contact = data.data
      }).catch(data => {
        this.$message.error(this.$t(`err.${data.code}`))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/style/variable.scss';

  .g-footer {
    padding: 30px 15px;
    border-top: 1px solid rgba(151,151,151,0.25);
    background-color: #f5f5f5;
    .container-box .main {
      display: flex;
      justify-content: space-between;
    }
    .recommend, .list {
      color: #4a4a4a;
    }
    .recommend .title, .list .title {
      margin-bottom: $distance-x2;
    }
    .recommend {
      width: 45%;
      p {
        margin: 0;
        letter-spacing: 1px;
      }
      h3 {
        margin: 0;
      }
    }
    .list {
      display: flex;
      width: 45%;
      justify-content: space-around;
      .title {
        color: $color-text;
      }
      ul {
        li, a {
          padding: 2px 0;
          color: rgba(74,74,74,0.69);
          cursor: pointer;
        }
      }
    }
    .copyright {
      margin-top: $distance-x2;
      border-top: 1px solid rgba(151,151,151,0.25);
    }
  }
</style>
