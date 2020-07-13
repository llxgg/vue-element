<!-- 流程图 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 流程配置 / 流程定义
        </el-breadcrumb-item>
      </el-breadcrumb>-->

      <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>流程配置</el-breadcrumb-item>
        <el-breadcrumb-item>流程定义</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <!-- <div style="margin-bottom: 3px;">流程定义</div> -->
      <!-- 流程图 -->
      <Panel />
    </div>
  </div>
</template>
<script>
import Panel from "./ef/panel";
export default {
  components: {
    Panel
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
  watch: {}
};
</script>
<style scoped>
</style>