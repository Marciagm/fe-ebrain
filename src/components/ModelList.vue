<template>
    <section id="modelListView">
        <div style="padding: 15px;">
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="showNewModelDialog">新建</el-button>
        </div>
        <el-row>
            <el-col :span="6" class="box">
                <div class="model-card" data-project-id="21" data-model-step="dataCheck" ref="projectInfo" @click="gotoModelDetail($event)">
                    <div class="icon">
                        1
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
            <el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="100px">
                <el-form-item label="模型名称" prop="projectName">
                    <el-input v-model="projectForm.projectName"></el-input>
                </el-form-item>
                <el-form-item label="模型描述" prop="projectDesc">
                    <el-input  type="textarea"  v-model="projectForm.projectDesc"></el-input>
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
    import {newProject} from '../api/api';
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
                projectForm: {
                    projectName: '',
                    projectDesc:''
                },
                rules: {
                    projectName: [
                        {required: true, message: '请输入模型名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    projectDesc: [
                        {required: true, message: '请输模型描述', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 3 到 5 个字符', trigger: 'blur'}
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
                var param = {
                    "projectName": this.projectForm.projectName,
                    "projectDesc": this.projectForm.projectDesc,
                };
                newProject(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.$router.push({ path: '/main/fileSelectView/'+data.data.tid });
                    }
                });

            },
            gotoModelDetail(e){
                var projectInfo = this.$refs.modelInfo.dataset;
                if(modelInfo.modelStep=='upload'){
                    this.$router.push({ path: '/main/fileSelectView/'+projectInfo.projectId });
                }else if(modelInfo.modelStep=='dataCheck'){
                    this.$router.push({ path: '/main/dataCheckView/'+projectInfo.projectId });
                }else if(modelInfo.modelStep=='train'){
                    this.$router.push({ path: '/main/trainingView/'+projectInfo.projectId });
                }else{
                    this.$router.push({ path: '/main/modelDetail/'+projectInfo.projectId });
                }

            }
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
    #modelListView{
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
            text-align: center;
            border:1px solid #cccccc;
            margin: 15px;
            border-radius: 5px;
            cursor: pointer;
            .icon{
                color:#1d8ce0;
                text-align: center;
                font-size: 22px;
                line-height: 60px;
                height: 60px;
                width: 201px;
                background: url("../assets/model-icon2.png") no-repeat center center;
                background-size: contain;
                background-repeat: no-repeat;
                margin-bottom: 20px;
                margin-top:10px;
            }
            .name{
                font-size:20px;
                height: 50px;
                line-height: 50px;
            }
        }
        .model-card:hover{
            background: #cccccc;
        }
    }
</style>