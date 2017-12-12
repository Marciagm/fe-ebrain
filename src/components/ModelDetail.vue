<template>
    <section id="modelDetailView">
        <div class="step-bar">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="准备数据"></el-step>
                <el-step title="检查数据"></el-step>
                <el-step title="正在运行"></el-step>
                <el-step title="准备预测"></el-step>
            </el-steps>
        </div>

        <div class="content">
            <el-collapse accordion>
                <el-collapse-item>
                    <template slot="title">
                        <el-row class="header">
                            <el-col :span="4">模型名称</el-col>
                            <el-col :span="4">准确率</el-col>
                            <el-col :span="4">模型大小</el-col>
                            <el-col :span="4">AUC</el-col>
                            <el-col :span="4">F值</el-col>
                            <el-col :span="4">训练时间</el-col>
                        </el-row>
                    </template>
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title">
                        <el-row class="item">
                            <el-col :span="4">模型名称</el-col>
                            <el-col :span="4">准确率</el-col>
                            <el-col :span="4">模型大小</el-col>
                            <el-col :span="4">AUC</el-col>
                            <el-col :span="4">F值</el-col>
                            <el-col :span="4">训练时间</el-col>
                        </el-row>
                    </template>
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title">
                        <el-row class="item">
                            <el-col :span="4">模型名称</el-col>
                            <el-col :span="4">准确率</el-col>
                            <el-col :span="4">模型大小</el-col>
                            <el-col :span="4">AUC</el-col>
                            <el-col :span="4">F值</el-col>
                            <el-col :span="4">训练时间</el-col>
                        </el-row>
                    </template>
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title">
                        <el-row class="item">
                            <el-col :span="4">模型名称</el-col>
                            <el-col :span="4">准确率</el-col>
                            <el-col :span="4">模型大小</el-col>
                            <el-col :span="4">AUC</el-col>
                            <el-col :span="4">F值</el-col>
                            <el-col :span="4">训练时间</el-col>
                        </el-row>
                    </template>
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
            </el-collapse>
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
                active:0,
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
    #modelDetailView{
        .step-bar{
            padding: 30px 15px;
        }
        .content{
            background: white;
            .header{
                background: #1d8ce0;
                text-align: center;
            }
            .item{
                text-align: center;
            }
            .item:hover{
                background: #cccccc;
            }
            .el-collapse-item__arrow{
                display: none;
            }
        }

    }
</style>