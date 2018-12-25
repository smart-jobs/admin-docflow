<template>
  <div style="padding: 10px 20px;">
    <el-button icon="el-icon-download" size="mini" type="primary" style="margin-bottom: 10px; width: 100px;">导出</el-button>
    <data-grid size="mini" :data="items" :meta="[]">
      <el-table-column v-for="(field,index) in fields" :key="index" :prop="field" :label="field"></el-table-column>
      <template slot="oper">
        <span>no operation</span>
      </template>
    </data-grid>
  </div>
</template>
<script>
import DataGrid from '@naf/data/lite-grid';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('outbox');

export default {
  components: {
    DataGrid,
  },
  mounted() {
    if (this.current) {
      const { id: docid } = this.current;
      this.queryFeedback({ docid });
    }
  },
  methods: {
    ...mapActions(['queryFeedback']),
    async handleExport() {
      console.log('export feedback');
    },
  },
  computed: {
    ...mapState(['current', 'subitems']),
    fields() {
      const { fields = [] } = this.current.feedback;
      return [...fields, '所在学校'];
    },
    items() {
      return this.subitems.map(r =>
        this.fields.reduce((p, c, i) => {
          p[c] = r[i];
          return p;
        }, {})
      );
    },
  },
};
</script>
<style lang="less" scoped>
.el-button {
  margin: 10px 20px;
}
</style>
