<template>
  <div class="ui">
    <h2>vant的按钮</h2>
    <van-button type="primary">vant的按钮</van-button>
    <br/>
    <br/>
    <h2>ant design 的输入框</h2>
    <a-input placeholder="ant design 的输入框" style="width:500px;"/>
    <br/>
    <br/>
    <h2>element的计数器</h2>
    <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="element的计数器"></el-input-number>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Button } from 'vant';
  import { Input } from 'ant-design-vue';
  import { InputNumber } from 'element-ui';

  Vue.use(Button).use(Input).use(InputNumber);
  export default {
    name: 'ui',
    data (){
      return {
        num1: 1
      };
    },
    methods: {
      handleChange (value){
        console.log(value);
      }
    }
  };
</script>

<style scoped>

</style>