<template>
    <div>
        <el-row>
            <el-col :span='4'>
                <div class="left">
                    <div class="left-item" :class="{'active': current == k}" v-for="(i,k) in items" :key="k" :id='k' @click="ItemTap">
                        {{i.title}}
                    </div>
                </div>
            </el-col>
            <el-col :span="20" style="background-color: #fff;padding: 0 50px;min-height: 500px;">
                <div class="wrapper">
                    <div class="box-01" v-if='type == 0'>
                        <div class="person-base">
                            <img src="../../assets/img/img.jpg" class="p-img">
                            <div class="p-baseinfo">
                                <div class="p-name">庄</div>
                                <div class="p-city">广东省东莞市</div>
                                <button class="btn" @click="changeData">修改资料</button>
                            </div>
                        </div>
                        <div class="p-detail">
                            <div class="d-item" v-for='(i,k) in message' :key='k'>
                                {{i.title}}:{{i.value}}
                            </div>
                        </div>
                    </div>

                    <div class="box-02" v-if='type == 4'>
                        <el-form :model="form" label-width="100px" style="width: 500px;" size='medium'>
                            <el-form-item label="用户头像">
                                <img src="../../assets/img/img.jpg" class="p-img">
                            </el-form-item>
                            <el-form-item label="用户姓名">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="用户性别">
                                <el-radio-group v-model="form.sex">
                                    <el-radio label='男' value='0'></el-radio>
                                    <el-radio label='女' value='1'></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label='身份证类型'>
                                <el-select v-model="form.zjtype" placeholder="请选择证件类型">
                                    <el-option label="身份证" value="1"></el-option>
                                    <el-option label="港澳通行证" value="2"></el-option>
                                    <el-option label="护照" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="证件号码">
                                <el-input v-model="form.zjnubmer"></el-input>
                            </el-form-item>
                            <el-form-item label="证件地址">
                                <el-select v-model="form.provinces" placeholder="请选择省份" style="width: 120px;">
                                    <el-option label="广东省" value="1"></el-option>
                                </el-select>
                                <el-select v-model="form.city" placeholder="请选择城市" style="width: 120px;">
                                    <el-option :label='i' value="k" v-for='(i,k) in city' :key='k'></el-option>
                                </el-select>
                                <el-select v-model="form.area" placeholder="请选择区域" style="width: 120px;">
                                    <el-option :label='i' value="k" v-for='(i,k) in city' :key='k'></el-option>
                                </el-select>
                                <el-input placeholder="请输入您的详细地址" v-model="form.detailedaddress" style="margin-top:20px;"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">确认修改</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="box-03" v-if="type == 1">
                        <h3 class="title">登陆设置</h3>
                        <table class="s_table">
                            <tbody>
                                <tr>
                                    <td class="tit">登录密码</td>
                                    <td class="desc">请输入8~20位字符，必须包含数字、大写字母、小写字母、下划线中的三种</td>
                                    <td class="status">
                                        <i :class="`el-icon-lx-${account_s.password ? 'roundcheck': 'warn'}`" :style="`${account_s.password ? '': 'color: red;'}`"></i>
                                        <span>{{account_s.password ? '已设置':'未设置'}}</span>
                                    </td>
                                    <td class="opt" @click="changePassword">修改密码</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 class="title" style="margin-top:20px;">绑定信息</h3>
                        <table class="s_table">
                            <tbody>
                                <tr>
                                    <td class="tit">手机绑定</td>
                                    <td class="desc">可用于找回密码、接收短信通知。</td>
                                    <td class="status">
                                        <i :class="`el-icon-lx-${account_s.phone ? 'roundcheck': 'warn'}`" :style="`${account_s.phone ? '': 'color: red;'}`"></i>
                                        <span>{{account_s.phone ? '已设置':'未设置'}}</span>
                                    </td>
                                    <td class="opt" @click="changePassword">更换手机</td>
                                </tr>
                                 <tr>
                                    <td class="tit">邮箱绑定</td>
                                    <td class="desc">可用于找回密码。</td>
                                    <td class="status">
                                        <i :class="`el-icon-lx-${account_s.email ? 'roundcheck': 'warn'}`" :style="`${account_s.email ? '': 'color: red;'}`"></i>
                                        <span>{{account_s.email ? '已设置':'未设置'}}</span>
                                    </td>
                                    <td class="opt" @click="changePassword">绑定邮箱</td>
                                </tr>
                            </tbody>
                        </table>
                        <el-dialog 
                            title='修改密码'
                            :visible="showChange"
                            width="30%"
                            :before-close='closeChange'
                        >
                            <el-form>
                                <el-form-item label="原先密码">
                                    <el-input></el-input>
                                </el-form-item>
                                <el-form-item label="新密码">
                                    <el-input></el-input>
                                </el-form-item>
                                <el-form-item label="确认密码">
                                    <el-input></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="showChange = false">取 消</el-button>
                                <el-button type="primary" @click="showChange = false">确 定</el-button>
                            </span>
                        </el-dialog>
                    </div>

                    <div class="box-03" v-if="type == 2">
                        <h2>实名核验</h2>
                    </div>

                    <div class="box-03" v-if="type == 3">
                        <el-table
                            style="width: 100%;"
                            :data='agent'
                        >
                            <el-table-column
                                prop="qyname"
                                label="企业名称"
                                width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="type"
                                label="用户类型"
                                width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="loginname"
                                label="登录名"
                                width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="date"
                                label="可经办期限"
                                width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="do"
                                label="操作"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return{
            items: [
                { title: '账户信息' },
                { title: '账户安全' },
                { title: '实名核实' },
                { title: '我经办的法人' }
            ],
            current: '0',
            type: '0',
            message: [
                { title: '证照类型', value: '身份证' },
                { title: '证件号码', value: '440582******5518' },
                { title: '详细地址', value: '企石镇' },
                { title: '手机号码', value: '134***194' },
                { title: '证件地址', value: '广东省东莞市' },
            ],
            form: {
                name: '',
                sex: '',
                zjtype: '',
                zjnubmer: '',
                provinces: '',
                city: '',
                area: '',
                detailedaddress: ''
            },
            city: {
                '0':'广州市',
                '1':'深圳市',
                '2':'东莞市',
                '3':'肇庆市',
                '4':'河源市',
                '5':'湛江市'
            },
            showChange: false,
            account_s: {
                password: 'china1001',
                phone: '13411999194',
                email: '',
                new_password: '',
                new_phone: '',
                new_email: ''
            }
        }
    },
    methods: {
        ItemTap: function(e) {
            var me = this
            this.current = e.target.id
            this.type = e.target.id
        },
        changeData: function(){
            this.type = 4
        },
        onSubmit: function() {
            this.type = 0
        },
        changePassword: function() {
            this.showChange = true
        },
        closeChange: function() {
            this.showChange = false
        },
        handleClick: function(row) {
            console.log(row);
        }
    }
}
</script>
<style scoped>
.left{
    width: 100%;
    border-right: 1px solid #e8e8e8;
    padding: 10px 0;
    background-color: #fff;
}
.left-item{
    height: 50px;
    line-height: 50px;
    width: 100%;
    text-align: center;
    color: #0d1c28;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}
.active{
    border-left: 3px solid #3e97df;
    color: #3e97df;
    background-color: #ebf4fb;
}

.wrapper{
    padding-top: 30px;
}

.box-01{

}

.person-base{
    margin-bottom: 60px;
}

.p-baseinfo{
    position: relative;
    padding-top: 15px;
}

.p-name{
    font-size: 24px;
    max-width: 550px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.p-city{
    font-size: 22px;
    margin-top: 12px;
}

.p-img{
    border-radius: 50%;
    height: 100px;
    width: 100px;
    margin-right: 25px;
    float: left;
}

.btn{
    position: absolute;
    top: 20px;
    right: 20px;
    height: 48px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    border: none;
    outline: none;
    padding: 0 3em;
    color: #3e97df;
    background: #ebf4fb;
}

.p-detail{
    margin-top: 30px;
    padding: 30px 0;
    border-top: 1px solid #dfe1e2;
}
.d-item{
    float: left;
    width: 50%;
    font-size: 16px;
    color: #727475;
    padding: 15px 0;
}

.flex-box{
    display: flex;
    flex-direction: row;
}

.el-select + .el-select{
    margin-left: 20px;
}

.title{
    width: 100%;
    font-size: 20px;
    padding: 0 0 11px;
    border-bottom: 3px solid #0d1c28;
}
.s_table{
    font-size: 14px;
    width: 100%;
    margin-top: 10px;
    border-collapse: separate;
    border-spacing: 0;
}
.s_table td{
    border-bottom: 1px solid #e2e2e2;
}
.s_table .tit{
    width: 100px;
    font-weight: 700;
}
.s_table .desc{
    width: 550px;
    padding: 15px 30px;
}

.s_table .status{

}

.s_table .opt{
    color: #3e97df;
    text-align: right;
    cursor: pointer;
}
</style>
