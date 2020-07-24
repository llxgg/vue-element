<!-- 定义申报要素 -->
<template>
  <div>
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- card -->
    <div class="container">
      <h3>定义申报要素</h3>

      <div class="declare-body" style="margin-top:26px;">
        <!-- 基础信息 -->
        <div class="basics-info">
          <div class="basics-info-title" style="margin-bottom:18px;">基础信息</div>

          <div id="el__policy-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="要素"></el-table-column>
              <!-- <el-table-column label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="basicsRadio">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>-->

              <el-table-column prop="tongchou" label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column label="下级是否可选" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 实施主体 -->
        <div class="subject-info" style="margin-top:20px;">
          <div class="subject-info-title" style="margin-bottom:18px;">实施主体</div>

          <div id="el__policy-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="要素"></el-table-column>
              <!-- <el-table-column label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="basicsRadio">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>-->

              <el-table-column prop="tongchou" label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column label="下级是否可选" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 服务范围 -->
        <div class="services-info" style="margin-top:20px;">
          <div class="services-info-title" style="margin-bottom:18px;">服务范围</div>

          <div id="el__policy-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="要素"></el-table-column>
              <!-- <el-table-column label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="basicsRadio">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>-->

              <el-table-column prop="tongchou" label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column label="下级是否可选" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 条件限制 -->
        <div class="condition-info" style="margin-top:20px;">
          <div class="condition-info-title" style="margin-bottom:18px;">条件限制</div>

          <div id="el__policy-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="要素"></el-table-column>
              <!-- <el-table-column label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="basicsRadio">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>-->

              <el-table-column prop="tongchou" label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column label="下级是否可选" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 办理材料 -->
        <div class="materials-info" style="margin-top:20px;">
          <div class="materials-info-title" style="margin-bottom:18px;">办理材料</div>

          <div id="el__policy-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="要素"></el-table-column>
              <!-- <el-table-column label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="basicsRadio">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>-->

              <el-table-column prop="tongchou" label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column label="下级是否可选" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 服务结果 -->
        <div class="results-info" style="margin-top:20px;">
          <div class="results-info-title" style="margin-bottom:18px;">服务结果</div>

          <div id="el__policy-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="要素"></el-table-column>
              <!-- <el-table-column label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="basicsRadio">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>-->

              <el-table-column prop="tongchou" label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column label="下级是否可选" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 办理流程 -->
        <div class="flow-info" style="margin-top:20px;">
          <div class="flow-info-title" style="margin-bottom:18px;">办理流程</div>

          <div id="el__policy-table">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="要素"></el-table-column>
              <!-- <el-table-column label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="basicsRadio">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>-->

              <el-table-column prop="tongchou" label="是否统筹" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.tongchou">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>

              <el-table-column label="下级是否可选" width="260">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.kexuan">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="btn-bottom">
        <el-button style="margin-right:30px;" @click="cancelDeclaration" class="elbutton">取消</el-button>
        <el-button type="primary" @click="nextPage" class="elbutton">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      tableData: [
        // 表格数据
        { name: "政策名称", tongchou: "", kexuan: "", value: "name" },
        {
          name: "发布部门",
          tongchou: "",
          kexuan: "",
          value: ""
        },
        {
          name: "发布层级",
          tongchou: "",
          kexuan: "",
          value: ""
        }
      ],

      basicsRadio: "" // 基础信息中的是否统筹
    };
  },
  methods: {
    // 取消，返回上一层
    cancelDeclaration() {
      this.$router.back(-1);
    },
    // 下一步（跳回项目新增）
    nextPage() {
        this.$router.back(-1);
    }
  },
  computed: {},
  watch: {}
};
</script>
<style scoped>
.btn-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>