<template>
    <section id="predictView">
        <div>
            <el-button @click="showNewModelDialog">新建</el-button>
        </div>
        <el-row>
            <el-col :span="6" class="box">
                <div class="model-card">
                    <div class="icon">

                    </div>
                    <div class="name">
                        模型1
                    </div>
                </div>
            </el-col>
            <el-col :span="6" class="box">
                <div class="model-card">模型1</div>
            </el-col>
            <el-col :span="6" class="box">
                <div class="model-card">模型1</div>
            </el-col>
            <el-col :span="6" class="box">
                <div class="model-card">模型1</div>
            </el-col>
            <el-col :span="6" class="box">
                <div class="model-card">模型1</div>
            </el-col>
            <el-col :span="6" class="box">
                <div class="model-card">模型1</div>
            </el-col>
            <el-col :span="6" class="box">
                <div class="model-card">模型1</div>
            </el-col>

        </el-row>
        <el-dialog  :visible.sync="dialogNewModelVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="模型名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="模型名称" prop="name">
                    <el-input  type="textarea"  v-model="ruleForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogNewModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveModel">确 定</el-button>
            </span>
        </el-dialog>
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
    #predictView{
        height: 500px;
        background: white;
        border:1px solid #1d8ce0;
        margin-top:60px;

        .box{
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .model-card{
            height: 133px;
            width:201px;
            line-height: 133px;
            text-align: center;
            background: #cccccc;
            margin: 15px;
            border-radius: 5px;
            .icon{
                height: 50px;
                width: 201px;
            }
            .name{
                font-size:20px;
            }
        }
    }
</style>