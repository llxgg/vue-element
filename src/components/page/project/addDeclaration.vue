<!-- 添加申报方向 -->
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
      <div class="declaration-header">新增申报方向</div>

      <!-- 内容 -->
      <div style="margin-top:16px;" class="declaration-body">
        <div class="step-bar">
          <el-steps :active="stepActive" finish-status="success">
            <el-step title="办理名称"></el-step>
            <el-step title="办理条件"></el-step>
            <el-step title="办理材料"></el-step>
            <el-step title="办事部门"></el-step>
            <el-step title="办理流程"></el-step>
            <el-step title="办理时限"></el-step>
            <el-step title="收费信息"></el-step>
            <el-step title="收费服务"></el-step>
            <el-step title="咨询投诉"></el-step>
          </el-steps>
        </div>

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="conduct-ruleForm"
        >
          <!-- 办理名称 -->
          <div class="conduct-name" style="margin-top:20px;">
            <div class="conduct-name-title" style="margin-bottom:8px;">办理名称</div>
            <el-form-item label="办理情形名称" prop="name">
              <el-input
                v-model="ruleForm.name"
                style="width:500px;"
                placeholder="请输入办理情形名称"
                clearable
                @clear="clearConductName"
              ></el-input>
            </el-form-item>

            <el-form-item label="办理描述" prop="desc">
              <el-input
                style="width:500px;"
                type="textarea"
                :rows="5"
                placeholder="请输入办理描述"
                v-model="ruleForm.desc"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 办理条件 -->
          <div class="conduct-condition" style="margin-top:40px;">
            <div class="conduct-condition-title" style="margin-bottom:6px;">办理条件</div>
            <el-form-item label="办理条件" prop="condition">
              <el-button
                type="primary"
                style="height: 35px;"
                @click="handleVisibleConditionDialog"
              >添加办理规则</el-button>
            </el-form-item>
            <el-table :data="conditionTable" border style="width: 100%">
              <el-table-column type="index" width="70" label="序号"></el-table-column>
              <el-table-column prop="name" label="条件名称"></el-table-column>
              <el-table-column prop="fuhao" label="关系符" width="100"></el-table-column>
              <el-table-column prop="danwei" label="政策出台单位" width="450">
                <template slot-scope="scope">
                  <p class="chutai-danwei" v-for="(item,i) in scope.row.danwei">
                    <span class="chutai-danwei-item" v-for="(m,index) in item">{{m}}</span>
                  </p>
                </template>
              </el-table-column>

              <el-table-column label="是否公开" width="100">
                <template slot-scope="scope">{{scope.row.isPublic == 1 ? "是" : "否"}}</template>
              </el-table-column>

              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-link
                    style="color:#409EFF;margin-right:30px;"
                    :underline="false"
                    @click="handleEdit(scope.row)"
                  >编辑</el-link>
                  <el-link
                    style="color:#409EFF;"
                    :underline="false"
                    @click="handleRemove(scope.row)"
                  >删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 办理表单 -->
          <div class="conduct-condition" style="margin-top:40px;">
            <div class="conduct-condition-title" style="margin-bottom:6px;">办理表单</div>
            <el-form-item label="办理条件" prop="writeForm">
              <el-button
                type="primary"
                style="height: 35px;"
                @click="handleVisibleFormDialog"
              >添加填报表单</el-button>
            </el-form-item>
            <el-table :data="formTable" border style="width: 100%">
              <el-table-column type="index" width="70" label="序号"></el-table-column>
              <el-table-column prop="name" label="表单名称"></el-table-column>
              <el-table-column prop="biyao" label="表单必要性" width="100"></el-table-column>
              <el-table-column prop="danwei" label="表单形式" width="450">
                <template slot-scope="scope">
                  <span
                    class="chutai-danwei"
                    v-for="(item,index) in scope.row.xingshi"
                  >{{(index < scope.row.xingshi.length-1) ? `${item}、` : item}}</span>
                </template>
              </el-table-column>

              <el-table-column label="表单模板" width="100">
                <template slot-scope="scope">
                  <span class="template-see">模板预览</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-link
                    style="color:#409EFF;margin-right:30px;"
                    :underline="false"
                    @click="handleEdit(scope.row)"
                  >编辑</el-link>
                  <el-link
                    style="color:#409EFF;"
                    :underline="false"
                    @click="handleRemove(scope.row)"
                  >删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 办理材料 -->
          <div class="conduct-condition" style="margin-top:40px;">
            <div class="conduct-condition-title" style="margin-bottom:6px;">办理材料</div>
            <el-form-item label="办理条件" prop="material">
              <el-button type="primary" style="height: 35px;" @click="handleVisibleMaterial">添加办理材料</el-button>
            </el-form-item>
            <el-table :data="materialTable" border style="width: 100%">
              <el-table-column type="index" width="70" label="序号"></el-table-column>
              <el-table-column prop="name" label="材料名称"></el-table-column>
              <el-table-column prop="leixing" label="材料类型"></el-table-column>
              <el-table-column prop="biyao" label="材料必要性" width="100"></el-table-column>
              <el-table-column prop="desc" label="材料描述" width="180"></el-table-column>
              <el-table-column prop="num" label="纸质材料份数" width="120"></el-table-column>

              <el-table-column label="材料模板" width="100">
                <template slot-scope="scope">
                  <span class="template-see">模板预览</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-link
                    style="color:#409EFF;margin-right:30px;"
                    :underline="false"
                    @click="handleEdit(scope.row)"
                  >编辑</el-link>
                  <el-link
                    style="color:#409EFF;"
                    :underline="false"
                    @click="handleRemove(scope.row)"
                  >删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- others -->
          <div class="others" style="margin-top:20px;">
            <el-form-item label="办理部门" prop="department">
              <el-input
                v-model="ruleForm.department"
                style="width:400px;"
                placeholder="请输入办理部门"
                clearable
                @clear="clearConductDepartment"
              ></el-input>
            </el-form-item>

            <el-form-item label="办理流程" prop="flow">
              <el-input
                v-model="ruleForm.flow"
                style="width:400px;"
                placeholder="请输入办理流程"
                clearable
                @clear="clearConductFlow"
              ></el-input>
            </el-form-item>

            <el-form-item label="办理时限" prop="timeLimit">
              <el-input
                v-model="ruleForm.timeLimit"
                style="width:400px;"
                placeholder="请输入办理时限"
                clearable
                @clear="clearConductTimeLimit"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 按钮 -->
          <div class="btn-bottom">
            <el-form-item>
              <el-button style="margin-right:30px;" @click="cancelBtn" class="elbutton">取消</el-button>
              <el-button type="primary" @click="nextPage('ruleForm')" class="elbutton">下一步</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <!-- 添加条件规则--弹出框  :width="dialogWidth" -->
      <el-dialog :visible.sync="conditionVisible" width="50%" center>
        <div class="condition-dialog">
          <el-form
            :model="conditionRuleForm"
            :rules="conditionRules"
            ref="conditionRuleForm"
            label-width="100px"
            class="condition-ruleForm"
          >
            <el-form-item label="条件名称" prop="conditionName">
              <el-input
                :maxlength="20"
                v-model="conditionRuleForm.conditionName"
                style="width:380px;"
                placeholder="最多输入20个字"
                clearable
                @clear="clearConditionName"
              ></el-input>
            </el-form-item>

            <el-form-item label="是否公示" prop="conditionRadio">
              <el-radio-group v-model="conditionRuleForm.conditionRadio">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 动态添加内容 -->
            <div class="dynamic-content" style="margin-top:8px;">
              <div class="dynamic-content-item" v-for="(item,index) in additionDynamic">
                <div style="display:inline-block;">
                  <span class="huo-qie">或</span>
                  <el-select
                    style="width:180px;margin-right:20px;"
                    v-model="item.bodyCondition"
                    placeholder="请选择主体条件"
                  >
                    <el-option
                      v-for="item in bodyConditions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    style="width:100px;margin-right:20px;"
                    v-model="item.operator"
                    placeholder="操作符"
                  >
                    <el-option
                      v-for="item in operators"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>

                  <el-select
                    style="width:130px;margin-right:20px;"
                    v-model="item.cascade"
                    placeholder="级联主体值"
                  >
                    <el-option
                      v-for="item in cascades"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>

                <el-button
                  style="width: 80px;color:#409EFF;float:right;"
                  @click="removeSomeOne(index)"
                >删除</el-button>
              </div>
            </div>

            <div class="publicityBtn">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                plain
                style="width:100%;height:40px;font-size:14px;"
                class="addConditionBtn"
                @click="adds"
              >添加</el-button>
            </div>

            <div class="footerBtn">
              <el-button style="margin-right:20px;" @click="removeAllCondition">删除</el-button>
              <el-button type="primary" @click="resetAllCondition">重置</el-button>
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="conditionVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCondition('conditionRuleForm')">提交</el-button>
        </span>
      </el-dialog>

      <!-- 填报表单的弹出框 -->
      <el-dialog id="form-dialog" title="添加表单" :visible.sync="formVisible" width="60%" top="6vh">
        <div class="form-dialog-body">
          <div class="form-search">
            <el-select style="width:160px;" v-model="formCategory" placeholder="请选择表单分类">
              <el-option
                v-for="item in formCategorys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <el-input
              style="width:150px;margin: 0 20px;"
              placeholder="请输入关键词搜索"
              v-model="formSearch"
              clearable
              @clear="clearSearchForm"
            ></el-input>

            <el-button type="primary">搜索</el-button>
          </div>

          <div class="form-body clearfix" style="margin-top:20px;">
            <div class="form-body-left">
              <div class="form-body-left-header">
                已选择
                <span style="margin: 0 3px;color:#409EFF;">{{checkedCount}}</span>条
              </div>
              <div class="form-body-left-body">
                <el-checkbox-group v-model="checkedSelects" @change="handleCheckedSelectsChange">
                  <el-checkbox
                    style="display:block;margin-bottom:16px;color:#353A45;"
                    v-for="select in selectOptions"
                    :label="select"
                    :key="select"
                  >{{select}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="form-body-right">
              <el-form
                :model="formRuleForm"
                :rules="formRules"
                ref="formRuleForm"
                label-width="100px"
                class="form-ruleForm"
              >
                <el-form-item label="表单名称" prop="formName">
                  <el-input v-model="formRuleForm.formName" style="width:314px;"></el-input>
                </el-form-item>

                <el-form-item label="表单必要性" prop="formRadio">
                  <el-radio-group v-model="formRuleForm.formRadio">
                    <el-radio label="必要"></el-radio>
                    <el-radio label="不必要"></el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="表单选择" prop="formSelect">
                  <el-select
                    v-model="formRuleForm.formSelect"
                    placeholder="PC端、移动端、PDF"
                    style="width:314px;"
                  >
                    <el-option label="PC端" value="pc"></el-option>
                    <el-option label="移动端" value="app"></el-option>
                    <el-option label="PDF" value="pdf"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label-width="110px" label="表单模板预览" prop="formTemplate">
                  <div class="form-template-box"></div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="formVisible = false" style="margin-right:20px;">取 消</el-button>
          <el-button type="primary" @click="submitForm('formRuleForm')">下一步</el-button>
        </span>
      </el-dialog>

      <!-- 添加办理材料 -->
      <el-dialog
        id="material-dialog"
        title="添加材料"
        :visible.sync="materialVisible"
        width="60%"
        top="6vh"
      >
        <div class="form-dialog-body">
          <div class="form-search">
            <el-select style="width:160px;" v-model="materialCategory" placeholder="请选择材料分类">
              <el-option
                v-for="item in materialCategorys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <el-input
              style="width:150px;margin: 0 20px;"
              placeholder="请输入关键词搜索"
              v-model="materialSearch"
              clearable
              @clear="clearSearchMaterial"
            ></el-input>

            <el-button type="primary">搜索</el-button>
          </div>

          <div class="form-body" style="margin-top:20px;">
            <div class="form-body-left">
              <div class="form-body-left-header">
                已选择
                <span style="margin: 0 3px;color:#409EFF;">{{checkedMaterialsCount}}</span>条
              </div>
              <div class="form-body-left-body">
                <el-checkbox-group
                  v-model="checkedMaterialsSelects"
                  @change="handleCheckedMaterialsChange"
                >
                  <el-checkbox
                    style="display:block;margin-bottom:16px;color:#353A45;"
                    v-for="select in selectMaterialOptions"
                    :label="select"
                    :key="select"
                  >{{select}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="form-body-right">
              <el-form
                :model="materialRuleForm"
                :rules="materialRules"
                ref="materialRuleForm"
                label-width="100px"
                class="material-ruleForm"
              >
                <el-form-item label="材料名称" prop="materialName">
                  <el-input v-model="materialRuleForm.materialName" style="width:314px;" clearable></el-input>
                </el-form-item>

                <el-form-item label="材料必要性" prop="materialRadio">
                  <el-radio-group v-model="materialRuleForm.materialRadio">
                    <el-radio label="必要"></el-radio>
                    <el-radio label="不必要"></el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="材料类型" prop="materialChecked">
                  <el-checkbox-group v-model="materialRuleForm.materialChecked">
                    <el-checkbox label="文件" name="type"></el-checkbox>
                    <el-checkbox label="复印件" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label="纸质材料份数" prop="materialNum" label-width="110px">
                  <el-input v-model="materialRuleForm.materialNum" style="width:304px;"></el-input>
                </el-form-item>

                <el-form-item label-width="110px" label="材料模板预览" prop="materialTemplate">
                  <div class="form-template-box"></div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="materialVisible = false" style="margin-right:20px;">取 消</el-button>
          <el-button type="primary" @click="submitmaterial('materialRuleForm')">下一步</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { isNumber } from "../../../util/tools";
export default {
  components: {},
  data() {
    // 自定义校验材料份数
    let materialNumRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入纸质材料份数"));
      } else if (!isNumber(value)) {
        callback(new Error("输入的材料份数必须为正整数类型"));
      } else {
        callback();
      }
    };
    return {
      stepActive: 0, // 步骤条高亮
      ruleForm: {
        name: "", // 办理名称
        desc: "", // 办理描述
        condition: [], // 办理条件
        writeForm: [], // 填报表单
        material: [], // 办理材料
        department: "", // 办理部门
        flow: "", // 办理流程
        timeLimit: "" // 办理时限
      },
      rules: {
        name: [
          { required: true, message: "请输入办理情形名称", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请输入办理描述", trigger: "blur" }],
        condition: [
          { required: true, message: "请添加办理规则", trigger: "change" }
        ],
        writeForm: [
          { required: true, message: "请添加填报表单", trigger: "change" }
        ],
        material: [
          { required: true, message: "请添加办理材料", trigger: "change" }
        ],
        department: [
          { required: true, message: "请输入办理部门", trigger: "blur" }
        ],
        flow: [{ required: true, message: "请输入办理流程", trigger: "blur" }],
        timeLimit: [
          { required: true, message: "请输入办理时限", trigger: "blur" }
        ]
      },

      // 办理条件的弹出框需要的数据
      conditionVisible: false,
      dialogWidth: 0,
      conditionRuleForm: {
        conditionName: "", // 条件名称
        conditionRadio: "" // 是否公开
      },
      conditionRules: {
        conditionName: [
          { required: true, message: "请输入条件名称", trigger: "blur" }
        ],
        conditionRadio: [
          { required: true, message: "请选择是否公开", trigger: "change" }
        ]
      },
      publicityRadio: "", // 是否公示
      // 动态创建一行
      additionDynamic: [
        // {
        //   bodyCondition: "", // 主体条件
        //   operator: "", // 操作符
        //   cascade: "" //级联主体值
        // }
      ],

      bodyConditions: [
        {
          value: "黄金糕",
          label: "黄金糕"
        },
        {
          value: "双皮奶",
          label: "双皮奶"
        }
      ],

      operators: [
        {
          value: "选项1",
          label: "或"
        },
        {
          value: "选项2",
          label: "且"
        }
      ],

      cascades: [
        {
          value: "选项1",
          label: "级联主体值"
        },
        {
          value: "选项2",
          label: "级联主体值"
        }
      ],

      // 办理条件的数据：
      conditionTable: [
        {
          name: "获得证书",
          fuhao: "或",
          danwei: [
            {
              one: "选择主体单位",
              two: "操作符",
              three: "级联主体值",
              fuhao: "或"
            },
            {
              one: "注册地",
              two: "字符串等于",
              three: "广东省",
              fuhao: "且"
            }
          ],
          isPublic: "1"
        },
        {
          name: "获得证书",
          fuhao: "且",
          danwei: [
            {
              one: "选择主体单位",
              two: "操作符",
              three: "级联主体值",
              fuhao: "或"
            }
          ],
          isPublic: "0"
        }
      ],

      // ******办理表单的数据***********
      formVisible: false,
      formCategory: "", // 选择表单分类
      formCategorys: [
        {
          value: "选项1",
          label: "级联主体值"
        },
        {
          value: "选项2",
          label: "级联主体值"
        }
      ],
      formSearch: "", // 输入的关键词搜索
      selectOptions: [
        // 左侧多选的处理
        "《2020年度国际出生医学证明首次签发登记表及汇总表》",
        "《出生医学证明首次签发登记表》",
        "《项目申报表》",
        "《营业执照》"
      ],
      checkedSelects: [], // 选中的内容
      checkedCount: 0, // 选择的数量
      formRuleForm: {
        // 右侧表单的填写的内容
        formName: "", // 表单名称
        formRadio: "", // 表单必要性
        formSelect: "" // 表单选择
      },
      formRules: {
        // 表单内容的校验：
        formName: [
          { required: true, message: "请输入表单名称", trigger: "blur" }
        ],
        formRadio: [
          { required: true, message: "请选择表单必要性", trigger: "change" }
        ],
        formSelect: [
          { required: true, message: "表单选择不能为空", trigger: "change" }
        ],

        formTemplate: [
          { required: true, message: "请预览表单模板", trigger: "change" }
        ]
      },
      formTable: [
        {
          name: "《标准化战略资金项目申请表》",
          biyao: "必要",
          xingshi: ["pc端", "移动端", "PDF"]
        }
      ],

      // ***********办理材料的数据*********
      materialVisible: false,
      materialCategory: "", // 选择的材料分类
      materialSearch: "", // 输入的关键字搜索
      materialCategorys: [
        {
          value: "选项1",
          label: "级联主体值"
        },
        {
          value: "选项2",
          label: "级联主体值"
        }
      ],
      selectMaterialOptions: [
        // 左侧多选的处理
        "《男女双方居民身份证》",
        "《男女双方户口簿》",
        "《项目申报表》",
        "《营业执照》"
      ],
      checkedMaterialsSelects: [], // 选中的内容
      checkedMaterialsCount: 0, // 选择的数量

      materialRuleForm: {
        // 右侧表单的填写的内容
        materialName: "", // 材料名称
        materialRadio: "", // 材料必要性
        materialChecked: [], // 材料类型
        materialNum: "" // 材料份数
      },

      materialRules: {
        // 材料表单内容的校验：
        materialName: [
          { required: true, message: "请输入材料名称", trigger: "blur" }
        ],
        materialRadio: [
          { required: true, message: "请选择材料必要性", trigger: "change" }
        ],
        materialChecked: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个材料类型",
            trigger: "change"
          }
        ],
        materialNum: [
          {
            required: true,
            trigger: "blur",
            validator: materialNumRule
          }
        ],

        materialTemplate: [
          { required: true, message: "请预览材料模板", trigger: "change" }
        ]
      },
      materialTable: [
        {
          name: "男女方居民身份证",
          leixing: "原件和复印件",
          biyao: "必要",
          desc: "身份证",
          num: "2"
        }
      ]
    };
  },
  methods: {
    // 清除输入的办理情形名称
    clearConductName() {
      this.ruleForm.name = "";
    },
    // 清除办理部门
    clearConductDepartment() {
      this.ruleForm.department = "";
    },
    // 清除办理流程
    clearConductFlow() {
      this.ruleForm.flow = "";
    },
    // 清除办理时限的数据
    clearConductTimeLimit() {
      this.ruleForm.timeLimit = "";
    },

    // **************弹出框---添加办理规则*******************
    // 弹出办理规则的模态框
    handleVisibleConditionDialog() {
      this.conditionVisible = true;
      this.additionDynamic = [];
      this.$nextTick(() => {
        this.$refs.conditionRuleForm.resetFields();
      });
    },
    // 清除条件名称
    clearConditionName() {
      this.conditionRuleForm.conditionName = "";
    },
    // 动态添加一行新数据
    adds() {
      let datas = {
        //这里定义了一个对象
        bodyCondition: "", // 主体条件
        operator: "", // 操作符
        cascade: "" //级联主体值
      };
      //这里 每次点新增  把这个定义的空对象   push到additionDynamic这个数组中
      this.additionDynamic.push(datas);
    },
    // 删除对应的每一行数据
    removeSomeOne(index) {
      console.log("删除哪一行的数据：", index);
      var list = this.additionDynamic;
      list.splice(index, 1);
      this.additionDynamic = list;
    },
    // 删除全部
    removeAllCondition() {
      this.additionDynamic = [];
    },
    // 重置所有
    resetAllCondition() {
      let list = this.additionDynamic;
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        for (let key in item) {
          item[key] = "";
        }
      }
      console.warn("所有内容都重置：", list);
      this.additionDynamic = list;
    },
    // 提交办理规则
    submitCondition(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.warn(
            "*********提交之后的数据：**********",
            this.additionDynamic,
            this.conditionRuleForm
          );
          this.ruleForm.condition = this.additionDynamic;
          this.conditionVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // ****************表单的dialog***************
    clearSearchForm() {
      this.formSearch = "";
    },
    // 多选框的处理：
    handleCheckedSelectsChange(value) {
      console.warn("多选框选择的内容：", value);
      this.checkedCount = value.length; // 得到选择的数量
      this.checkedSelects = value;
    },
    // 打开表单
    handleVisibleFormDialog() {
      this.formVisible = true; //弹窗打开
      this.formCategory = "";
      this.formSearch = "";
      this.checkedCount = 0;
      this.checkedSelects = [];
      this.$nextTick(() => {
        this.$refs.formRuleForm.resetFields();
      });
    },
    // 提交表单的内容
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          this.$message({
            message: "请输入必填信息",
            type: "warning"
          });
          return false;
        }
      });
    },

    // ************ 添加材料的dialog ***********
    clearSearchMaterial() {
      this.materialSearch = "";
    },
    // 多选框的处理：
    handleCheckedMaterialsChange(value) {
      console.warn("多选框选择的内容：", value);
      this.checkedMaterialsCount = value.length; // 得到选择的数量
      this.checkedMaterialsSelects = value;
    },
    // 打开材料的dialog
    handleVisibleMaterial() {
      this.materialVisible = true; //弹窗打开
      this.materialCategory = "";
      this.materialSearch = "";
      this.checkedMaterialsCount = 0; // 得到选择的数量
      this.checkedMaterialsSelects = [];

      this.$nextTick(() => {
        this.$refs.materialRuleForm.resetFields();
      });
    },
    // 提交材料的dialog
    submitmaterial(formName) {
      console.warn("选择了那些内容：", this.materialRuleForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          this.$message({
            message: "请输入必填信息",
            type: "warning"
          });
          return false;
        }
      });
    },

    // table 表格中的事件
    // 编辑
    handleEdit() {},
    // 删除
    handleRemove() {},

    // *********** 取消、下一步 *************
    // 取消
    cancelBtn() {
      this.$router.back(-1);
    },
    // 下一步：
    nextPage(formName) {
      // this.ruleForm.condition = []; // 办理规则
      // this.ruleForm.writeForm = []; // 填报表单
      // this.ruleForm.material = []; // 办理材料

      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {},
  watch: {
    "ruleForm.name": function(newVal) {
      newVal = newVal.trim();
      if (newVal !== "") {
        this.oneActive = true;
      } else {
        this.oneActive = false;
      }
    },
    "ruleForm.desc": function(newVal) {
      newVal = newVal.trim();
      if (newVal !== "") {
        this.twoActive = true;
      } else {
        this.twoActive = false;
      }
      console.warn("监听第二个", this.twoActive);

      if (this.oneActive && this.twoActive) {
        this.stepActive = 1;
        console.log("xxxxxxxxx", this.stepActive);
      } else {
        // this.stepActive -= 1;
      }
    },
    "ruleForm.condition": function(newVal) {
      if (newVal.length > 0) {
        this.threeActive = true;
      } else {
        this.threeActive = false;
      }
      console.warn("监听第三个", this.threeActive);
      if (this.oneActive && this.twoActive && this.threeActive) {
        this.stepActive = 2;
      } else {
        // this.stepActive -= 1;
      }
    }
  },
  creted() {},
  mounted() {}
};
</script>
<style scoped>
.conduct-ruleForm >>> .el-form-item__label {
  width: 106px !important;
}
.conduct-ruleForm >>> .el-form-item__content {
  margin-left: 106px !important;
}
.conduct-condition >>> .el-form-item__error {
  position: absolute;
  top: 63%;
  left: -92px;
}

