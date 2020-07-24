<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 表单配置 / 数据源管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div>数据源管理</div>
      <div class="table-wrapper">
        <el-input v-model="condition.keyword" placeholder="请输入关键字进行搜索" style="width: 500px;">
          <el-button slot="append" icon="el-icon-search" type="primary" @click="selectDatabase" style="background:##409EFF;">搜索</el-button>

          <!-- <el-button type="primary" icon="el-icon-search"  @click="selectDatabase">搜索</el-button> -->

        </el-input>
        <div class="table-fun">
          <el-button type="primary" style="width: 80px;" @click="connnectDatabase">
            <i class="el-icon-sort"></i> 连接
          </el-button>
          <el-button type="primary" style="width: 80px;" @click="addDatabaseclick">
            <i class="el-icon-lx-add"></i> 创建
          </el-button>
          <!-- <el-button type="primary" style="width: 80px;" @click="editDatabase"><i class="el-icon-edit-outline"></i>  编辑</el-button> -->
          <el-button type="primary" style="width: 80px;" @click="beforeDeleteDatabase">
            <i class="el-icon-circle-close"></i> 删除
          </el-button>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          min-height="250"
          border
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          :cell-style="setRowStyle"
          size="medium"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="70"></el-table-column>
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column prop="name" label="数据源名称" width="150"></el-table-column>
          <el-table-column prop="type" label="类型" width="100"></el-table-column>
          <el-table-column prop="url" label="链接地址"></el-table-column>
          <el-table-column prop="userName" label="用户名" width="150"></el-table-column>
          <el-table-column prop="password" label="密码" width="120"></el-table-column>
          <el-table-column label="操作" align="right" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="editDatabase(scope.$index, scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
          style="margin-top: 30px;"
        ></el-pagination>

      </div>
      <el-dialog :title="title" :visible.sync="showDatabaseAdd" :modal="true" width="400px" center>
        <el-form
          ref="form"
          :model="form"
          label-width="130px"
          label-position="left"
          :rules="formRules"
        >
          <el-form-item label="数据源名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <!-- <el-input v-model="form.type" placeholder="请输入" style="width: 200px;"></el-input> -->
            <el-select v-model="form.type" placeholder="请选择" style="width: 200px;">
              <el-option v-for="(i,k) in types" :key="k" :value="i" :label="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-input v-model="form.url" placeholder="请输入" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入" style="width: 200px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDatabaseAdd = false">取 消</el-button>
          <el-button type="primary" @click="addDatabase">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="showDatabaseDelete" :modal="false" width="400px">
        <span>删除后无法恢复，您是否确定删除选中数据源？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDatabaseDelete = false">取 消</el-button>
          <el-button type="primary" @click="deleteDatabase">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { post } from "../../util/http.js";
import {
  addDatebase,
  getDatabasePage,
  deleteDatabase,
  contentdatabase
} from "../../util/api.js";

