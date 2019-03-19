<template>
  <div class="lite">
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="header">
        <span>公文列表</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew" v-if="status == 'draft'">起草公文</el-button>
      </div>
      <data-grid
        :data="items"
        :meta="fields"
        :operation="listOper"
        :paging="true"
        :total="total"
        @query="handleQuery"
        @preview="handlePreview"
        @finish="handleFinish"
        @feedback="handleFeedback"
        @remind="handleRemind"
      >
        <template slot="list-ext">
          <el-table-column width="48" label="..." align="center">
            <div slot-scope="scope">
              <el-tooltip content="包含附件" class="icon" v-if="scope.row.attachment &amp;&amp; scope.row.attachment.length &gt; 0">
                <span><i class="naf-icons naf-icon-attachment"></i></span>
              </el-tooltip>
              <el-tooltip content="需要回执" class="icon" v-if="scope.row.feedback &amp;&amp; scope.row.feedback.required">
                <span><i class="naf-icons naf-icon-receipt"></i></span>
              </el-tooltip>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="文号" prop="docno" show-overflow-tooltip />
        <el-table-column label="标题" prop="title" show-overflow-tooltip />
        <el-table-column label="收文单位" prop="receiver" :formatter="receiverLabel" show-overflow-tooltip />
        <el-table-column label="收办状态" prop="status" :formatter="statusLabel">
          <template slot-scope="{ row }">
            <span v-if="row.status == 'post'">
              <el-button type="text" @click="handleDetails(row)" size="mini">{{ statusLabel(row) }}</el-button>
            </span>
            <span v-else>{{ statusLabel(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发文用户" prop="meta.createdBy" show-overflow-tooltip />
        <el-table-column label="发文时间" prop="meta.postedAt" :formatter="date('YYYY-MM-DD HH:mm')" show-overflow-tooltip />
        <el-table-column label="有效期" prop="meta.expiredAt" :formatter="date('YYYY-MM-DD')" show-overflow-tooltip />
      </data-grid>
    </el-card>
    <el-card class="right list" size="mini" v-else-if="view == 'details'">
      <template slot="header">
        <div class="action">
          <el-button icon="el-icon-arrow-left" type="text" @click="view = 'list'">返回</el-button>
        </div>
        <div class="title">接收明细 -《{{ current.title }}》</div>
      </template>
      <post-list></post-list>
    </el-card>
    <el-card class="right list" size="mini" v-else-if="view == 'feedback'">
      <template slot="header">
        <div class="action">
          <el-button icon="el-icon-arrow-left" type="text" @click="view = 'list'">返回</el-button>
        </div>
        <div class="title">公文回执 -《{{ current.title }}》</div>
      </template>
      <feedback-list></feedback-list>
    </el-card>
    <el-card class="right details" size="mini" v-else>
      <div slot="header" class="header">
        <span>公文预览</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <doc-view :data="current" />
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash';
import moment from 'moment';
import DataGrid from '@naf/data/filter-grid';
import PostList from '@/components/outbox/post-list';
import FeedbackList from '@/components/outbox/feedback';
import { formatters } from '@naf/data/meta-util';
import * as types from '@/store/.mutation';
import DocView from '@/components/doc-view';
import { createNamespacedHelpers } from 'vuex';
import config from '@frame/config';
const { pageSize = 10 } = config;

const { mapState, mapActions, mapMutations } = createNamespacedHelpers('outbox');
const { mapActions: dictActions } = createNamespacedHelpers('naf/dict');

export default {
  components: {
    DataGrid,
    DocView,
    PostList,
    FeedbackList,
  },
  metaInfo: {
    title: '发文',
  },
  async mounted() {
    await this.loadDict('unit');
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
      oper_work: [['preview', '预览', 'el-icon-view'], ['remind', '催办全部', 'el-icon-bell', true], ['finish', '办结', 'el-icon-circle-check-outline', true]],
      oper_done: [['preview', '预览', 'el-icon-view']],
      oper_arch: [['preview', '预览', 'el-icon-view']],
      oper_feedback: [['preview', '预览', 'el-icon-view'], ['feedback', '查看回执', 'el-icon-edit-outline']],
    };
  },
  methods: {
    ...mapActions(['query', 'fetch', 'finish', 'remind']),
    ...mapMutations({
      selectDoc: types.SELECTED,
    }),
    ...dictActions({
      loadDict: 'load',
    }),
    async handlePreview({ id }) {
      const res = await this.fetch({ id });
      this.$checkRes(res, () => {
        this.view = 'preview';
      });
    },
    async handleDetails(payload) {
      this.selectDoc(payload);
      this.view = 'details';
    },
    async handleFinish({ id }) {
      const res = await this.finish({ id });
      this.$checkRes(res, '办结公文成功');
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
    async handleFeedback(payload) {
      this.selectDoc(payload);
      this.view = 'feedback';
    },
    statusLabel: row => {
      const doneCount = row && row.posts && row.posts.filter(p => p.status === 'done').length;
      const postCount = row && row.posts && row.posts.length;
      switch (row.status) {
        case 'draft':
          return '草稿';
        case 'post':
          return `已发(${doneCount}/${postCount})`;
        case 'done':
          return '办结';
        case 'archive':
          return '归档';
        default:
          return row.status;
      }
    },
    receiverLabel: (row, column, cellValue, index) => {
      if (cellValue && cellValue.includes('all')) {
        return '全部';
      }
      return cellValue && cellValue.join(',');
    },
    date(param) {
      return formatters.date(param);
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
      } else if (this.status === 'feedback') {
        return this.oper_feedback;
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
@import '~@lib/style/lite.less';
</style>