.chutai-danwei {
  height: 38px;
  margin-top: 15px;
}
.chutai-danwei-item {
  padding: 10px;
  margin-right: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chutai-danwei-item:nth-last-of-type(1) {
  background-color: #f3f3f3;
}
.template-see {
  color: rgb(64, 158, 255);
  cursor: pointer;
}
.btn-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.condition-dialog {
  /* padding: 30px; */
  min-height: 200px;
  width: 92%;
  overflow: hidden;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
.condition-ruleForm {
  margin-top: 20px;
}

/* 表格 */
.dynamic-content {
  padding: 0 20px;
  box-sizing: border-box;
}
.huo-qie {
  padding: 6px 16px;
  background-color: #f3f3f3;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 18px;
}

/* 按钮 */
.publicityBtn {
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}
.footerBtn {
  margin: 26px 20px 20px 0;
  text-align: right;
}
.dynamic-content-item {
  margin-top: 10px;
}
/* .addConditionBtn:hover {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
} */

/* 表单样式 */
.form-dialog-body {
  width: 88%;
  margin: 0 auto;
  /* height: 450px; */
}
#form-dialog >>> .el-dialog__body {
  overflow-y: auto;
}
#form-dialog >>> .el-dialog__footer {
  text-align: center;
  margin-top: 10px;
}

#material-dialog >>> .el-dialog__body {
  overflow-y: auto;
}
#material-dialog >>> .el-dialog__footer {
  text-align: center;
  margin-top: 10px;
}

.form-body-left {
  float: left;
  height: 100%;
  border: 1px solid #dcdfe6;
  width: 300px;
}
.form-body-left-header {
  height: 40px;
  background-color: #f6f7fb;
  line-height: 40px;
  padding-left: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
}
#form-dialog .form-body-left-body {
  padding: 16px;
  height: 378px;
}

#material-dialog .form-body-left-body {
  padding: 16px;
  height: 432px;
}
.form-body-left-body >>> .el-checkbox__input {
  vertical-align: top;
}
.form-body-left-body >>> .el-checkbox__label {
  white-space: normal;
  word-break: break-all;
}

.form-body-right {
  float: left;
  height: 100%;
  margin-left: 60px;
  width: 300px;
}
.form-template-box {
  border: 1px solid #dcdfe6;
  width: 300px;
  height: 300px;
}

.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
</style>