<template>
  <div class="goods">
    <h1>Goods List</h1>

    <h2>List Data</h2>
    <div v-for="(v, i) in list" :key="i">{{ i }}, {{ v }}</div>
  </div>
</template>

<script>
export default {
  name: 'GoodsIndex',
  data() {
    return {
      list: [],
    };
  },
  async mounted() {
    const { data: res } = await this.$request.get('/goodses');
    console.log(res);
    this.list = res.data;
  },
};
</script>
