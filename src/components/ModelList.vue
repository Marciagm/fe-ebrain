<template>
    <section id="modelListView">
        <el-row>
            <el-col :span="20" :offset="2">
                <el-row>
                    <el-col :span="6" class="box">
                        <div class="model-card new-model-btn" @click="showNewModelDialog()">
                            <div>
                                <i class="el-icon-plus"></i>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6" class="box" v-for="p in dataList" :key="p.tid">
                        <div class="model-card" @click="goToModelDetail($event,p.tid,p.status)">
                            <div class="icon">
                                <i class="el-icon-setting"></i>
                            </div>
                            <div class="name">
                                {{p.projectName}}
                            </div>
                            <div>
                                {{p.createTime}}
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-pagination v-if="total>7"
                        background
                        layout="prev, pager, next"
                        :page-size="7"
                        :total="total" @current-change="pageChange">
                </el-pagination>
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
    import {getProjectListPage,newProject,newJob} from '../api/api';
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
                total:0,
                dialogNewModelVisible:false,
                isLoading:false,
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
                },
                dataList:[],
                pageSize:7,
                pageNum:1,
            }
        },
        methods: {
            showNewModelDialog(){
                this.dialogNewModelVisible = true;
            },
            saveModel(){
                this.$refs['projectForm'].validate((valid) => {
                    if (valid) {
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
                                //this.$router.push({ path: '/main/fileSelectView/'+data.data.tid });
                                this.createJob(data.data.tid);
                            }
                        });        
                    } else {
                        return false;
                    }
                })
            },
            createJob(projectId){
                var that = this;
                newJob(projectId,[]).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        that.projectId = projectId;
                        that.jobId  = data.data.tid;
                        that.sequence = data.data.sequence;
                        //job状态保存，退出再进使用
                        var jobInfo = projectId+"/"+this.jobId+"/"+this.sequence+"/"+that.projectForm.projectName+"/0";
                        this.$router.push({ path: '/main/uploadView/'+jobInfo });
                    }
                });
            },
            goToModelDetail(e,projectId,b){
                this.$router.push({ path: '/main/result/'+projectId });
            },
            queryProject(){
                var param = {
                    "pageNum": this.pageNum,
                    "pageSize": this.pageSize,
                };
                this.isLoading=true;
                getProjectListPage(param).then(data=>{
                    this.isLoading=false;
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.dataList= data.data.list;
                        this.total = data.data.total;
                    }
                });
            },
            pageChange(val){
                this.pageNum=val;
                this.queryProject();
            }
        },
        mounted(){
            this.queryProject();
        }
    }
</script>

<style lang="scss" type="text/scss">
    #modelListView{
        ._healder{
            height: 50px;background: #9bc3ed;font-size:20px;color:white;text-align: center;line-height: 50px;
        }
        padding-top: 50px;
        .panel{
            border: 2px solid #56bbf6;
        }
        background: white;
        .box{
            display: flex;
            justify-content: center;
            align-items: center;
        }
       /* .el-pagination{
            margin-top: 190px;
        }*/
        .model-card{
            height: 180px;
            width:250px;
            text-align: center;
            border:1px solid #cccccc;
            margin: 30px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .icon{
                font-size:32px;
            }
            .name{
                font-size:20px;
                height: 50px;
                line-height: 50px;
                overflow: hidden;
            }
        }
        .new-model-btn{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
            color: #ccc;
        }
        .model-card:hover{
           cursor: pointer;
        }
        .el-pagination{
            text-align: center;
            nargin:15px;
        }
    }
</style>