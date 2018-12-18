<template>
  <div class="lite">
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>公文列表</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew" v-if="status == 'draft'">起草公文</el-button>
      </div>
      <data-grid :data="items" :meta="fields" :operation="listOper" :paging="true" :total="total" @query="handleQuery"
                 @preview="handlePreview" @feecback="handleFeecback">
        <template slot="list-ext">
          <el-table-column width="48" label="..." align="center">
            <div slot-scope="scope">
              <el-tooltip content="包含附件" class="icon">
                <span><i class="naf-icons naf-icon-attachment" v-if="scope.row.info.attachment"></i></span>
              </el-tooltip>
              <el-tooltip content="需要回执" class="icon">
                <span><i class="naf-icons naf-icon-receipt" v-if="scope.row.info.feedback"></i></span>
              </el-tooltip>
            </div>
          </el-table-column>
        </template>
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else>
      <div slot="header" class="clearfix">
        <span>公文详情</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <el-scrollbar>
        <doc-view :data="current.doc" />
      </el-scrollbar>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash';
import moment from 'moment';
import DataGrid from '@naf/data/filter-grid';
import DocView from '@/components/doc-view';
import { createNamespacedHelpers } from 'vuex';
import config from '@frame/config';
const { pageSize = 10 } = config;

const { mapState, mapActions } = createNamespacedHelpers('inbox');

export default {
  components: {
    DataGrid,
    DocView,
  },
  mounted() {
    this.handleQuery();
  },
  data() {
    return {
      view: 'list',
      fields: [
        { name: 'info.docno', label: '文号' },
        { name: 'info.title', label: '标题' },
        { name: 'status', label: '处理状态', formatter: this.statusLabel },
        { name: 'meta.createdAt', label: '发文时间', formatter: ['date', 'YYYY-MM-DD HH:mm'] },
      ],
      oper_work: [['preview', '查看', 'el-icon-view'], ['feedback', '回执', 'el-icon-edit-outline', true]],
      oper_done: [['preview', '查看', 'el-icon-view']],
    };
  },
  methods: {
    ...mapActions(['query', 'fetch', 'feecback']),
    async handlePreview({ docid }) {
      const res = await this.fetch({ docid });
      this.$checkRes(res, () => {
        this.view = 'preview';
      });
    },
    async handleFeecback({ docid }) {
      const res = await this.feedback({ docid });
      this.$checkRes(res, '办结公文成功');
    },
    async handleQuery({ filter, paging } = {}) {
      this.view = 'list';
      const res = await this.query({ status: this.status, paging });
      this.$checkRes(res);
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
    receiverLabel: (row, column, cellValue, index) => {
      return cellValue && cellValue.join(',');
    },
  },
  computed: {
    ...mapState(['items', 'current', 'total']),
    status() {
      return this.$route.params.status || 'new';
    },
    listOper() {
      if (this.status === 'done') {
        return this.oper_done;
      }
      return this.oper_work;
    },
  },
  watch: {
    // call again the method if the route changes
    status: 'handleQuery',
  },
};
</script>
<style lang="less" scoped>
@import '~@/style/lite.less';
</style>
