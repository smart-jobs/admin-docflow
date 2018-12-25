<template>
  <div style="padding: 10px 20px;">
    <data-grid size="mini" :data="items" :meta="[]" :operation="operation" @delete="handleDelete">
      <el-table-column v-for="(field,index) in fields" :key="index" :prop="field" :label="field"></el-table-column>
    </data-grid>
    <div class="weui-loadmore weui-loadmore_line">
      <span class="weui-loadmore__tips">添加回执</span>
    </div>
    <el-form ref="form" :model="form" size="mini" label-width="100px">
      <el-form-item v-for="(field,index) in fields" :key="index" :label="field" :required="true">
        <el-input v-model="form[index]"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset" size="mini">重置</el-button>
        <el-button type="primary" @click="handleSave" size="mini">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import DataGrid from '@naf/data/lite-grid';

export default {
  components: {
    DataGrid,
  },
  props: {
    fields: { type: Array, required: true },
    data: { type: Array, required: true },
  },
  data() {
    return {
      view: 'list',
      showForm: false,
      form: {},
      operation: [['delete', '删除', 'el-icon-delete', true]],
    };
  },
  methods: {
    handleDelete({ docid }, index) {
      console.log('handleDelete:', index);
      this.data.splice(index, 1);
    },
    handleSave() {
      const values = this.fields.map((p, i) => this.form[i]);
      const invalid = this.fields.some((p, i) => !values[i]);
      if (!invalid) {
        const newData = [...this.data, values];
        this.$emit('change', newData);
        this.handleReset();
      } else {
        console.warn('form validate error!!!');
      }
    },
    handleReset() {
      this.form = {};
    },
  },
  computed: {
    items() {
      return this.data.map(r =>
        this.fields.reduce((p, c, i) => {
          p[c] = r[i];
          return p;
        }, {})
      );
    },
  },
};
</script>
