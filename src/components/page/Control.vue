<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单配置 / 控件管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>控件管理</div>
            <div class="table-wrapper">
                <el-button type="primary"  style="width: 80px;"><i class="el-icon-lx-add"></i> 新增</el-button>
                <el-button type="primary"  style="width: 80px;margin-left: 10px;"> 导入</el-button>
                <el-button type="primary"  style="width: 80px;margin-left: 10px;"> 修改控件</el-button>
                <el-button type="primary"  style="width: 80px;margin-left: 10px;"> 修改状态</el-button>
                <div class="table-fun">
                     <el-select v-model="condition.article" style="width: 120px;" placeholder="显示条数">
                        <el-option
                        v-for="item in articles"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="condition.arrangement" style="width: 120px;margin-left:10px;" placeholder="排序方式">
                        <el-option
                        v-for="item in arrangements"
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
                    label="控件名称"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="number"
                    label="控件编号"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="lineheight"
                    label="行高"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="columnwidth"
                    label="列宽"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="color"
                    label="颜色"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="note"
                    label="备注信息"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    width="180">
                    </el-table-column>
                    <el-table-column label="操作" align='right'>
                        <template slot-scope="scope">
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
                :current-page.sync="currentPage"
                :page-size="100"
                layout="prev, pager, next, jumper"
                :total="1000"
                style="margin-top: 10px;">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage: 1,//当前页数
      //搜索条件
      condition: {
        article: "",
        arrangement: "" //排列方式
      },
      //显示条数
      articles: [
        {
          value: "0",
          label: "10"
        },
        {
          value: "1",
          label: "20"
        }
      ],
      //排序方式
      arrangements: [
        {
          value: 0,
          label: "升序"
        },
        {
          value: 1,
          label: "降序"
        }
      ],
      //表单数据
      tableData: [
        {
          name: "表单名字文字",
          number: "9144010169",
          lineheight: "30",
          columnwidth: "200",
          color: '红色',
          note: '无',
          updateTime: "2020-08-25 14:54:32"
        },
        {
          name: "表单名字文字",
          number: "9144010169",
          lineheight: "30",
          columnwidth: "200",
          color: '红色',
          note: '无',
          updateTime: "2020-08-25 14:54:32"
        },
        {
          name: "表单名字文字",
          number: "9144010169",
          lineheight: "30",
          columnwidth: "200",
          color: '红色',
          note: '无',
          updateTime: "2020-08-25 14:54:32"
        },
        {
          name: "表单名字文字",
          number: "9144010169",
          lineheight: "30",
          columnwidth: "200",
          color: '红色',
          note: '无',
          updateTime: "2020-08-25 14:54:32"
        }
      ]
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
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