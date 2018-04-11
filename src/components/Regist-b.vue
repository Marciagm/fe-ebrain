<template>
    <section id="registView">
        <div class="regist-form-wrapper">
            <el-row>
                <el-col :span="6" :offset="18">
                    <div class="form-wrap">
                        <el-form :model="registForm" status-icon :rules="registFormRules" ref="registForm"
                                 label-width="60px" size="small">
                            <el-row style="height: 60px">
                                <el-col :span="24">
                                    <div class="grid-content signup-label" style="color:darkgray;">欢迎使用预测机器人</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="13">
                                    <el-form-item label="" labelWidth="0" prop="nickname">
                                        <el-input
                                                name="nickname"
                                                placeholder="昵称"
                                                v-model="registForm.nickname"
                                                class="username-input">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" style="line-height: 38px;">
                                    <template>
                                        <el-radio v-model="registForm.sex" label="1">男士</el-radio>
                                        <el-radio v-model="registForm.sex" label="2">女士</el-radio>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="" labelWidth="0" prop="email">
                                        <el-input
                                                name="email"
                                                placeholder="邮箱"
                                                v-model="registForm.email">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="" labelWidth="0" prop="phone">
                                        <el-input
                                                name="phone"
                                                placeholder="手机"
                                                v-model="registForm.phone">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--<el-row>
                                <el-col :span="24">
                                    <el-form-item label="" labelWidth="0" prop="company">
                                        <el-input
                                                name="company"
                                                placeholder="公司"
                                                v-model="registForm.company">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>-->
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="" labelWidth="0" prop="title">
                                        <el-input
                                                name="title"
                                                placeholder="职位"
                                                v-model="registForm.title">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="" labelWidth="0" prop="password">
                                        <el-input type="password"
                                                name="password"
                                                placeholder="密码"
                                                v-model="registForm.password">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="" labelWidth="0" prop="checkPass">
                                        <el-input type="password"
                                                  name="checkPass"
                                                  placeholder="确认密码"
                                                  v-model="registForm.checkPass">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-button class="login-btn" @click.native.prevent="handleSubmit">提交</el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <div style="color: black">
                                        已经有账号？
                                        <el-button type="text" @click="link" style="color: #1d8ce0;cursor: pointer">登陆
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="footer">
            <div class="slogan">
                预测机器人，智铀科技提供，让预测无处不在
            </div>
            <div>
                Copyright©2017 wisutech.com. All Rights Reserved.
            </div>
        </div>
    </section>
</template>

<script>
    import {regist} from '../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.registForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                logining: false,
                registForm: {
                    nickname: '',
                    email: '',
                    phone: '',
                    company: '',
                    title: '',
                    sex: '1',
                    password:'',
                    checkPass:''
                },
                registFormRules: {
                    nickname: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                    company: [
                        {required: true, message: '请输入公司', trigger: 'blur'},
                    ],
                    title: [
                        {required: true, message: '请输入职位', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            sexChanged(){
                console.log(this.registForm.sex)
            },
            handleSubmit(ev) {
                var _this = this;
                console.log(this.registForm)
                this.$refs.registForm.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var param = {
                            nickname: this.registForm.nickname,
                            sex: this.registForm.sex,
                            email: this.registForm.email,
                            phone: this.registForm.phone,
                            company: this.registForm.company,
                            title: this.registForm.company,
                            password: this.registForm.password
                        };
                        regist(param).then(data => {
                            this.logining = false;
                            let {msg, code} = data;
                            if (code !== 0) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                sessionStorage.setItem('user', JSON.stringify(data.data));
                                this.$router.push({path: '/main'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            link(){
                this.$router.push({path: '/login'});
            }
        },
        mounted(){
           // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            //this.$refs.registForm.style.height = (h - 90) + 'px';

        }
    }

</script>

<style lang="scss" type="text/scss">
    #registView {
        .regist-form-wrapper {
            background-image: url("../assets/bg8.jpg");
            background-size: 100%;
            background-repeat: no-repeat;
            padding: 150px 200px;
            .form-wrap{
                padding:20px;
                background: rgba(1,1,1,0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                width: 354px;
            }
            .el-form {
                background-color: white;
                width: 100%;
                padding: 15px 30px;
                .el-row {
                    height: 60px;
                }
                .el-radio__inner {
                    border-radius: 0;
                }
                .el-input__inner {
                    width: 292px;
                    height: 35px;
                    border: 1px solid #cccccc;
                    border-radius: 0;
                    padding-left: 50px;
                }
                .el-radio + .el-radio {
                    margin-left: 20px;
                }
                .el-input__inner[name=nickname] {
                    background-image: url("../assets/username.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .el-input__inner[name=email] {
                    background-image: url("../assets/email.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .el-input__inner[name=phone] {
                    background-image: url("../assets/phone.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .el-input__inner[name=company] {
                    background-image: url("../assets/company.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .el-input__inner[name=title] {
                      background-image: url("../assets/title.png");
                      background-repeat: no-repeat;
                      background-position: -1px, -1px;
                  }
                .el-input__inner[name=password] {
                    background-image: url("../assets/key.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .el-input__inner[name=checkPass] {
                    background-image: url("../assets/key.png");
                    background-repeat: no-repeat;
                    background-position: -1px, -1px;
                }
                .username-input {
                    .el-input__inner {
                        width: 150px;
                    }
                }
                .signin-label, .signup-label {
                    font-size: 20px;
                    text-align: center;
                }
                .login-btn {
                    width: 100%;
                    border-radius: 0;
                    color: white;
                    background-color: #1d8ce0;
                    border: none;
                }
                a:-webkit-any-link {
                    text-decoration: none;
                    color: black;
                }
            }
        }
        .footer {
            height: 90px;
            text-align: center;
            line-height: 30px;
            background: white;
            color: gray;
            padding: 15px;
            .slogan {
                font-size: 22px;
                color: black;
            }
        }
    }
</style>