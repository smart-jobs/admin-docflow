<template>
  <article class="file">
    <doc-header :data="data"></doc-header>
    <doc-content :data="data"></doc-content>
    <doc-attachment :data="data.attachment"></doc-attachment>
  </article>
</template>
<script>
import DocHeader from './header';
import DocAttachment from './attachment';
import DocContent from './content';

export default {
  components: {
    DocHeader,
    DocAttachment,
    DocContent,
  },
  name: 'doc-view',
  props: {
    data: { type: Object, required: true },
  },
};
</script>
