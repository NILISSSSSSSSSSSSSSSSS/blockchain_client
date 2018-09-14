<template>
  <div>
    <div v-for="(item,index) in arr1" :key="index">{{item}}</div>
    <div v-for="(item,index) in arr2" :key="index">{{item}}</div>
    <button @click="set1()">点击1</button>
    <button @click="set2()">点击2</button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        arr1: [0],
        arr2: [1]
      }
    },
    methods: {
      set1: function(){
        this.arr1.push(0)
      },
      set2: function(){
        this.arr1.push(1)
      }
    }
  }
</script>
