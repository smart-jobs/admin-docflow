<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
    <slot>
      <el-form-item label="文号" prop="docno" :required="true">
        <el-input v-model="form.docno"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title" :required="true">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="发文单位" prop="sender" :required="true">
        <el-input v-model="form.sender"></el-input>
      </el-form-item>
      <el-form-item label="接收单位" prop="receiver" :required="true" error="请选择接收单位">
        <el-select v-model="form.receiver" placeholder="请选择" multiple style="width: 100%;" @change="handleReceiver">
          <el-option label="（全部）" value="all">
          </el-option>
          <el-option-group label="单位列表">
            <el-option v-for="item in units" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content" :required="true">
        <editor v-model="form.content"></editor>
      </el-form-item>
      <el-form-item label="附件" prop="attachment">
        <file-upload v-model="form.attachment"></file-upload>
      </el-form-item>
      <el-form-item label="是否回执" prop="feedback.required">
        <el-checkbox v-model="form.feedback.required"></el-checkbox>
      </el-form-item>
      <el-form-item label="回执字段" prop="feedback.fields" :required="form.feedback.required" v-if="form.feedback.required">
        <tags v-model="form.feedback.fields" add-text="添加回执字段"></tags>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleSave" size="mini">保存草稿</el-button>
        <el-button type="primary" @click="handleSave" size="mini">立即递送</el-button>
      </el-form-item>
    </slot>
  </el-form>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import Editor from './editor';
import FileUpload from './file-upload';
import Tags from './tags';

const requiredAndMaxlen = (name, len = 0) => {
  const rules = [{ required: true, message: `${name}不能为空`, trigger: 'blur' }];
  if (len > 0) rules.push({ max: len, message: `长度不能大于${len}个字符`, trigger: 'blur' });
  return rules;
};

const { mapActions } = createNamespacedHelpers('naf/dict');

export default {
  components: {
    Editor,
    FileUpload,
    Tags,
  },
  name: 'draft-form',
  props: {
    data: { type: Object, required: true },
    isNew: { type: Boolean, default: false } /* 是否新创建 */,
  },
  data() {
    return {
      form: { ...this.data },
      rules: {
        docno: requiredAndMaxlen('文号', 20),
        title: requiredAndMaxlen('标题', 20),
        sender: requiredAndMaxlen('发文单位', 20),
        receiver: { type: 'array', required: true, min: 1, message: '请选择接收单位', trigger: 'blur' },
        content: requiredAndMaxlen('内容', 102400),
      },
      units: [],
    };
  },
  async mounted() {
    this.units = await this.load('unit');
  },
  methods: {
    ...mapActions(['load']),
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('save', { isNew: this.isNew, data: this.form });
        } else {
          console.warn('form validate error!!!');
        }
      });
    },
    handleReceiver(value) {
      if (value.includes('all')) {
        if (value[0] === 'all' && value.length > 1) {
          this.form.receiver.shift();
        } else {
          this.form.receiver = ['all'];
        }
      }
      console.log('receiver:', this.form.receiver);
    },
  },
};
</script>
<style lang="less" scoped>
.el-form-item {
  width: 700px;
}
</style>
