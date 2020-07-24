<!-- 项目新增 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <!-- 头部 -->
      <div class="policy-header">
        <div style="font-size:20px;">项目新增</div>
        <el-button type="primary" @click="goPageDeclaration">定义申报要素</el-button>
      </div>

      <!-- 内容 -->
      <div style="margin-top:16px;" class="policy-body">
        <div class="policy-body-title">项目信息</div>

        <el-button type="primary" @click="addDeclaration">添加申报方向</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    // 跳转到定义申报要素页面：
    goPageDeclaration() {
      this.$router.push({
        path: "/definitiondeclaration",
        query: {}
      });
    },
    // 添加申报方向
    addDeclaration(){
        this.$router.push({
            path:"/adddeclaration",
            query:{}
        })
    },
  },
  computed: {},
  watch: {}
};
</script>
<style scoped>
.policy-header {
  display: flex;
  justify-content: space-between;
}
.policy-body {
}
.policy-body-title {
  font-size: 16px;
}
</style>