<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单配置 / 表单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>表单列表</div>
            <div class="table-wrapper">
                <el-input v-model="condition.name" placeholder="表单名称" style="width: 200px;"></el-input>
                <div style="margin-left: 10px;">
                    <el-date-picker type="date" placeholder="开始时间" v-model="condition.startDate" style="width: 130px;margin-right: 10px;"></el-date-picker>
                    <span> - </span>
                    <el-date-picker type="date" placeholder="结束时间" v-model="condition.endDate" style="width: 130px;margin-left:10px;"></el-date-picker>
                </div>
                <el-select v-model="condition.state" style="width: 120px;margin-left: 10px;" placeholder="使用状态">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <div class="table-fun">
                    <el-button type="primary" style="width: 80px;" @click='getTableData'>查询结果</el-button>
                    <el-button style="width: 80px;margin-left: 10px;" @click='resetCondition'>重置</el-button>
                </div>
            </div>
            <div class="table-wrapper">
                <el-button type="primary" style="width: 80px;" @click="showTableAdd = true"><i class="el-icon-lx-text"></i>  新增</el-button>
                <!-- <el-button type="primary" style="width: 80px;">导入</el-button> -->
                <div class="table-fun">
                    <!-- <el-select v-model="condition.row" style="width: 120px;" placeholder="显示条数">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select> -->
                    <el-select v-model="condition.rank" style="width: 120px;margin-left: 10px;" placeholder="排序方式">
                        <el-option
                        v-for="item in ranks"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    size='medium'
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    label="序号"
                    type="index"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="表单名称"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="number"
                    label="编号"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="content"
                    label="描述"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="state"
                    label="当前状态"
                    width="120">
                      <template slot-scope="scope">
                          <span>{{scope.row.state == 1?options[0].label:options[1].label}}</span>
                          <!-- <span>{{scope}}</span> -->
                      </template>
                    </el-table-column>
                      
                    <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="200">
                      <template slot-scope="scope">
                          <span>{{formatDate(scope.row.createTime, "yy-mm-dd hh:mm:ss")}}</span>
                          <!-- <span>{{scope}}</span> -->
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align='right'>
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handleSee(scope.$index, scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[20, 10, 5]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="margin-top: 10px;">
                </el-pagination>
            </div>

            <!-- 删除提示 -->
                <el-dialog
                title='提示'
                :visible.sync="showTableDelete"
                :modal="true"
                width="400px"
                >
                    <span>删除后无法恢复，您是否确定删除当前表？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showTableDelete = false">取 消</el-button>
                        <el-button type="primary" @click="todeleteTable">确 定</el-button>
                    </span>
                </el-dialog>

            <el-dialog
                title='新增表单'
                :visible.sync="showTableAdd"
                :modal="true"
                width="540"
            >
                <el-form ref="form" :rules="formRules" :model="form" label-width="100px">
                    <el-form-item label='表单标题' prop="name">
                      <el-input placeholder="表单标题长度为1-20个字符" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="表单描述" prop="content">
                        <el-input 
                        type="textarea"
                        :rows="6"
                        placeholder="请输入内容"
                        v-model="form.content">
                        </el-input>
                    </el-form-item>
                    <el-form-item label='表单分类' prop='category'>
                        <el-input placeholder="表单分类长度为1-20个字符"  v-model="form.category"></el-input>
                    </el-form-item>
                    <el-form-item label='上传附件'>
                        <el-upload
                        class="upload-demo"
                        action="fakeaction"
                        :limit='1'
                        :on-exceed='isExceed'
                        :before-remove='beforeRemoveFile'
                        :http-request="uploadSectionFile">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传word/pdf文件，且不超过5M。</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showTableAdd = false">取 消</el-button>
                    <el-button type="primary" @click="addTableManage">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        
    </div>
</template>
<script>
import { post, uploadFile } from "../../util/http.js";
import { formTable, addTable, deteleTable } from "../../util/api.js";
import { timestamp, timestampYMD } from "../../util/date.js";
export default {
  data() {
    return {
      showTableDelete: false, //删除模态框显隐
      upload: null,
      deleteid: null, //删除表的id
      fileList: [], //上传的数据
      currentPage: 1, //当前页面
      pageSize: 20, //每页条数
      showTableAdd: false, //新增表单对话框
      total: 10, //数据总数
      addTable: "",
      //条件
      condition: {
        name: "",
        startDate: "",
        endDate: "",
        state: "",
        row: "",
        rank: ""
      },
      //状态选择
      options: [
        {
          value: 1,
          label: "未使用"
        },
        {
          value: 2,
          label: "已使用"
        }
      ],
      ranks: [
        {
          value: "name",
          label: "表单名称"
        },
        {
          value: "number",
          label: "编号"
        },
        {
          value: "content",
          label: "描述"
        },
        {
          value: "state",
          label: "状态"
        },
        {
          value: "create_time",
          label: "创建时间"
        }
      ],
      multipleSelection: [],
      //表单列表
      tableData: [
        {
          name: "表单名字文字",
          number: "9144010169",
          content: "描述1",
          state: 1,
          createTime: "2020-08-25 14:54:32"
        },
        {
          name: "表单名字文字",
          number: "9144010169",
          content: "描述2",
          state: 1,
          createTime: "2020-08-25 14:54:32"
        },
        {
          name: "表单名字文字",
          number: "9144010169",
          content: "描述3",
          state: 1,
          createTime: "2020-08-25 14:54:32"
        },
        {
          name: "表单名字文字",
          number: "9144010169",
          content: "描述4",
          state: 2,
          createTime: "2020-08-25 14:54:32"
        }
      ],
      //新增表单字段
      form: {
        name: "",
        content: "",
        category: ""
      },
      formRules: {
        name: [
          { required: true, message: "请输入表单标题", trigger: "blur" },
          {
            validator(rule, value, callback) {
              // let f = new RegExp("^[0-9_]+");
              // let reg = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");
              let reg2 = new RegExp("^.{1,20}$");
              // if (f.test(value)) {
              //   callback(new Error("表名不能以数字或下划线开头"));
              // } else if (!reg.test(value)) {
              //   callback(new Error("表名必须为数字、字母或下划线组成"));
              // } else 
              if (!reg2.test(value)) {
                callback(new Error("表单标题长度为1-20个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        category: [
          { required: true, message: "请输入表单分类", trigger: "blur" },
          {
            validator(rule, value, callback) {
              let reg = new RegExp("^.{1,20}$");
              if (!reg.test(value)) {
                callback(new Error("表单分类长度为1-20个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      names: [
        {
          value: 0,
          label: "xxx"
        },
        {
          value: 1,
          label: "xxx"
        }
      ]
    };
  },
  mounted() {
    this.getTableData();
    this.addTable = addTable;
  },
  methods: {
    //选中表单
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑表单
    handleEdit(index, row) {
      console.log(index, row);
      this.$router.push({
        path: "/generte",
        query: { from: "edit", id: row.id, state: row.state}
      });
    },
    //删除表单
    handleDelete(index, row) {
      console.log(index, row);
      var me = this;
      me.deleteid = row.id;
      me.showTableDelete = true;
    },
    //删除方法
    todeleteTable() {
      var me = this;
      if (!me.deleteid) {
        return;
      }
      post(me, deteleTable, {
        id: me.deleteid
      }).then(res => {
        console.log(res);
        if (res.status == 1) {
          me.$message({
            type: "success",
            message: res.msg || "删除成功"
          });
          me.showTableDelete = false;
          me.getTableData();
        }
      });
    },
    //覆盖默认上传的方法
    uploadSectionFile(params) {
      var me = this;
      const file = params.file,
        fileType = file.type;
      const form = new FormData();
      form.append("file", file);
      this.upload = form;
    },
    //查看表单
    handleSee(index, row) {
      console.log(index, row);
      this.$router.push({
        path: "/generte",
        query: { from: "see", id: row.id }
      });
    },
    //更改页面条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getTableData();
    },
    //更改当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTableData();
    },
    handleExceed() {
      this.$message({
        type: "error",
        message: "只能上传一个文件"
      });
    },
    //新增表单
    addTableManage() {
      console.log("新增");
      var me = this;
      me.$refs.form.validate(res => {
        if (res) {
          //校验成功
          var upload = me.upload;
          console.log(upload);
          if (upload == null) {
            me.$message({
              type: "error",
              message: "请上传文件"
            });
          } else {
            upload.append("name", me.form.name);
            upload.append("category", me.form.category);
            upload.append("content", me.form.content);
            uploadFile(me, addTable, upload).then(res => {
              console.log(res);
              if (res.status == "1" && res.content) {
                me.$router.push({
                  path: "/generte",
                  query: { from: "add", id: res.content, state: 1 }
                });
              } else {
                me.$message({
                  type: "error",
                  message: res.msg || "文件上传失败"
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
    //获取列表数据
    getTableData() {
      var me = this;
      var startTime = me.condition.startDate
        ? timestampYMD(me.condition.startDate) + " 00:00:00"
        : "";
      var endTime = me.condition.endDate
        ? timestampYMD(me.condition.endDate) + " 23:59:59"
        : "";
      if ((startTime && !endTime) || (!startTime && endTime)) {
        me.$message({
          type: "warning",
          message: "请完善搜索信息"
        });
        return;
      }
      var name = me.condition.name ? me.condition.name : "";
      var state = me.condition.state ? me.condition.state : "";
      var rank = me.condition.rank ? me.condition.rank : "";
      post(me, formTable, {
        page: me.currentPage,
        pageSize: me.pageSize,
        name,
        state,
        startTime,
        endTime,
        orderBy: rank
      }).then(res => {
        if (res.status == "1" && res.content) {
          var content = res.content;
          console.log(content);
          me.tableData = content.rows;
          this.total = content.total;
        } else {
          me.$message({
            type: "error",
            message: "获取数据失败"
          });
        }
      });
    },

    //重置搜索条件
    resetCondition() {
      var me = this;
      me.condition = {
        name: "",
        startDate: "",
        endDate: "",
        state: "",
        row: "",
        rank: ""
      };
      me.getTableData();
    },
    //规范化日期
    formatDate(value, format) {
      // console.log(value, format)
      return timestamp(value, format);
    },
    isExceed() {
      var me = this;
      me.$alert(
        "只能上传一个word/pdf文件，如需重新上传请删除原来的文件之后再上传对应文件",
        "提示",
        {
          confirmButtonText: "确定"
        }
      );
    },
    beforeRemoveFile(file, fileList) {
      console.log(file, fileList);
      var me = this;
      me.upload = new FormData();
    }
  },
  watch: {
    "condition.rank": function(val) {
      // console.log(val)
      // this.page = 1
      this.getTableData();
    },
    showTableAdd: function(val) {
      var me = this;
      if (val == false) {
        me.$refs["form"].clearValidate();
      }
    }
  }
};
</script>
<style >
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
.el-upload--text {
  width: auto !important;
  height: auto !important;
  border: 0px;
}
</style>
