<template>
  <section class="header">
    <h1 class="title">吉林省高等学校毕业生就业指导中心文件</h1>
    <p class="desc">{{ data.docno }}</p>
    <hr />
  </section>
</template>
<script>
export default {
  name: 'doc-view',
  props: {
    data: { type: Object, required: true },
  },
};
</script>
<style lang="less" scoped>
.header {
  text-align: center;
  padding: 10px 20px;
  .title {
    font-size: 2em;
    color: red;
    padding: 1em;
  }
  .desc {
    color: gray;
    padding: 10px 20px;
  }
  hr {
    color: red;
    border-bottom: 4px solid #ff0000;
  }
}
</style>
