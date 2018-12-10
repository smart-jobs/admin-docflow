<template>
  <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
             :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="limit" :on-exceed="handleExceed"
             :file-list="fileList">
    <el-button size="mini" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">文件大小不能超过5MB</div>
  </el-upload>
</template>
<script>
export default {
  name: 'file-upload',
  model: {
    prop: 'value',
    event: 'change', // 默认为input时间，此处改为change
  },
  props: {
    value: { type: Array, required: false, default: () => [] },
    limit: { type: Number, required: false, default: 3 },
  },
  data() {
    return {
      fileList: this.value,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.$emit('change', fileList);
    },
  },
};
</script>
