<template>
  <div class="lite">
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>公文列表</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew" v-if="status == 'draft'">起草公文</el-button>
      </div>
      <data-grid :data="items" :meta="fields" :operation="listOper" :paging="true" :total="total" @query="handleQuery"
                 @preview="handlePreview" @finish="handleFinish" @archive="handleArchive">
        <template slot="list-ext">
          <el-table-column width="48" label="..." align="center">
            <div slot-scope="scope">
              <el-tooltip content="包含附件" class="icon">
                <span><i class="naf-icons naf-icon-attachment" v-if="scope.row.attachment &amp;&amp; scope.row.attachment.length &gt; 0"></i></span>
              </el-tooltip>
              <el-tooltip content="需要回执" class="icon">
                <span><i class="naf-icons naf-icon-receipt" v-if="scope.row.feedback &amp;&amp; scope.row.feedback.required"></i></span>
              </el-tooltip>
            </div>
          </el-table-column>
        </template>
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else>
      <div slot="header" class="clearfix">
        <span>公文预览</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <el-scrollbar>
        <doc-view :data="current" />
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

const { mapState, mapActions } = createNamespacedHelpers('outbox');

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
        { name: 'docno', label: '文号' },
        { name: 'title', label: '标题' },
        { name: 'receiver', label: '收文单位', formatter: this.receiverLabel },
        { name: 'status', label: '公文状态', formatter: this.statusLabel },
        { name: 'meta.createdBy', label: '发文用户' },
        { name: 'meta.postedAt', label: '发文时间', formatter: ['date', 'YYYY-MM-DD HH:mm'] },
        { name: 'meta.expiredAt', label: '有效期', formatter: 'date:YYYY-MM-DD' },
      ],
      oper_work: [['preview', '预览', 'el-icon-view'], ['remind', '催办', 'el-icon-bell', true], ['finish', '办结', 'el-icon-circle-check-outline', true]],
      oper_done: [['preview', '预览', 'el-icon-view'], ['archive', '归档', 'el-icon-document', true]],
      oper_arch: [['preview', '预览', 'el-icon-view']],
    };
  },
  methods: {
    ...mapActions(['query', 'fetch', 'finish', 'archive', 'remind']),
    async handlePreview({ id }) {
      const res = await this.fetch({ id });
      this.$checkRes(res, () => {
        this.view = 'preview';
      });
    },
    async handleFinish({ id }) {
      const res = await this.finish({ id });
      this.$checkRes(res, '办结公文成功');
    },
    async handleArchive({ id }) {
      const res = await this.archive({ id });
      this.$checkRes(res, '归档公文成功');
    },
    async handleRemind({ id }) {
      const res = await this.remind({ id });
      this.$checkRes(res, '催办公文成功');
    },
    async handleQuery({ filter, paging } = {}) {
      this.view = 'list';
      const res = await this.query({ status: this.status, paging });
      this.$checkRes(res);
    },
    statusLabel: (row, column, cellValue, index) => {
      switch (cellValue) {
        case 'draft':
          return '草稿';
        case 'post':
          return '已发';
        case 'done':
          return '办结';
        case 'archive':
          return '归档';
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
      return this.$route.params.status || 'post';
    },
    listOper() {
      if (this.status === 'post') {
        return this.oper_work;
      } else if (this.status === 'done') {
        return this.oper_done;
      }
      return this.oper_arch;
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
