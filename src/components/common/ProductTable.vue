<template>
    <div>
        <el-dialog 
            v-loading.fullscreen.lock="fullscreenLoading"
            title="编辑商品" 
            :visible.sync="dialogFormVisible" 
            :close-on-click-modal="closemodal" 
            :show-close="showClose"
            width="1200px"
            @opened="openeddialog">
            <el-form :model="form">
              <el-form-item label="商品编号：" :label-width="formLabelWidth">
                <el-input v-model="form.goodsNo" autocomplete="off" clearable placeholder="请输入商品编号" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item label="商品名称：" :label-width="formLabelWidth">
                <el-input v-model="form.goodsName" autocomplete="off" clearable placeholder="请输入商品名称" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item label="商品介绍：" :label-width="formLabelWidth">
                <el-input v-model="form.goodsBrief" autocomplete="off" clearable placeholder="请输入商品介绍" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item label="商品零售价：" :label-width="formLabelWidth">
                <el-input v-model="form.goodsPrice" autocomplete="off" clearable placeholder="请输入商品零售价" style="width: 250px">
                    <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="商品体验价：" :label-width="formLabelWidth">
                <el-input v-model="form.experientialPrice" autocomplete="off" clearable placeholder="请输入商品体验价" style="width: 250px">
                    <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="商品成本价：" :label-width="formLabelWidth">
                <el-input v-model="form.costPrice" autocomplete="off" clearable placeholder="请输入商品成本价" style="width: 250px">
                    <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="商品库存：" :label-width="formLabelWidth">
                <el-input v-model="form.goodsInventory" autocomplete="off" clearable placeholder="请输入商品库存" style="width: 250px">
                    <template slot="append">件</template>
                </el-input>
              </el-form-item>
              <el-form-item label="佣金比例：" :label-width="formLabelWidth">
                <el-input v-model="form.commission" autocomplete="off" clearable placeholder="请输入佣金比例" style="width: 250px">
                    <template slot="append">%</template>
                </el-input>
                <span style="margin-left: 5px;">(佣金：{{ yongjin }}元)</span>
              </el-form-item>
              <el-form-item label="快递费用：" :label-width="formLabelWidth">
                <el-input v-model="form.shippingFee" autocomplete="off" clearable placeholder="请输入快递费用" style="width: 250px">
                    <template slot="append">元</template>
                </el-input>
                <span style="color:red; margin-left: 5px;">( 提示：尽管该商品为包邮,请不要把快递费用设置为0元 )</span>
              </el-form-item>
              <el-form-item label="是否包邮：" :label-width="formLabelWidth">
                <el-radio v-model="form.isShipping" label="1">是</el-radio>
                <el-radio v-model="form.isShipping" label="0">否</el-radio>
              </el-form-item>
              <el-form-item label="是否为升级商品：" :label-width="formLabelWidth">
                <el-select v-model="form.isUpdateUserLevel">
                  <el-option label="普通商品" value="1"></el-option>
                  <el-option label="升级为分享达人" value="2"></el-option>
                  <el-option label="升级为超级达人" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品封面图：" :label-width="formLabelWidth">
                <template>
                    <el-upload
                        class="upload-demo"
                        action="https://app.zhiwuxuanlv.com/upload"                                                                                                                                                                             
                        :headers="headers"
                        accept="file"
                        :limit="goodsImg.limit"
                        :multiple="goodsImg.multiple"
                        :on-success="goodsImghandleSuccess"
                        :file-list="goodsImg.fileList"
                        :on-exceed="handleexceed"
                        :on-remove="goodsImghandleremove"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb<br/><span style="color: red; margin-left: 5px;">(如上传错图片，请删除以下图片在重新上传)</span></div>
                    </el-upload>
                </template>
              </el-form-item>
              <el-form-item label="商品轮播图：" :label-width="formLabelWidth">
                <template>
                    <el-upload
                        class="upload-demo"
                        action="https://app.zhiwuxuanlv.com/upload"                                                                                                                                                                             
                        :headers="headers"
                        accept="file"
                        :limit="bannerupload.bannerlimit"
                        :multiple="bannerupload.bannermultiple"
                        :on-success="handleSuccess"
                        :file-list="bannerupload.bannerList"
                        :on-exceed="handleexceed"
                        :on-error="handleonerror"
                        :on-remove="handleremove"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb<br/><span style="color: red; margin-left: 5px;">(如上传错图片，请删除以下图片在重新上传)</span></div>
                    </el-upload>
                </template>
              </el-form-item>
              <el-form-item>
                <template>
                    <el-table :data="specificationtableData" :border="specificationtableboder" style="width: 80%; margin:auto; display: block;">
                        <el-table-column prop="specificationId" label="商品编码" align="center">
                            <template slot-scope="props">
                                <el-input
                                    clearable
                                    v-model="props.row.specificationId"
                                    class="elInput">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="imgUrl" label="商品图片" align="center">
                            <template slot-scope="props">
                                <img :src="['https://app.zhiwuxuanlv.com'+props.row.imgUrl]" alt="" style="width: 60px;height: 60px" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="参数" align="center">
                            <template slot-scope="props">
                                <el-input
                                    clearable
                                    v-model="props.row.value"
                                    class="elInput">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsPrice" label="价格" align="center">
                            <!-- <template slot-scope="scope">
                                {{scope.row.goodsPrice + '元'}}
                            </template> -->
                            <template slot-scope="props">
                                <el-input
                                    clearable
                                    v-model="props.row.goodsPrice"
                                    class="elInput">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="experientialPrice" label="体验价" align="center">
                            <!-- <template slot-scope="scope">
                                {{scope.row.experientialPrice + '元'}}
                            </template> -->
                            <template slot-scope="props">
                                <el-input
                                    clearable
                                    v-model="props.row.experientialPrice"
                                    class="elInput">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsInventory" label="库存" align="center">
                            <!-- <template slot-scope="scope">
                                {{scope.row.goodsInventory + '件'}}
                            </template> -->
                            <template slot-scope="props">
                                <el-input
                                    clearable
                                    v-model="props.row.goodsInventory"
                                    class="elInput">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="props">
                                <el-button-group>
                                    <el-button type="primary" icon="el-icon-delete" @click="deletespecificationData(props.row.id)">删除规格</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeVisible">取 消</el-button>
              <el-button type="primary" @click="submitformdata">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'ProductTable',
        props:['dialogFormVisible','goodsId'],
        data() {
            return {
                specificationtableData: [],    //规格数据
                specificationtableboder:true,  //表格边框
                fullscreenLoading: false,
                closemodal: false,             //点击遮罩层是否关闭        
                showClose: false,              //是否显示关闭按钮      
                form: {
                    goodsNo: '',                //商品编号
                    goodsName: '',              //商品名称
                    goodsBrief: '',             //商品介绍
                    goodsPrice: '',             //商品价格
                    experientialPrice: '',      //商品体验价
                    costPrice: '',              //商品成本价
                    goodsInventory: '',         //商品库存数
                    commission: '',             //商品佣金
                    isUpdateUserLevel: '1',     //商品是否为升级商品 1普通商品 2升级为分享达人 3升级为超级达人
                    isShipping:'1',             //商品是否包邮 1是 0否
                    shippingFee:'15',           //商品快递费用
                },
                specificationform:{             //规格表单
                    goodsNo: '',                //商品编号
                    value: '',                  //商品参数
                    goodsPrice: '',             
                    experientialPrice: '',
                    goodsInventory: '',
                },
                formLabelWidth: '180px',
                // productDetailData:'',               //商品详情
                headers:{                           //设置图片上传的请求头
                    'token':localStorage.getItem('token')
                },
                goodsImg:{                          //封面图上传图片
                    limit:1,                        //设置上传图片的张数
                    fileList: [],                   //上传封面图的列表
                    multiple:false,                 //选择文件是否支持多选文件
                    type:"封面图"
                },
                bannerupload:{                      //轮播图上传图片
                    bannerlimit:6,                  //设置轮播图上传图片的张数
                    bannerList: [],                 //上传轮播图片的列表
                    bannermultiple:false,           //选择文件是否支持多选文件
                    type:"轮播图"
                },
            }
        },
        watch: {
            'form.isUpdateUserLevel':{          //监听对象里的某个属性
                handler: function(val) {
                    console.log("我是监听是否为升级产品"+val)
                },
            }
        },
        methods: {
            //删除规格
            deletespecificationData(id){
                console.log(id)
                if(this.specificationtableData.length == 1){
                    this.$message.error('至少有一个规格');
                }else if(this.specificationtableData.length!==0){
                    for(var i in this.specificationtableData){
                        if(id === this.specificationtableData[i].id){
                            this.specificationtableData.splice(i,1);
                        }
                    }
                }
            },
            //点击取消
            closeVisible(){
                this.$emit("senndData",!this.dialogFormVisible);
            },
            //点击提交
            submitformdata(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                this.$axios.post("/shop/goods/update",
                    {
                        "commission": this.form.commission,
                        "costPrice": this.form.costPrice,
                        "experientialPrice": this.form.experientialPrice,
                        "goodsBrief": this.form.goodsBrief,
                        "goodsDetail": '',
                        "goodsId": this.goodsId,
                        "goodsImg": this.goodsImg.fileList.length!==0?this.goodsImg.fileList[0].url:"",
                        "goodsInventory": this.form.goodsInventory,
                        "goodsListImg": this.goodsListImg,
                        "goodsName": this.form.goodsName,
                        "goodsNo": this.form.goodsNo,
                        "goodsPrice": this.form.goodsPrice,
                        "goodsSpecificationList": this.specificationtableData,
                        "isOnSale": 1,
                        "isShipping": this.form.isShipping,
                        "isUpdateUserLevel": this.form.isUpdateUserLevel,
                        "shippingFee": this.form.shippingFee,
                    }
                ).then((res)=>{
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    loading.close();
                    location.reload();
                }).catch((err)=>{
                    loading.close();
                })
                this.$emit("senndData",!this.dialogFormVisible);
            },
            // openFullScreen() {       
            //     this.fullscreenLoading = true;
            //     setTimeout(() => {
            //         this.fullscreenLoading = false;
            //     }, 2000);
            // },

            //请求商品详情信息和商品规格信息
            openFullScreen() {
                const that = this;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.$axios("/shop/goods/info/"+this.goodsId)
                .then((res=>{
                    var res = res.data.data;
                    that.form.goodsNo = res.goodsNo;
                    that.form.goodsName = res.goodsName;
                    that.form.goodsBrief = res.goodsBrief;
                    that.form.goodsPrice = res.goodsPrice;
                    that.form.experientialPrice = res.experientialPrice;
                    that.form.costPrice = res.costPrice;
                    that.form.goodsInventory = res.goodsInventory;
                    that.form.commission = res.commission;
                    that.form.isUpdateUserLevel = res.isUpdateUserLevel.toString();
                    that.form.isShipping = res.isShipping.toString();
                    that.goodsImg.fileList=[{name: '封面图', url: res.goodsImg}]; 
                    const goodsListImgArr = res.goodsListImg.split(",");
                    const arr = [];
                    for(let item of goodsListImgArr){ arr.push({name:'轮播图', url:item}) };
                    that.bannerupload.bannerList = arr;
                    // 上面是处理商品详情
                    // 下面是处理商品规格
                    that.$axios("/shop/goods/info/"+this.goodsId+"/specification")
                    .then(specification=>{
                        that.specificationtableData = specification.data.data;
                        loading.close();
                    }).catch((err)=>{
                        loading.close();
                    })
                })).catch((err=>{
                    loading.close();
                }))
            },
            openeddialog(){                             //监听打开dialog事件
                this.openFullScreen();
            },
            //轮播图上传成功回调
            handleSuccess(response, file, fileList){
                this.bannerupload.bannerList.push({name: file.name, url:"https://app.zhiwuxuanlv.com"+response.url})
            },
            //轮播图移除文件回调
            handleremove(file, fileList){    
                for(let i in this.bannerupload.bannerList){
                    if(file.url === this.bannerupload.bannerList[i].url){
                        this.bannerupload.bannerList.splice(i,1);
                    }
                }
            },
            //封面图上传成功回调
            goodsImghandleSuccess(response, file, fileList){
                this.goodsImg.fileList = [{name: file.name, url:"https://app.zhiwuxuanlv.com"+response.url}]
            },
            //封面图移除文件回调
            goodsImghandleremove(file, fileList){
                this.goodsImg.fileList.splice(0,1)
            },
            handleonerror(err, file, fileList){         //文件上传失败时的钩子
                this.$message.error('上传失败！');
            },
            handleexceed(files, fileList){              //文件超出个数限制时的钩子
                this.$message.error('上传的图片超出数量!');
            },
            
        },
        computed: {
            yongjin(){
                return (this.form.goodsPrice * (this.form.commission/100)).toFixed(2);
            },
            goodsListImg(){
                var goodsListImg = [];
                if(this.bannerupload.bannerList.length!==0){
                    for(let item of this.bannerupload.bannerList){
                        goodsListImg.push(item.url)
                    }
                }
                return goodsListImg.join(",");
            }
        },
    }
</script>

<style>
.upload-demo{
    width: 50%;
}
.elInput .el-input__inner{
    outline: none;
    border: none;
    text-align: center;
}
.el-dialog__body{
    overflow: auto;
    height: 420px;
}
</style>