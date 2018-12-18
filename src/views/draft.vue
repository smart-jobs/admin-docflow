<template>
  <div class="lite">
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>公文列表</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew" v-if="status == 'draft'">起草公文</el-button>
      </div>
      <data-grid :data="items" :meta="listFields" :operation="listOper" :paging="true" :total="total" @edit="handleEdit"
                 @delete="handleDelete" @post="handlePost" @query="handleQuery" @preview="handlePreview">
        <template slot="list-ext">
          <el-table-column width="36" label="..." header-align="center">
            <span slot-scope="scope">
              <i class="naf-icons naf-icon-attachment" v-if="scope.row.attachment &amp;&amp; scope.row.attachment.length &gt; 0"></i>
            </span>
          </el-table-column>
        </template>
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else-if="view == 'form'">
      <div slot="header" class="clearfix">
        <span>{{form.isNew?'起草公文':'修改公文'}}</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <el-scrollbar>
        <draft-form :data="form.data" :is-new="form.isNew" @save="handleSave" @cancel="view = 'list'">
        </draft-form>
      </el-scrollbar>
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
import DraftForm from '@/components/draft/draft-form';
import DocView from '@/components/doc-view';
import { createNamespacedHelpers } from 'vuex';
import config from '@frame/config';
const { pageSize = 10 } = config;

const { mapState, mapActions } = createNamespacedHelpers('draft');

export default {
  components: {
    DraftForm,
    DataGrid,
    DocView,
  },
  mounted() {
    this.handleQuery();
  },
  data() {
    return {
      view: 'list',
      form: {},
      fields: [
        { name: 'docno', label: '文号' },
        { name: 'title', label: '标题' },
        { name: 'receiver', label: '收文单位', formatter: this.receiverLabel },
        { name: 'feedback.required', label: '是否回执', formatter: 'bool' },
        { name: 'status', label: '公文状态', formatter: this.statusLabel },
        { name: 'meta.createdAt', label: '创建时间', formatter: ['date', 'YYYY-MM-DD HH:mm'] },
        { name: 'meta.postedAt', label: '发文时间', formatter: ['date', 'YYYY-MM-DD HH:mm'] },
        { name: 'meta.expiredAt', label: '有效期', formatter: 'date:YYYY-MM-DD' },
      ],
      oper_edit: [
        ['preview', '预览', 'el-icon-view'],
        ['edit', '编辑', 'el-icon-edit'],
        ['delete', '删除', 'el-icon-delete', true],
        ['post', '递送', 'el-icon-share', true],
      ] /* 操作类型 */,
      oper_view: [['preview', '预览', 'el-icon-view']] /* 操作类型 */,
    };
  },
  methods: {
    ...mapActions(['query', 'create', 'delete', 'update', 'fetch', 'post']),
    async handleEdit({ id }) {
      const res = await this.fetch({ id });
      this.$checkRes(res, () => {
        this.form = { data: { ...res.data }, isNew: false };
        this.view = 'form';
      });
    },
    async handlePreview({ id }) {
      const res = await this.fetch({ id });
      this.$checkRes(res, () => {
        this.view = 'preview';
      });
    },
    handleNew() {
      const expiredAt = moment()
        .add(1, 'months')
        .toDate();
      this.form = { data: { feedback: { required: false }, meta: { expiredAt } }, isNew: true };
      this.view = 'form';
    },
    async handleSave(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.create(payload);
        msg = '信息添加成功';
      } else {
        const { id } = payload.data;
        res = await this.update({ id, ...payload });
        msg = '信息修改成功';
      }
      if (this.$checkRes(res, msg)) {
        this.view = 'list';
      }
    },
    async handleDelete({ id }) {
      const res = await this.delete({ id });
      this.$checkRes(res, '删除数据成功');
    },
    async handlePost({ id }) {
      this.view = 'list';
      const res = await this.post({ id });
      this.$checkRes(res, '递送公文成功');
    },
    async handleQuery({ filter, paging } = {}) {
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
      return this.$route.params.status || 'draft';
    },
    listFields() {
      return this.status === 'draft' ? this.fields : this.fields.filter(item => item.name !== 'status');
    },
    listOper() {
      return this.status === 'draft' ? this.oper_edit : this.oper_view;
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
