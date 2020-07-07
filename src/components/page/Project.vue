<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 项目管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
</template>

<script>
    import ProductTable from '../common/ProductTable';

    export default {
        name: 'basetable',
        data() {
            return {
                loading:true,
                tableData: [],
                page:1,
                limit:10,
                dialogFormVisible: false,
                goodsId:'',
            }
        },
        created() {
            // this.productListData();
        },
        components:{
            ProductTable
        },
        computed: {
           
        },
        methods: {
            productListData(isUpdateUserLevel,goodsName){   //请求商品数据
                this.$axios('/shop/goods/list',{
                    "page":this.page,
                    "limit":this.limit,
                    "isUpdateUserLevel":isUpdateUserLevel,
                    "goodsName":goodsName
                }).then(res=>{
                    this.loading = false;
                    res.data.page.list.map((item,index)=>{
                        item.yongjin = (item.goodsPrice * (item.commission/100)).toFixed(2); 
                        item.goodsListImg = item.goodsListImg.split(",");
                    })
                    this.tableData = res.data.page.list;
                }).catch(err=>{
                    console.log(err);
                })
            },
            deleteproductfunc(goodsId){                        //删除商品
                let arr = [];
                arr.push(goodsId);

                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/shop/goods/delete',[
                    goodsId
                    ]).then(res=>{
                        console.log(res);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        location.reload();
                    }).catch(err=>{
                        console.log(err);
                    })
                }).catch(() => {

                }); 
            },
            productExitfunc(goodsId){
                this.dialogFormVisible = true;
                this.goodsId = goodsId;
            },
            getData(data){
                this.dialogFormVisible = data;
            }
        }
    }

</script>

<style scoped>
   .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
