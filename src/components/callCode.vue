<template>
  <div style="width: 100px">
    <el-select v-model="code" placeholder="请选择地区" >
    <el-option
      v-for="(item,index) in data"
      :key="index"
      :label="item.code + ' +' + item.callingCode"
      :value="item.callingCode">
      <span style="float: left">{{ item.name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.callingCode }}</span>
    </el-option>
    </el-select>
  </div>
</template>

<script>
const publicIp = require('public-ip');
import data from '@/api/code.json'
import {region} from '@/api/user'
export default {
  name: 'callCode',
  props:["currentindex"],
  data() {
    return {
      data: data,
      code: ''
    }
  },
  watch: {
    code(value) {
      console.log('zzz')
      this.$emit('callCode',value);//只传值
      this.$emit('callCodeZuanZhang',{"val":value,"suoYin":this.currentindex});//传值又传索引，这个是针对于站内转账里面的
    }
  },
  methods: {
    getIp() {
      publicIp.v4().then(ip => {
        console.log(ip);
        let data = {
          address: ip
        }
        this.getCurrentRegion(data)
      });
    },
    getCurrentRegion(data) {
      region(data).then(data=>{
        let country = data.data.country;
        this.data.map((item,index) => {
          if(item.code === country){
            this.code = this.data[index].callingCode
          }
        })
        
      }).catch(err=>{
        if (err.code) {
          this.$message.error(this.$t("err." + err.code));
        } else {
          this.$message.error(this.$t("err.undefined"));
        }
      })
    }
  },
  created() {
    this.getIp();
  }
}
</script>
