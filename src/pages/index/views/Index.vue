<template>
  <div>
    <h1>首页</h1>

    <input type="file" class="upfile" webkitdirectory @change="getFile"/>
  </div>
</template>

<script>
  export default {
    name: 'index',
    methods: {
      getFile (e){
        console.log('getFile', e);
      }
    }
  };
</script>

<style scoped>

</style>