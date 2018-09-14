<template>
  <layout>
    <div slot="head" class="header container-box">
      <deal-bread :currentNav="$t('dealCenter.orders.my')"></deal-bread>
      <filters class="filters"></filters>
    </div>
    <div slot="body" class="container-box">
      <order-list></order-list>
    </div>
  </layout>
</template>

<script>
import Filters from './filter'
import OrderList from '../components/orderList'
import DealBread from '../components/dealBread'

export default {
  components: {
    Filters,
    OrderList,
    DealBread
  }
}
</script>

<style lang="scss" scoped>
  .header {
    .present {
      color: #777;
    }
    .filters {
      margin-top: 40px;
    }
  }
</style>
