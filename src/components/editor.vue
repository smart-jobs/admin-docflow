<template>
  <div ref="editor" style="text-align:left">
  </div>
</template>
<script>
import E from 'wangeditor';

const menus = [
  'head', // 标题
  'bold', // 粗体
  'fontSize', // 字号
  'fontName', // 字体
  'italic', // 斜体
  'underline', // 下划线
  'strikeThrough', // 删除线
  'foreColor', // 文字颜色
  'backColor', // 背景颜色
  'link', // 插入链接
  'list', // 列表
  'justify', // 对齐方式
  'quote', // 引用
  // 'emoticon', // 表情
  'image', // 插入图片
  'table', // 表格
  // 'video', // 插入视频
  // 'code', // 插入代码
  'undo', // 撤销
  'redo', // 重复
];

export default {
  name: 'editor',
  model: {
    prop: 'value',
    event: 'change', // 默认为input时间，此处改为change
  },
  props: {
    value: { type: String, required: false, default: '' },
  },
  data() {
    return {
      editorContent: this.value,
    };
  },
  mounted() {
    var editor = new E(this.$refs.editor);
    editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.$emit('change', html);
    };
    // 自定义菜单配置
    editor.customConfig.menus = menus;
    editor.customConfig.zIndex = 0;
    editor.create();
    editor.txt.html(this.value);
  },
  methods: {
    getContent: function() {
      return this.editorContent;
    },
  },
};
</script>
