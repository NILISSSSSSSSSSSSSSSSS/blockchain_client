<template>
  <div class="help-list">
    <div v-if="center === 'help'">
      <h3 class="title">{{ lang }}</h3>
      <ul>
        <li class="message" v-for="(item, index) in list" :key="index">
          <router-link :to="'/hc/articles/' + item.id + '?title=' + title + '&lang=' + lang + '&center=' + center">{{item.title}}</router-link>
        </li>
        <li v-if="len > list.length">
          <router-link class="more" :to="'/hc/more?center=' + center + '&lang=' + lang + '&title=' + title">{{$t('common.more')}}</router-link>
        </li>
      </ul>
    </div>
    <div v-else class="notice-box">
      <router-link tag="div" :to="'/hc/articles/' + id + '?title=notice&lang=' + title + '&center=' + center" class="notice">{{title}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: '',
    list: '',
    lang: '',
    center: '',
    len: null,
    id: ''
  },
  data() {
    return {
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/style/variable.scss';

  .help-list {
    flex: 0 0 33.3333333%;
    max-width: 33.3333333%;
    overflow: hidden;
    padding: 0 20px;
    margin-bottom: 10px;

    .title {
      border-bottom: 1px solid #ddd;
      font-size: 16px;
      padding: 15px 0 5px;
      margin-bottom: 10px;
    }
    .message {
      border-bottom: none;
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0;
      &:hover {
        text-decoration: underline;
      }
    }
    .more {
      color: $color-theme;
    }
    .notice-box {
      text-align: center;
      border-bottom: 1px solid #ddd;
    }
    .notice {
      font-size: 16px;
      padding: 18px 0;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
