<template>
  <section class="main">
    <h1 class="title">{{data.title}}</h1>
    <div class="content" v-html="data.content"></div>
  </section>
</template>
<script>
export default {
  name: 'doc-content',
  props: {
    data: { type: Object, required: true },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding: 10 20px;
  .title {
    text-align: center;
    font-size: 1.5em;
    padding: 10px 20px;
  }
  .content {
    margin-top: 20px;
    text-indent: 2em;
  }
}
</style>
