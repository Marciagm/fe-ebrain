<template>
    <section id="fileSelectView">
       <div class="step-bar">
           <el-steps :active="active" finish-status="success" align-center>
               <el-step title="准备数据"></el-step>
               <el-step title="检查数据"></el-step>
               <el-step title="正在运行"></el-step>
               <el-step title="准备预测"></el-step>
           </el-steps>
       </div>
        <div class="box">
            <div class="box-title">
                <span>请选择数据源（暂时支持.csv格式）</span>
            </div>
            <el-row>
                <el-col :span="8" class="card">
                    <div>
                        <div class="title">服务器</div>
                        <div class="data-source">
                            <div id="serverUpload" class="icon">

                            </div>
                            <div class="name">
                                <a style="cursor: pointer" @click="fromServer">点击上传</a>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="card">
                    <div>
                        <div class="title">本地</div>
                        <div class="data-source">
                            <div id="localUpload" class="icon">

                            </div>
                            <div class="name">
                                <el-upload
                                        class="upload-demo"
                                        :action="uploadAction"
                                        :headers="myHeaders"
                                        :on-remove="handleRemove"
                                        :on-success="handleUploadSuccess"
                                        :limit="3"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList">
                                    <a>点击上传</a>
                                    <div slot="tip" class="el-upload__tip">只能上传txt/csv文件，且不超过500kb</div>
                                </el-upload>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="card">
                    <div>
                        <div class="title">历史库</div>
                        <div class="data-source">
                            <div id="historyUpload" class="icon">

                            </div>
                            <div class="name" >
                                <a style="cursor: pointer" @click="fromHistory">点击上传</a>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-dialog
                title="从服务器选择"
                :visible.sync="serverDialogVisible"
                width="50%">
            <div style="height: 300px;overflow: auto">
                <el-row v-for="row in serverFileList">
                    <el-col :span="24">
                         <el-checkbox>{{row}}</el-checkbox>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini"  @click="serverDialogVisible = false">取 消</el-button>
                <el-button size="mini"  type="primary" @click="serverDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="从历史库选择"
                :visible.sync="historyDialogVisible"
                width="50%">
            <div style="height: 300px;overflow: auto">
                <el-row v-for="row in historyFileList">
                    <el-col :span="20">
                        <el-checkbox>{{row.filename}}</el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        {{row.fileSize}}
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini"  @click="historyDialogVisible = false">取 消</el-button>
                <el-button size="mini"  type="primary" @click="historyDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </section>

</template>

<script>
    import {serverChoose,getHistoryFileList,newJob} from '../api/api';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import moment from 'moment';
    export default {
        components: {
            ElCol,
            ElRow,
            ElButton},
        data() {
            return {
                active: 0,
                uploadAction:'',
                fileList:[],
                projectId:"",
                serverFileList:[],
                serverDialogVisible:false,
                historyFileList:[],
                historyDialogVisible:false,
                selectedFileList:[],
                myHeaders:{Authorization: ''},
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handleUploadSuccess(response, file, fileList){
                if(response.data.code>0){
                    this.$message({
                        message: '未登录',
                        type: 'warning',
                        duration:10000
                    });
                    this.$router.push({ path: '/login'});
                }
                this.selectedFileList.push(response.data.tid);
                this.createJob();
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            fromServer(){
                this.serverDialogVisible=true;
                var param={
                    projectId:this.projectId,
                }
                serverChoose(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.serverFileList= data.data;
                    }
                });
            },
            handleServerDialogClose(){
                this.serverDialogVisible=false;
            },
            fromHistory(){
                this.historyDialogVisible=true;
                var param={
                    pageNum:1,
                    pageSize:1000,
                }
                getHistoryFileList(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.historyFileList= data.data.list;
                    }
                });
            },
            handleHistoryDialogClose(){
                this.historyDialogVisible=false;
            },
            createJob(){
                var that = this;
                newJob(that.projectId,that.selectedFileList).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        that.jobId  = data.data.tid;
                        that.sequence = data.data.sequence;
                        //job状态保存，退出再进使用
                        var jobInfo = this.projectId+"/"+this.jobId+"/"+this.sequence;
                        this.$router.push({ path: '/main/uploadView/'+jobInfo });
                    }
                });
            }
        },
        mounted(){
            this.projectId = this.$route.params.projectId;
            var token = localStorage.getItem('token');
            this.myHeaders={Authorization: token};
            this.uploadAction=process.env.API_ROOT+'/filelist/upload';
        }
    }
</script>

<style lang="scss">
    #fileSelectView{
        .step-bar{
            padding: 30px 15px;
        }
        .box{
            height: 400px;
            background: white;
            border:1px solid #1d8ce0;
            margin-top:15px;

            .box-title{
                margin-bottom: 60px;
                text-align: center;
                font-size: 24px;
                padding: 15px;
            }
        }
        .el-dialog__header,.el-dialog__footer{
            background: #1d8ce0;
            padding: 15px 15px 15px;
        }
        .card{
            display: flex;
            justify-content: center;
            align-items: center;
            .title{
                padding: 10px 0;
            }
            .data-source{
                height: 180px;
                width:257px;
                border:2px solid #1d8ce0;
                border-radius: 5px;
                .icon{
                    color:#1d8ce0;
                    text-align: center;
                    font-size: 22px;
                    line-height: 60px;
                    height: 60px;
                    width: 257px;
                    margin-bottom: 20px;
                    margin-top:40px;
                }
                .name{
                    text-align: center;
                    color:#20a0ff;
                }
                #serverUpload{
                    background: url("../assets/server-upload.png") no-repeat center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }

                #localUpload{
                    background: url("../assets/local-upload.png") no-repeat center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }

                #historyUpload{
                    background: url("../assets/history-upload.png") no-repeat center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
        }

    }
</style>