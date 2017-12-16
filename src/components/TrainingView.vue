<template>
    <section id="trainingView">
        <div class="step-bar">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="准备数据"></el-step>
                <el-step title="检查数据"></el-step>
                <el-step title="正在运行"></el-step>
                <el-step title="准备预测"></el-step>
            </el-steps>
        </div>

        <div>
            <div><h3>模型名称</h3></div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>测试模型</span>
                    <el-button style="float: right; padding: 3px 0" type="text">全部终止</el-button>
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td width="60"><i class="el-icon-setting"></i></td>
                                <td style="text-align: left">sdfsdfsdfasdfasdfsadfsadf</td>
                                <td>进度<el-progress :percentage="70"></el-progress></td>
                                <td>CPU:0</td>
                                <td>内存：0</td>
                                <td>
                                    <el-button type="primary"  size="mini" round>终止</el-button>
                                </td>
                            </tr>
                            <tr>
                                <td><i class="el-icon-setting"></i></td>
                                <td style="text-align: left">sdfsdfsdfasdfasdfsadfsadf</td>
                                <td width="200">进度<el-progress :percentage="70"></el-progress></td>
                                <td>CPU:0</td>
                                <td>内存：0</td>
                                <td>
                                    <el-button type="primary" size="mini" round>终止</el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </el-card>
        </div>
    </section>

</template>

<script>
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        components: {
            ElCol,
            ElRow,
            ElButton},
        data() {
            return {
                dialogNewModelVisible:false,
                ruleForm: {
                    name: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            showNewModelDialog(){
                this.dialogNewModelVisible = true;
            },
            saveModel(){
                this.dialogNewModelVisible=false;
                this.$router.push({ path: '/main/fileSelectView' });
            }
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
    #trainingView{
        .step-bar{
            padding: 30px 15px;
        }
        .box-card table{
            width: 100%;
        }
        .box-card table tr td{
            text-align: center;
            height: 80px;
        }

    }
</style>