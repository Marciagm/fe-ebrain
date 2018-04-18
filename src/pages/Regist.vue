<template>
    <entry-part>
        <el-row slot="frame">
            <el-col :xl="{span: 7, offset: 16}" :lg="{span: 7, offset: 17}" :md="{span: 9, offset: 13}" :sm="{span: 10, offset: 12}" :xs="{span: 11, offset: 11}">
                <el-form :model="registForm" :rules="registFormRules" class="regist-form-con" ref="registForm">
                    <div class="regist-form-con-head">账号注册</div>
                    <el-form-item prop="nickname">
                        <el-input name="nickname" placeholder="*昵称" v-model="registForm.nickname"></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input name="email" placeholder="*邮箱" v-model="registForm.email"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input name="phone" placeholder="*手机号" v-model="registForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" name="password" placeholder="*密码" v-model="registForm.password"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-input type="password" name="checkPass" placeholder="*确认密码" v-model="registForm.checkPass"></el-input>
                        <div style="font-size: 12px; color: #ff0000;height: 14px;">{{ errorTips }}</div>
                    </el-form-item>
                    <el-button @click="handleSubmit">提交</el-button>
                    <div class="regist-submit">
                        <div @click="link">
                            <a>立即登录</a>
                        </div>
                        <div class="regist-submit-item">
                            <input type="checkbox" v-model="registForm.agreement">
                            <a>智铀科技服务条款</a>
                        </div>
                    </div>
                </el-form>
            </el-col>
        </el-row>
    </entry-part>
</template>

<script>
    import {regist} from '../api/api';
    import entryPart from '@/components/Entry'

    //import NProgress from 'nprogress'
    export default {
        components: {
            entryPart
        },
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
            var validatePhone = (rule, value, callback) => {
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
                if (!myreg.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                }
                else {
                    callback();
                }
            };

            return {
                errorTips: '',
                logining: false,
                registForm: {
                    nickname: '',
                    email: '',
                    phone: '',
                    password: '',
                    checkPass: '',
                    agreement: ''
                },
                registFormRules: {
                    nickname: [
                        {required: true, message: '请输入昵称', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                    ],
                    phone: [
                        {validator: validatePhone, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            handleSubmit(ev) {
                let that = this;
                this.$refs.registForm.validate((valid) => {
                    
                    if (valid) {
                        if (!this.registForm.agreement) {
                            this.$confirm('请阅读并同意智铀科技服务条款', '提示', {
                               confirmButtonText: '确定',
                               showCancelButton: false,
                               type: 'info',
                               center: false
                            })
                            return;
                        }
                        this.logining = true;
                        var param = {
                            nickname: this.registForm.nickname,
                            sex: this.registForm.sex,
                            email: this.registForm.email,
                            mobile: this.registForm.phone,
                            company: this.registForm.company,
                            title: this.registForm.company,
                            password: this.registForm.password
                        };
                        regist(param).then(data => {
                            if (!data) {
                                return;
                            }
                            if (data.error && data.error.desc) {
                                that.errorTips = '！' + data.error.desc;
                            }
                            else {

                                localStorage.setItem('user', JSON.stringify({nickname: this.registForm.nickname}));
                                this.$router.push({path: '/main'});
                            }
                            /*var data = res.data;
                            console.log(res.status);
                            this.logining = false;
                            let {msg, code} = data;
                            if (code !== 0) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {*/
                                //sessionStorage.setItem('user', JSON.stringify(data.data));
                            //}
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
        }
    }

</script>

<style lang="scss" type="text/scss">
    .regist-form-con {
        width: 330px;
        height: 502px;
        margin-top: 44px;
        margin-right: 96px;
        background: #fff;
        border-radius: 8px;
        padding-top: 30px;
        padding-left: 40px;
        padding-right: 40px;
        box-sizing: border-box;
        .regist-form-con-head {
            font-size: 16px;
            margin-bottom: 29px;
        }
        button {
            width: 250px;
            height: 40px;
            background: #ccc;
            border-radius: 4px;
            font-size: 16px;
            color: #fff;
            margin-bottom: 9px;
        }
        button:hover {
            color: #ffffff;
            background-image: linear-gradient(90deg, 
                #0d65be 0%, 
                #1978d9 45%, 
                #248bf4 100%), 
            linear-gradient(
                #cccccc, 
                #cccccc);
        }
        .regist-submit {
            font-size: 12px;
            color: #116bc7;
            position: relative;
            >div {
                height: 18px; 
                display: inline-block; 
                line-height: 18px;
            }
            .regist-submit-item {
                position: absolute;
                right: 0;
            }
            a {
                cursor: pointer;
                font-size: 12px;
                color: #116bc7;
                font-family: STHeitiSC-Light;
            }
        }

    }
</style>