export default {
  data() {
    return {
      currentPage: 1, //当前页面
      pageSize: 10, //每页条数
      total: 0, //数据总数
      formtype: 0, //判断是添加还是编辑
      ids: [], //删除的数组
      //搜索条件
      condition: {
        keyword: ""
      },
      multipleSelection: [],
      showDatabaseAdd: false, //添加数据源对话框
      showDatabaseDelete: false, //确认删除数据源对话框
      currentPage: 1, //当前页
      //添加数据
      form: {
        id: "",
        name: "",
        type: "",
        url: "",
        userName: "",
        password: ""
      },
      //数据源类型
      types: ["Mysql", "Oracle"],
      //表单数据
      tableData: [
        {
          id: "1",
          name: "mysql",
          type: "Oracle",
          url: "localhost:3306/godb?charset=utf8",
          userName: "gouser",
          password: "123456"
        },
        {
          id: "2",
          name: "mysql",
          type: "Oracle",
          url: "localhost:3306/godb?charset=utf8",
          userName: "gouser",
          password: "123456"
        },
        {
          id: "3",
          name: "mysql",
          type: "Mysql",
          url: "localhost:3306/godb?charset=utf8",
          userName: "gouser",
          password: "123456"
        },
        {
          id: "4",
          name: "mysql",
          type: "Mysql",
          url: "localhost:3306/godb?charset=utf8",
          userName: "gouser",
          password: "123456"
        }
      ],
      formRules: {
        name: [
          { required: true, message: "请输入数据源名称", trigger: "blur" }
        ],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        url: [{ required: true, message: "请输入链接", trigger: "blur" }],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    document.querySelector(".content-box>.content").scrollTo(0, 0);
    this.getDatabasePageList();
  },
  computed: {
    title() {
      return this.formtype == 0 ? "新增数据源" : "编辑数据源";
    }
  },
  methods: {
    // 设置表格内容居中
    setHeaderStyle() {
      return "text-align:center";
    },
    setRowStyle() {
      return "text-align:center";
    },

    //选择某一列
    handleSelectionChange(val) {
      this.multipleSelection = val;
      var me = this;
      var arr = [];
      for (var i = 0; i < val.length; i++) {
        arr.push(val[i].id);
      }
      me.ids = arr;
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      var me = this;
      me.currentPage = val;
      me.getDatabasePageList();
    },
    //搜索数据源
    selectDatabase() {
      var me = this;
      me.currentPage = 1;
      me.getDatabasePageList();
    },
    //创建数据源
    addDatabase() {
      let me = this;
      this.$refs.form.validate(res => {
        if (res) {
          me.toAddorChangeDatabase();
        } else {
          me.$message({
            type: "warning",
            message: "请填写完整信息"
          });
        }
      });
    },
    //保存数据源
    toAddorChangeDatabase() {
      var me = this;
      var data = me.form;
      post(me, addDatebase, {
        ...data
      }).then(res => {
        if (res.status == "1") {
          me.$message({
            type: "success",
            message: res.msg || "新增成功"
          });
          me.getDatabasePageList();
          me.showDatabaseAdd = false;
        } else {
          me.$message({
            type: "error",
            message: res.msg || "新增失败，请重试"
          });
        }
      });
    },
    //创建新的数据源
    addDatabaseclick() {
      this.showDatabaseAdd = true;
      this.formtype = 0;
      this.form = {
        name: "",
        type: "",
        url: "",
        userName: "",
        password: ""
      };
    },
    //编辑数据表
    editDatabase(index, row) {
      var me = this;
      console.log(index, row);
      this.formtype = 1;
      this.form = row;
      me.showDatabaseAdd = true;
    },
    //查看是否已选中数据源
    beforeDeleteDatabase() {
      console.log("删除数据源");
      var me = this;
      if (me.multipleSelection.length == 0) {
        me.$message({
          type: "warning",
          message: "请选择对应数据源"
        });
      } else {
        me.showDatabaseDelete = true;
      }
    },
    //删除数据源
    deleteDatabase() {
      var me = this;
      var ids = me.ids;
      post(me, deleteDatabase, { ids }).then(res => {
        if (res.status == "1") {
          me.$message({
            type: "success",
            message: res.msg || "删除成功"
          });
        } else {
          me.$message({
            type: "error",
            message: res.msg || "删除失败,请重试"
          });
        }
        me.getDatabasePageList();
      });
      me.showDatabaseDelete = false;
    },
    //链接数据源
    connnectDatabase() {
      var me = this;
      var ids = me.ids;
      if (ids.length > 1) {
        me.$message({
          type: "warning",
          message: "只能链接单条链接"
        });
        return;
      } else {
        post(me, contentdatabase, {
          ids
        }).then(res => {
          if (res.status == "1") {
            me.$message({
              type: "success",
              message: res.msg || "连接成功"
            });
          } else {
            me.$message({
              type: "success",
              message: res.msg || "系统错误"
            });
          }
        });
        // me.$message({
        //   showClose: true,
        //   message: "连接成功",
        //   type: "success"
        // });
      }
      // me.$message({
      //   showClose: true,
      //   message: '链接失败',
      //   type: 'error'
      // });
    },
    getDatabasePageList() {
      var me = this;
      post(me, getDatabasePage, {
        page: me.currentPage,
        pageSize: me.pageSize,
        keyword: me.condition.keyword ? me.condition.keyword : ""
      }).then(res => {
        console.log(res);
        if (res.status == "1" && res.content) {
          me.tableData = res.content.rows;
          me.total = res.content.total;
        } else {
          me.$message({
            type: "success",
            message: res.msg || "获取数据失败"
          });
        }
      });
    }
  }
};
</script>
<style>
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
</style>