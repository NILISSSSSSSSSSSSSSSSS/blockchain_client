<template>
  <div class="outside-buy">
    <div class="container-box clearfix">
      <div class="side">
        <steps></steps>
        <current-rate></current-rate>
      </div>
      <div class="main">
        <router-view :key="$route.fullpath"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from 'components/steps'
import CurrentRate from './current-rate'

export default {
  components: {
    Steps,
    CurrentRate
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/variable.scss';

  .outside-buy {
    background-color: #f8f9fa;
    .container-box {
      padding: 16px;
    }
    .side {
      float: left;
      width: 240px;
      &>div {
        margin-bottom: $distance-x3;
      }
    }
    .main {
      margin-left: 272px;
    }
    @media screen and (max-width: 820px) {
      .side {
        width: 200px;
      }
      .main {
        margin-left: 222px;
      }
    }
  }
</style>
