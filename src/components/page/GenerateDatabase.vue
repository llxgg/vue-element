<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单配置 / 控件管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div>生成数据库表</div>

            <el-form ref='form' :rules="formRules" :model="form" label-width="100px" style="margin: 20px 0px;">
                <el-form-item label="选择数据源" prop="source">
                    <el-select placeholder="请选择" v-model="form.source" :disabled="tableDis">
                        <el-option
                        v-for="item in sources"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="新建表名" prop="name">
                    <el-input placeholder="表名只能包含数字、字母或下划线，且不能以数字开头" v-model="form.name" style="width: 350px;" :disabled="fieldDis"></el-input>
                </el-form-item>
                <el-form-item label="数据库表别名" prop="othername">
                    <el-input placeholder="（选填）" v-model="form.othername" style="width: 350px;" :disabled="fieldDis"></el-input>
                </el-form-item>
            </el-form>
            <div class="table-wrapper">
              <el-button type="primary" @click='handleAdd'><i class="el-icon-circle-plus-outline"></i> 新增行</el-button>
              <div class="table-fun">
                <el-button type="danger" style="width: 80px;" @click='isDelete'>批量删除</el-button>
              </div>
            </div>
            <div style="margin-top: 10px;">

                <!-- 表单 -->
                <el-table
                    ref="singleTable"
                    :data="tableData"
                    highlight-current-row
                    @current-change="handleCurrentSelectionChange"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column
                    type="selection"
                    width="45">
                    </el-table-column>
                    <el-table-column
                    type="index"
                    width="40">
                    </el-table-column>
                    <el-table-column
                    property="chineseName"
                    label="中文名称"
                    width="100">
                      <template slot-scope="scope">
                        <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{scope.row.chineseName}}</span>
                        <el-input v-else v-model="multipleSelection.chineseName" style="width: 70px;" :disabled="fieldDis" class="tableInput" @blur='changeChineseName'></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                    property="fieldName"
                    label="字段名称"
                    width="80"
                    >
                      <template slot-scope="scope">
                        <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{scope.row.fieldName}}</span>
                        <el-input v-else v-model="multipleSelection.fieldName" style="width: 70px;" :disabled="fieldDis" class="tableInput" @blur='changeFieldName'></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                    property="controlType"
                    width="100"
                    label="控件类型">
                        <template slot-scope="scope">
                            <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{controlTypes[scope.row.controlType]}}</span>
                            <el-select v-else placeholder="" v-model="multipleSelection.controlType" style="width: 90px;" :disabled="fieldDis" @change='changeControlType'>
                              <el-option 
                                v-for="(i,k) in controlTypes"
                                :key="k"
                                :label="i"
                                :value="k"
                              ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                    property="dataType"
                    label="数据类型"
                    width="100">
                        <template slot-scope="scope">
                            <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{dataTypes[scope.row.dataType]}}</span>
                            <el-select v-else placeholder="" v-model="multipleSelection.dataType" style="width: 90px;" :disabled="fieldDis" @change='changeDataType'>
                              <el-option 
                                v-for="(i,k) in dataTypes"
                                :key="k"
                                :label="i"
                                :value="k"
                              ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                    property="dataLength"
                    label="数据长度"
                    width="70">
                      <template slot-scope="scope">
                        <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{scope.row.dataLength}}</span>
                        <el-input v-else v-model="multipleSelection.dataLength" style="width: 50px;" :disabled="fieldDis" class="tableInput" @blur="changeDatalength"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                    property="dataAccuracy"
                    label="精度"
                    width="60">
                      <template slot-scope="scope">
                        <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{scope.row.dataAccuracy}}</span>
                        <el-input v-else v-model="multipleSelection.dataAccuracy" style="width: 50px;" :disabled="fieldDis" class="tableInput" @blur="changeDataAccuracy"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                    property="verifyType"
                    label="校验规则"
                    width="100">
                        <template slot-scope="scope">
                          <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{verifyTypes[scope.row.verifyType]}}</span>
                          <el-select v-else placeholder="" v-model="multipleSelection.verifyType" style="width: 90px;" :disabled="fieldDis" @change='changeVerifyType'>
                            <el-option 
                              v-for="(i,k) in verifyTypes"
                              :key="k"
                              :label="i"
                              :value="k"
                            ></el-option>
                          </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                    property="required"
                    label="是否必填"
                    width="70">
                        <template slot-scope="scope">
                            <!-- <span>{{scope.row.required}}</span> -->
                            <el-switch :value="scope.row.required" disabled v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))"></el-switch>
                            <el-switch v-model="multipleSelection.required" :disabled="fieldDis" v-else @change='changeRequired'></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="是否显示"
                    width="70">
                        <template slot-scope="scope">
                            <!-- <span>{{scope.row.display}}</span> -->
                            <el-switch  :value="scope.row.display" disabled v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))"></el-switch>
                            <el-switch v-model="multipleSelection.display" :disabled="fieldDis" v-else @change='changeDisPlay'></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                    property="dataExample"
                    label="样例数据"
                    width="70">
                      <template slot-scope="scope">
                        <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{scope.row.dataExample}}</span>
                        <el-input v-else v-model="multipleSelection.dataExample" style="width: 50px;" :disabled="fieldDis" class="tableInput" @blur="changeDataExample"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                    property="position"
                    label="所在位置"
                    width="70">
                      <template slot-scope="scope">
                        <span v-if="multipleSelection == null || (multipleSelection.id && (multipleSelection.id != scope.row.id))">{{scope.row.position}}</span>
                        <el-input v-else v-model="multipleSelection.position" style="width: 50px;" :disabled="fieldDis" class="tableInput" @blur="changePosition"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align='right' width="80" v-if="from == 'see'? false:true">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                </el-table>

                <!-- 编辑模态弹框 -->
                <el-dialog
                 title='填写字段信息'
                :visible.sync="showFieldDialog"
                :modal="true"
                width="800px"
                >
                    <el-form ref="fieldform" :model="fieldform" :rules="fieldformRules" label-width="100px">
                        <div class="two">
                            <el-form-item label='字段中文名' prop="chineseName">
                                <el-input v-model="fieldform.chineseName" placeholder="请输入1-20个字符" style="width: 250px;" :disabled="fieldDis"></el-input>
                            </el-form-item>
                            <el-form-item label='字段名称' prop="fieldName">
                                <el-input v-model="fieldform.fieldName" placeholder="字母开头，只包含数字、字母和下划线" style="width: 250px;" :disabled="fieldDis"></el-input>
                            </el-form-item>
                        </div>
                        <div class="two">
                            <el-form-item label='控件类型' prop="controlType" >
                                <el-select placeholder="请选择控件类型" v-model="fieldform.controlType" style="width: 250px;" >
                                    <el-option 
                                    v-for="(i,k) in controlTypes"
                                    :key="k"
                                    :label="i"
                                    :value="k"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label='数据类型' prop="dataType" >
                                <el-select placeholder="请选择数据类型" v-model="fieldform.dataType" style="width: 250px;" :disabled="fieldDis">
                                    <el-option 
                                    v-for="(i,k) in dataTypes"
                                    :key="k"
                                    :label="i"
                                    :value="k"
                                    ></el-option>
                                </el-select>
                                <!-- <el-input v-model="fieldform.dataType" placeholder="请输入" style="width: 250px;"></el-input> -->
                            </el-form-item>
                        </div>
                        <div class="two">
                            <el-form-item label='数据长度' prop="dataLength">
                                <el-input v-model="fieldform.dataLength" placeholder="请输入1-8位的正数" style="width: 250px;" :disabled="fieldDis"></el-input>
                            </el-form-item>
                            <el-form-item label='精度' prop="dataAccuracy">
                                <el-input v-model="fieldform.dataAccuracy" placeholder="请输入1-8位数字" style="width: 250px;" :disabled="fieldDis"></el-input>
                            </el-form-item>
                        </div>
                        <div class="two">
                            <el-form-item label='校验规则' prop="verifyType" >
                                <el-select placeholder="请选择" v-model="fieldform.verifyType" style="width: 250px;" >
                                    <el-option 
                                    v-for="(i,k) in verifyTypes"
                                    :key="k"
                                    :label="i"
                                    :value="k"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label='是否必填' prop="required" >
                                <el-switch v-model="fieldform.required" ></el-switch>
                            </el-form-item>
                            <el-form-item label='是否显示' prop="display">
                                <el-switch v-model="fieldform.display" ></el-switch>
                            </el-form-item>
                        </div>
                        <div class="two">
                            <el-form-item label='样例数据' prop="dataExample">
                                <el-input v-model="fieldform.dataExample" placeholder="请输入" style="width: 250px;" ></el-input>
                            </el-form-item>
                            <el-form-item label='所在位置' prop="position" >
                                <el-input v-model="fieldform.position" placeholder="请输入1-8位的数字" style="width: 250px;" ></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="模型参数" v-if="mxShow" :show-message='false'>
                          <el-button @click="addMX"><i class="el-icon-plus"></i>添加模型参数</el-button>
                        </el-form-item>
                        <div >
                          <div v-for='(i,k) in mxdata' :key='k'>
                            <div class="two">
                              <el-form-item label="名称" >
                                <el-input v-model="i.name" placeholder="请输入参数名称" style="width: 150px;" ></el-input>
                              </el-form-item>
                              <el-form-item label="值" label-width="50px">
                                <el-input v-model="i.value" placeholder="请输入参数值" style="width: 150px;"></el-input>
                              </el-form-item>
                              <i class="el-icon-circle-close" style="margin-left: 10px;font-size: 15px;" v-show='fieldDis == false' @click="deleteMx(k)"></i>
                            </div>
                          </div>
                        </div>

                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showFieldDialog = false">取 消</el-button>
                        <el-button type="primary" @click="submitField">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 删除提示 -->
                <el-dialog
                title='提示'
                :visible.sync="showColumnDelete"
                :modal="true"
                width="400px"
                >
                    <span>删除后无法恢复，您是否确定删除当前行列表？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showColumnDelete = false">取 消</el-button>
                        <el-button type="primary" @click="moreDelete">确 定</el-button>
                    </span>
                </el-dialog>

                <el-dialog
                title='添加模型参数'
                :visible.sync="showMxdialog"
                :modal="true"
                width="600px"
                >
                  <el-form label-width="100px">
                    <el-form-item label="模型参数"  :show-message='false'>
                      <el-button @click="addMSoptions"><i class="el-icon-plus"></i>添加模型参数</el-button>
                    </el-form-item>
                    <div>
                      <div v-for='(i,k) in msOptions' :key='k'>
                        <div class="two">
                          <el-form-item label="名称" >
                            <el-input v-model="i.name" placeholder="请输入参数名称" style="width: 150px;" ></el-input>
                          </el-form-item>
                          <el-form-item label="值" label-width="50px">
                            <el-input v-model="i.value" placeholder="请输入参数值" style="width: 150px;"></el-input>
                          </el-form-item>
                          <i class="el-icon-circle-close" style="margin-left: 10px;font-size: 15px;"  @click="deleteMsOptions(k)"></i>
                        </div>
                      </div>
                    </div>
                  </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showMxdialog = false">取 消</el-button>
                        <el-button type="primary" @click="toAddMsoptions">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 分页 -->
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="total"
                style="margin-top: 30px;">
                </el-pagination>

                <div style="margin: 20px auto;width: 150px;">
                    <el-button @click="prev">上一步</el-button>
                    <el-button type="primary" @click="next">下一步</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { post } from "../../util/http.js";
