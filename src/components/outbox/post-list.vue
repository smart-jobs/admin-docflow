<template>
  <div style="padding: 10px 20px;">
    <data-grid :data="subitems" :meta="fields" :operation="operation" @remind="handleRemind">
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
      this.queryPosts({ docid });
    }
  },
  data() {
    return {
      view: 'list',
      showForm: false,
      form: {},
      fields: [
        { name: 'unit', label: '单位', required: true, formatter: 'dict:unit' },
        { name: 'status', label: '收办状态', required: true, formatter: this.statusLabel },
        { name: 'meta.updatedBy', label: '处理用户' },
        { name: 'meta.updatedAt', label: '处理时间', formatter: ['date', 'YYYY-MM-DD HH:mm'] },
      ],
      operation: [['remind', '催办', 'el-icon-bell', true]],
    };
  },
  methods: {
    ...mapActions(['queryPosts', 'remind']),
    async handleRemind({ docid, unit }) {
      const res = await this.remind({ docid, unit });
      this.$checkRes(res, '催办公文成功');
    },
    statusLabel: (row, column, cellValue, index) => {
      switch (cellValue) {
        case 'new':
          return '未读';
        case 'read':
          return '在办';
        case 'done':
          return '已办';
        default:
          return cellValue;
      }
    },
  },
  computed: {
    ...mapState(['current', 'subitems']),
  },
};
</script>
