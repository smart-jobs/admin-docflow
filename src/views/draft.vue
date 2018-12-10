<template>
  <div class="lite">
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>我的公文</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew">起草公文</el-button>
      </div>
      <data-grid :data="items" :meta="fields" :operation="operation" @edit="handleEdit" @delete="handleDelete">
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else>
      <div slot="header" class="clearfix">
        <span>{{form.isNew?'起草公文':'修改公文'}}</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <el-scrollbar>
        <draft-form :data="form.data" :is-new="form.isNew" @save="handleSave" @cancel="view = 'list'">
        </draft-form>
      </el-scrollbar>
    </el-card>
  </div>
</template>
<script>
import DataGrid from '@naf/data/filter-grid';
import DraftForm from '@/components/draft-form';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('docflow');

export default {
  components: {
    DraftForm,
    DataGrid,
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      view: 'list',
      showForm: false,
      form: {},
      passwdForm: {},
      fields: [
        { name: 'docNo', label: '文号', required: true },
        { name: 'title', label: '标题', required: true },
        { name: 'content', label: '内容' },
        { name: 'hasReceipt', label: '是否回执' },
        { name: 'createUser', label: '发文用户' },
        { name: 'createDate', label: '创建时间' },
        { name: 'status', label: '公文状态' },
        // { name: 'receiveUnit', label: '接收单位' },
        // { name: 'attachment', label: '附件' },
        // { name: 'receiptFields', label: '回执字段' },
      ],
      operation: [['edit', '编辑', 'el-icon-edit'], ['delete', '删除', 'el-icon-delete', true][('post', '递送', 'el-icon-share', true)]] /* 操作类型 */,
    };
  },
  methods: {
    ...mapActions(['load', 'create', 'delete', 'update']),
    handleEdit(data) {
      this.form = { data, isNew: false };
      this.view = 'form';
    },
    handleNew() {
      this.form = { data: { feedback: { required: false } }, isNew: true };
      this.view = 'form';
    },
    async handleSave(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.create(payload.data);
        msg = '标签添加成功';
      } else {
        res = await this.update(payload.data);
        msg = '标签修改成功';
      }
      if (this.$checkRes(res, msg)) {
        this.view = 'list';
      }
    },
    async handleDelete(data) {
      const res = await this.delete(data);
      this.$checkRes(res, '删除数据成功');
    },
  },
  computed: {
    ...mapState(['items']),
  },
};
</script>
<style lang="less" scoped>
@import '~@/style/lite.less';
</style>