import {
  getTableInfo,
  getDatabaselist,
  tableFieldlist,
  createOrModifyTable,
  saveColumn,
  updateColumn,
  deleteColumn,
  batchDelete
} from "../../util/api.js";

export default {
  data() {
    return {
      optionIds: [], //删除字段中的单选多选id
      formNo: null, //表单number
      deleteid: "", //删除行id
      showColumnDelete: false, //删除控制
      mxdata: [], //模型参数
      fieldBehavior: "edit", //操作字段行为
      isCreate: 1, //是否已创建 1：未创建 2：已创建
      mxShow: false, //新增控件模板按钮
      currentPage: 1, //当前页面
      pageSize: 10, //每页条数
      total: 10, //数据总数
      formid: "", //表单id
      from: "", //由哪里进入
      fieldDis: false, //字段编辑为添加时不禁用，为编辑时禁用
      currentPage: 1, //当前页
      showFieldDialog: false, //字段编辑模态框
      tableDis: false, //数据源信息是否禁用
      state: 1, //表单当前状态
      oldcontrolType: "", //数据库记录的控件类型
      oldoptions: [], //数据库记录的模型参数
      multipleSelection: null, //点击表格获取的数据
      selectionClick: false,
      temp: [], //临时数据用于对比
      ids: [], //删除的数据
      mids: [], //表格删除字段
      msOptions: [], //在表格上对模型参数进行修改
      showMxdialog: false, //模型参数模态弹框
      msOptionsChangeInTable: true, //模型参数的修改是否成功
      //提交至哪个数据源
      form: {
        source: "",
        name: "",
        othername: ""
      },
      //校验规则
      formRules: {
        source: [{ required: true, message: "请选择数据源", trigger: "blur" }],
        name: [
          { required: true, message: "请填写表名称", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let f = new RegExp("^[0-9]+");
              let reg = new RegExp("^[0-9a-zA-Z_]{1,}$");
              let reg2 = new RegExp("^.{1,50}$");
              if (f.test(value)) {
                callback(new Error("不能以数字开头"));
              } else if (!reg.test(value)) {
                callback(new Error("表名必须为数字、字母或下划线组成"));
              } else if (!reg2.test(value)) {
                callback(new Error("表单标题长度为1-50个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      //编辑信息
      fieldform: {
        id: "",
        chineseName: "",
        fieldName: "",
        controlType: "",
        dataType: "",
        dataLength: "",
        dataAccuracy: "",
        verifyType: "",
        required: false,
        display: false,
        dataExample: "",
        position: "",
        options: []
      },
      fieldformRules: {
        chineseName: [
          { required: true, message: "请填写中文名", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let reg = new RegExp("^.{1,20}$");
              if (!reg.test(value)) {
                callback(new Error("长度为1-20个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        fieldName: [
          { required: true, message: "请填写字段名称", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let f = new RegExp("^[0-9_]+");
              let reg = new RegExp("^[0-9a-zA-Z_]{1,}$");
              let reg2 = new RegExp("^.{1,20}$");
              if (f.test(value)) {
                callback(new Error("必须以字母开头"));
              } else if (!reg.test(value)) {
                callback(new Error("字段名称必须为数字、字母或下划线组成"));
              } else if (!reg2.test(value)) {
                callback(new Error("字段名称长度为1-20个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        controlType: [
          { required: true, message: "请选择控件类型", trigger: "blur" }
        ],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "blur" }
        ],
        dataLength: [
          { required: true, message: "请填写数据长度", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let reg = new RegExp("^[1-9]\\d*$");
              // let reg2 = new RegExp("^[1-9]\\d*$");
              if (!reg.test(value)) {
                callback(new Error("请输入大于0的整数"));
              } else {
                // else if (!reg2.test(value)) {
                //   callback(new Error("请输入1-8位的数字"));
                // }
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        dataAccuracy: [
          { required: true, message: "请填写精度", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let reg = new RegExp("^[0-9]*$");
              let reg2 = new RegExp("^.{1,8}$");
              if (!reg.test(value)) {
                callback(new Error("请输入数字"));
              } else if (!reg2.test(value)) {
                callback(new Error("请输入1-8位的数字"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        position: [
          { required: true, message: "请填写所在位置", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let reg = new RegExp("^[0-9]*$");
              let reg2 = new RegExp("^.{1,8}$");
              if (!reg.test(value)) {
                callback(new Error("请输入数字"));
              } else if (!reg2.test(value)) {
                callback(new Error("请输入1-8位的数字"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      //表单列表
      tableData: [
        {
          chineseName: "姓名",
          fieldName: "XM",
          controlType: "text",
          dataType: "VARCHAR",
          dataLength: "100",
          dataAccuracy: "10",
          verifyType: "证件名称",
          required: true,
          display: true,
          dataExample: "姓名",
          position: "排序1",
          options: []
        }
      ],
      //数据源
      sources: [
        {
          id: "0",
          name: "测试数据源"
        }
      ],
      controlTypes: {
        // '': '--请选择--',
        TEXT: "普通文本",
        RADIO: "单选框",
        CHECKBOX: "复选框",
        DROPLIST: "下拉列表",
        DATETIME: "时间",
        TEXTAREA: "多行文本",
        IMAGE: "图片"
      },
      dataTypes: {
        VARCHAR: "字符型",
        DATE: "日期型",
        NUMERIC: "数字型",
        DATETIME: "时间型",
        TEXT: "文本型",
        DECIMAL: "高精度小数型"
      },
      verifyTypes: {
        "": "",

        IDCARD: "证件号码",
        PHONE: "电话号码",
        EMAIL: "邮箱",
        MOBILE: "手机号码",
        POSTCODE: "邮政编码",
        NUMBER: "数字",
        POSINT: "正整数",
        // DATE: "日期",
        POSFLOAT: "正数"
      },
      //控件模型数组
      mxdata: []
    };
  },
  mounted() {
    document.querySelector(".content-box>.content").scrollTo(0, 0);
    this.from = this.$route.query.from;
    this.formid = this.$route.query.id ? this.$route.query.id : "";

    this.state = this.$route.query.state;
    this.fieldDis = this.state == "1" ? false : true;
    this.getDatebaseList();
    this.getFieldList();
    if (this.formid) {
      //获取对应id的表单数据
      this.getTableDetail(this.formid);
    }
  },
  computed: {
    fromAdd() {
      return true;
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //新增行
    handleAdd() {
      this.fieldDis = false;
      this.fieldBehavior = "add";
      (this.fieldform = {
        id: "",
        chineseName: "",
        fieldName: "",
        controlType: "",
        dataType: "",
        dataLength: "",
        dataAccuracy: "",
        verifyType: "",
        required: false,
        display: true,
        dataExample: "",
        position: "",
        options: []
      }),
        (this.showFieldDialog = true);
    },
    //编辑操作
    handleEdit(index, row) {
      console.log(index, row);
      this.fieldform = row;
      this.mxdata = row.options == null ? [] : row.options;
      this.fieldBehavior = "edit";
      this.showFieldDialog = true;
      var val = this.fieldform.controlType;

      this.mxdata = this.initMxdata(val);
      this.oldcontrolType = val;
      this.oldoptions =
        this.fieldform.options != null ? this.fieldform.options : [];
      console.log(this.mxdata, this.fieldform.options);
    },
    //初始化模态数据
    initMxdata(val) {
      var me = this;
      var arr = [
        { name: "", value: "", id: "" },
        { name: "", value: "", id: "" }
      ];
      if (val == "RADIO" || val == "CHECKBOX" || val == "DROPLIST") {
        me.mxShow = true;
        if (me.fieldform.options != null && me.fieldform.options != []) {
          console.log(1);
          return me.fieldform.options;
        } else {
          console.log(2);
          return arr;
        }
      } else {
        me.mxShow = false;
        return [];
      }
    },
    //删除操作
    isDelete() {
      var me = this
      if(me.ids.length == 0) {
        me.$message({
          type: 'warning',
          message: "请先勾选要删除的数据"
        })
      }else{
        this.showColumnDelete = true;
      }
    },
    //更改页面
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getFieldList();
    },
    //选中数据
    handleCurrentSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      this.selectionClick = true;
      this.temp = JSON.parse(JSON.stringify(val)); //临时数据，用于对比
      this.mids = []; //初始化模态数据删除的id
    },
    //选择某一列
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      var me = this;
      var arr = [];
      for (var i = 0; i < val.length; i++) {
        arr.push(val[i].id);
      }
      me.ids = arr;
    },
    //返回上一步
    prev() {
      this.$router.push("/tablemanage");
    },
    //进行下一步
    next() {
      console.log("点击了下一步");
      var me = this;
      me.$refs.form.validate(res => {
        if (res) {
          var type = me.from == "add" ? 1 : 2;
          post(me, createOrModifyTable, {
            type: me.isCreate,
            tableName: me.form.name,
            tableAlias: me.form.othername,
            formId: me.formid,
            sourceId: me.form.source,
            formNo: me.formNo
          }).then(res => {
            console.log(res);
            if (res.status == 1) {
              me.$router.push({
                path: "/setHtmlclass",
                query: { id: me.formid, state: me.state }
              });
            } else {
              me.$message({
                type: "error",
                message: res.msg || "创建失败"
              });
            }
          });
        } else {
          me.$message({
            type: "warning",
            message: "请填写完整信息"
          });
        }
      });
    },
    //用于判断
    jadgeIsInput(data) {
      var me = this;
      // return value == false ? false : true;
      // var data = me.mxdata;
      var res = true;
      for (let i = 0; i < data.length; i++) {
        if (data[i].value == "" || data[i].name == "") {
          res = false;
        }
      }
      return res;
    },
    //提交字段名
    submitField() {
      var me = this;
      var data = {
        id: me.fieldform.id,
        chineseName: me.fieldform.chineseName,
        fieldName: me.fieldform.fieldName,
        controlType: me.fieldform.controlType,
        dataType: me.fieldform.dataType,
        dataLength: me.fieldform.dataLength,
        dataAccuracy: me.fieldform.dataAccuracy,
        verifyType: me.fieldform.verifyType,
        required: me.fieldform.required,
        display: me.fieldform.display,
        dataExample: me.fieldform.dataExample,
        position: me.fieldform.position,
        options: me.mxdata,
        optionIds: me.optionIds
      };
      // var data = me.fieldform
      me.$refs.fieldform.validate(res => {
        if (res) {
          if (
            data.controlType == "RADIO" ||
            data.controlType == "CHECKBOX" ||
            data.controlType == "DROPLIST"
          ) {
            if (!me.jadgeIsInput(me.mxdata)) {
              me.$message({
                type: "warning",
                message: "请填写完整模型参数"
              });
              return;
            }
          }

          if (me.fieldBehavior == "add") {
            //新增数据
            post(me, saveColumn, {
              formId: me.formid,
              ...data
            }).then(res => {
              if (res.status == 1) {
                me.$message({
                  type: "success",
                  message: res.msg || "新增成功"
                });
                me.getFieldList();
                me.showFieldDialog = false;
              } else {
                me.$message({
                  type: "error",
                  message: res.msg || "系统错误"
                });
              }
            });
          } else if (me.fieldBehavior == "edit") {
            //修改数据
            post(me, updateColumn, {
              formId: me.formid,
              ...data
            }).then(res => {
              if (res.status == 1) {
                me.$message({
                  type: "success",
                  message: res.msg || "修改成功"
                });
                me.getFieldList();
                me.showFieldDialog = false;
              } else {
                me.$message({
                  type: "error",
                  message: res.msg || "系统错误"
                });
              }
            });
          }
        } else {
          me.$message({
            type: "warning",
            message: "请填写完整信息"
          });
        }
      });
    },
    //获取数据库表的数据源信息
    getTableDetail(id) {
      var me = this;
      console.log(id);
      post(me, getTableInfo, { id }).then(res => {
        if (res.status == "1" && res.content) {
          console.log(res.content);
          var data = res.content;
          me.form.source = data.sourceId;
          me.form.name = data.tableName;
          me.form.othername = data.tableAlias;
          me.isCreate = data.isCreate;
          me.tableDis = data.isCreate == 1 ? false : true;
          if (me.fieldDis && !data.tableAlias) {
            me.form.othername = "空";
          }
          me.formNo = data.number;
        } else {
          me.$message({
            type: "error",
            message: "获取数据失败"
          });
        }
      });
    },
    //获取数据源选择列表
    getDatebaseList() {
      var me = this;
      post(me, getDatabaselist).then(res => {
        if (res.status == "1" && res.content) {
          console.log(res.content);
          me.sources = res.content;
        }
      });
    },
    //获取字段列表
    getFieldList() {
      var me = this;
      post(me, tableFieldlist, {
        formId: me.formid,
        page: me.currentPage,
        pageSize: me.pageSize
      }).then(res => {
        // console.log(res.rows)
        if (res.status == "1" && res.content) {
          var data = res.content;
          console.log(data.rows);
          me.total = data.total;
          me.tableData = data.rows;
        } else {
          me.$message({
            type: "error",
            message: res.message || "获取字段列表失败，请重试！"
          });
        }
        // me.total = res.total
        // me.tableData = res.rows
      });
    },
    //新增模型参数
    addMX() {
      var me = this;
      var arr = me.mxdata || [];
      var obj = {
        name: "",
        value: "",
        id: ""
      };
      arr.push(obj);
      me.mxdata = arr;
    },
    //删除行
    todeleteColumn() {
      var me = this;
    },
    deleteMx(index) {
      console.log(index);
      var me = this;
      var arr = me.mxdata;
      console.log(arr);
      var optionIds = me.optionIds;
      if (arr[index].id) {
        // post(me,)
        console.log(arr[index].id);
        optionIds.push(arr[index].id);
      }
      me.optionIds = optionIds;
      var res = arr.filter((i, k) => {
        return k != index;
      });
      me.mxdata = res;
    },
    //批量删除
    moreDelete() {
      var me = this;
      console.log(me.ids);
      post(me, batchDelete, {
        ids: me.ids
      }).then(res => {
        if (res.status == 1) {
          me.$message({
            type: "success",
            message: res.msg || "删除成功"
          });
        } else {
          me.$message({
            type: "error",
            message: res.msg || "删除失败，请重试"
          });
        }
        me.showColumnDelete = false;
        me.getFieldList();
      });
    },
    //表格上修改中文名
    changeChineseName(e) {
      var me = this;
      console.log(e.target.value, me.temp.chineseName);
      if (e.target.value != me.temp.chineseName) {
        me.changeUpload();
      }
    },
    //表格上修改字段名称
    changeFieldName(e) {
      var me = this;
      console.log(e.target.value, me.temp.fieldName);
      if (e.target.value != me.temp.fieldName) {
        me.changeUpload();
      }
    },
    //表格上修改控件类型
    changeControlType(e) {
      var me = this;
      console.log(e, me.temp.controlType);
      if (e != me.temp.controlType) {
        if (e == "RADIO" || e == "CHECKBOX" || e == "DROPLIST") {
          //当前选择的控件类型为单选、多选、下拉菜单
          me.showMxdialog = true;
          if (
            me.temp.controlType == "RADIO" ||
            me.temp.controlType == "CHECKBOX" ||
            me.temp.controlType == "DROPLIST"
          ) {
            //原控件类型为单选多选下拉
            if (me.temp.options == null || me.temp.options == []) {
              //模型参数为空
              me.msOptions = [
                { name: "", value: "", id: "" },
                { name: "", value: "", id: "" }
              ]; //初始化模型参数
            } else {
              me.msOptions = me.temp.options;
            }
          } else {
            //防止之前模态数据没有删除干净遗留的数据显示
            if (me.temp.options instanceof Array) {
              let datalen = me.temp.options.length;
              let arr = [];
              for (let i = 0; i < datalen; i++) {
                arr.push(me.temp.options[i].id);
              }
              console.log(arr);
              me.mids = arr;
            }
            me.msOptions = [
              { name: "", value: "", id: "" },
              { name: "", value: "", id: "" }
            ]; //初始化模型参数
          }
        } else {
          //如果不选择单选多选下拉的情况
          if (me.temp.options instanceof Array) {
            //清除之前的选项
            console.log(me.temp.options);
            if (me.temp.options.length > 0) {
              let datalen = me.temp.options.length;
              let arr = [];
              for (let i = 0; i < datalen; i++) {
                arr.push(me.temp.options[i].id);
              }
              me.mids = arr;
            }
          }
          me.changeUpload();
        }
      }
    },
    //添加模型参数
    addMSoptions() {
      var me = this;
      console.log(me.msOptions);
      let arr = me.msOptions;
      let obj = { name: "", value: "", id: "" };
      arr.push(obj);
      me.msOptions = arr;
    },
    //确认添加模型参数
    toAddMsoptions() {
      var me = this;
      if (!me.jadgeIsInput(me.msOptions)) {
        me.$message({
          type: "warning",
          message: "请填写完整模型参数"
        });
        return;
      } else {
        me.changeUpload();
      }
    },
    deleteMsOptions(index) {
      console.log(index);
      var me = this;
      var arr = me.msOptions;
      console.log(arr);
      var optionIds = me.mids;
      if (arr[index].id) {
        // post(me,)
        console.log(arr[index].id);
        optionIds.push(arr[index].id);
      }
      me.mids = optionIds;
      var res = arr.filter((i, k) => {
        return k != index;
      });
      me.msOptions = res;
    },
    //表格上修改数据类型
    changeDataType(e) {
      var me = this;
      console.log(e, me.temp.dataType);
      if (e != me.temp.dataType) {
        me.changeUpload();
      }
    },
    //表格上修改数据长度
    changeDatalength(e) {
      var me = this;
      console.log(e.target.value, me.temp.dataLength);
      if (e.target.value != me.temp.dataLength) {
        me.changeUpload();
      }
    },
    //表格上修改精度
    changeDataAccuracy(e) {
      var me = this;
      console.log(e.target.value, me.temp.dataAccuracy);
      if (e.target.value != me.temp.dataAccuracy) {
        me.changeUpload();
      }
    },
    //表格上修改校验规则
    changeVerifyType(e) {
      var me = this;
      if (
        (me.temp.verifyType == null && e != null) ||
        (me.temp.verifyType != null && me.temp.verifyType != e)
      ) {
        me.changeUpload();
      }
    },
    //表格上修改是否必填
    changeRequired(e) {
      var me = this;
      console.log(e, me.temp.required);
      if (e != me.temp.required) {
        me.changeUpload();
      }
    },
    //表格上修改是否显示
    changeDisPlay(e) {
      var me = this;
      console.log(e, me.temp.disPlay);
      if (e != me.temp.disPlay) {
        me.changeUpload();
      }
    },
    //表格上修改样例数据
    changeDataExample(e) {
      var me = this;
      console.log(e.target.value, me.temp.dataExample);
      if (
        (me.temp.dataExample == null && e.target.value != null) ||
        (me.temp.dataExample != null && me.temp.dataExample != e.target.value)
      ) {
        me.changeUpload();
      }
    },
    //表格上修改所在位置
    changePosition(e) {
      var me = this;
      console.log(e.target.value, me.temp.position);
      if (e.target.value != me.temp.position) {
        me.changeUpload();
      }
    },
    //在表格上修改数据的请求
    changeUpload() {
      let me = this;
      let data = {
        id: me.multipleSelection.id,
        chineseName: me.multipleSelection.chineseName,
        fieldName: me.multipleSelection.fieldName,
        controlType: me.multipleSelection.controlType,
        dataType: me.multipleSelection.dataType,
        dataLength: me.multipleSelection.dataLength,
        dataAccuracy: me.multipleSelection.dataAccuracy,
        verifyType: me.multipleSelection.verifyType,
        required: me.multipleSelection.required,
        display: me.multipleSelection.display,
        dataExample: me.multipleSelection.dataExample,
        position: me.multipleSelection.position,
        options: me.msOptions,
        optionIds: me.mids
      };
      post(me, updateColumn, {
        formId: me.formid,
        ...data
      }).then(res => {
        me.selectionClick = false;
        if (res.status == 1) {
          me.$message({
            type: "success",
            message: res.msg || "修改成功"
          });
          me.getFieldList();
          me.showMxdialog = false;
        } else {
          me.$message({
            type: "error",
            message: res.msg || "系统错误"
          });
        }
      });
    }
  },
  watch: {
    "fieldform.controlType": function(val) {
      var me = this;
      var old = me.oldcontrolType;
      //    如果原数据的控件类型是单选、多选、下拉框，而现选择的控件类型不是单选、多选或者下拉框，需清除原数据中的数据模型
      if (
        (old == "RADIO" || old == "CHECKBOX" || old == "DROPLIST") &&
        !(val == "RADIO" || val == "CHECKBOX" || val == "DROPLIST") &&
        me.mxdata.length > 0
      ) {
        var optionIds = [];
        for (let i = 0; i < me.mxdata.length; i++) {
          optionIds.push(me.mxdata[i].id);
        }
        console.log(optionIds);
        me.optionIds = optionIds;
      } else {
        me.optionIds = [];
      }
      //如果当前选择控件类型是单选、多选、下拉框
      if (val == "RADIO" || val == "CHECKBOX" || val == "DROPLIST") {
        //且原数据的控件类型也为单选、多选、下拉框
        if (old == "RADIO" || old == "CHECKBOX" || old == "DROPLIST") {
          me.mxdata = me.oldoptions;
        } else {
          //原数据的控件类型不为单选、多选、下拉框
          console.log("change", 2);
          me.mxdata = [
            { name: "", value: "", id: "" },
            { name: "", value: "", id: "" }
          ];
          me.mxShow = true;
        }
      } else {
        me.mxShow = false;
        me.mxdata = [];
        me.fieldform.options = [];
      }
    },
    showFieldDialog: function(val) {
      var me = this;
      if (val == false) {
        //模态框关闭后清空所有校验、删除的模型参数、暂缓的数据库控件类型、暂缓的数据库模型参数
        //以便下一个字段的修改，不会导致数据重叠、混乱
        this.$refs["fieldform"].clearValidate();
        me.optionIds = [];
        me.oldcontrolType = "";
        me.oldoptions = [];
      }
      me.getFieldList();
    },
    showMxdialog: function(val) {
      var me = this;
      if (val === false) {
        me.msOptions = [];
        me.getFieldList();
      }
    },
    "form.source": function(val) {
      if (val) {
        this.$refs["form"].clearValidate();
      }
    }
  }
};
</script>
<style>
.two {
  display: flex;
  flex-direction: row;
}
.table-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  position: relative;
}
.table-fun {
  position: absolute;
  right: 0px;
}
.tableInput > .el-input__inner {
  border: 1px solid #fff !important;
  padding: 0 !important;
}
</style>