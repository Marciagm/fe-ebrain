<template>
    <section id="predictView">
        <div class="step-bar">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="准备数据"></el-step>
                <el-step title="检查数据"></el-step>
                <el-step title="正在运行"></el-step>
                <el-step title="准备预测"></el-step>
            </el-steps>
        </div>
        <div class="box">
            <el-row>
                <el-col :span="6">
                    <div class="file-list">
                        <div class="title">文件传清单</div>
                        <div class="tool-bar">
                            <el-row>
                                <el-col :span="12">
                                    <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                        <i class="el-icon-delete"></i>
                                        <a style="cursor: pointer;color: #20a0ff;" @click="deleteFile">删除</a>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                        <i class="el-icon-circle-plus-outline"></i>
                                        <a style="cursor: pointer;color: #20a0ff;" @click="addFile">继续添加</a>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="content">
                            <div class="file-item" v-for="file in predictFiles" :key="file.tid" @click="queryPredictResultAndDetail(file.tid)">
                                <el-row>
                                    <el-col :span="24" style="overflow: hidden">
                                        {{file.srcFile}}
                                    </el-col>
                                    <el-col :span="12" style="text-align: center">
                                        {{file.fileSize}}
                                    </el-col>
                                    <el-col :span="12" style="text-align: center">
                                        {{file.status || '已上传'}}
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="predict" v-show="!showFileChooser">
                        <el-tabs v-model="activeName2" type="card">
                            <el-tab-pane label="详细报告" name="second">
                                <template>
                                    <dynamic-table :headers="predictDetailHeader" :list="this.predictDetailReport.dataList"></dynamic-table>
                                </template>
                            </el-tab-pane>
                            <el-tab-pane label="预测结果" name="third">
                                <template>
                                    <dynamic-table :headers="[]" :list="this.predictResult"></dynamic-table>
                                </template>
                            </el-tab-pane>
                        </el-tabs>

                    </div>
                    <div class="file-chooser" v-show="showFileChooser">
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
                                                    :before-upload="beforeUpload"
                                                    :show-file-list="false"
                                                    :on-success="handleUploadSuccess"
                                                    :limit="3"
                                                    :file-list="fileList">
                                                <a>点击上传</a>
                                                <div slot="tip" class="el-upload__tip">只能上传txt/csv文件</div>
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
                </el-col>
            </el-row>
        </div>
    </section>

</template>

<script>
    import {serverChoose,getHistoryFileList,getPredictHistory,savePredictHistory,getPredictResult,runJobStep,getPredictResultAndDetail,getJobProgress,getPredictDetail} from '../api/api';
    import util from '@/common/js/util';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import DynamicTable from "@/components/DynamicTable.vue";
    export default {
        components: {
            ElCol,
            ElRow,
            ElButton,
            DynamicTable},
        data() {
            return {
                active:3,
                activeName2: 'first',
                showFileChooser: false,
                uploadAction: '',
                myHeaders: {Authorization: ''},
                fileId: "",
                projectId: "",
                jobId: "",
                sequence: 0,
                modelName:"",
                file: {},
                fileList:[],
                screenLoading: {},
                dialogVisible: false,
                msg: '运行中...',
                percentage: 0,
                predictFiles: [],
                uploadProgress: 0,
                checkList: {},
                predictResult: [],
                uploading:false,
                currentFile:{},
                predictDetail:{},
                predictDetailHeader:[],
                predictDetailReport:{}
            }
        },
        methods: {
            onFileSelect(value){
               /* if (this.checkList[value]) {
                    delete this.checkList[value];
                } else {
                    this.checkList[value] = value;
                }*/
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            beforeUpload(file){
                this.uploading=true;
                this.currentFile = {
                    tid: 0,
                    srcFile: file.name,
                    fileSize: util.formatFileSize(file.size),
                    status: '正在上传',
                };
                this.predictFiles.push(this.currentFile);
                this.showFileChooser = false;
            },
            onUploadProgress(event, file, fileList){
                this.upladProgress = event.percent;
            },
            queryHistory(param){
                getPredictHistory(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.predictFiles = data.data;

                    }
                });
            },
            handleUploadSuccess(response, file, fileList){
                this.uploading=false;
                if (response.data.code > 0) {
                    this.$message({
                        message: '未登录',
                        type: 'warning',
                        duration: 10000
                    });
                    this.$router.push({path: '/login'});
                }

                var param={
                    projectId:this.projectId,
                    jobId:this.jobId,
                    jobSequence:this.jobSequence,
                    modelName:this.modelName,
                    srcFile:this.currentFile.srcFile,
                    fileSize:this.currentFile.fileSize,
                    filePath:response.data.filepath,
                };

                savePredictHistory(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        param={
                            projectId:this.projectId,
                            jobId:this.jobId,
                            jobSequence:this.jobSequence,
                            modelName:this.modelName,
                        };
                        this.queryHistory(param);
                        var pm={
                            tid:data.data.tid,
                            projectId:this.projectId,
                            jobId:this.jobId,
                            sequence:this.jobSequence,
                            modelName:this.modelName,
                            filePath:response.data.filepath,
                            labelIndex:1,
                            modelName:this.modelName,
                            step:"predict"
                        };
                        this.runPredict(pm);
                    }
                });
            },
            runPredict(param){
                runJobStep(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {

                        this.queryPredictResultAndDetail(param.tid);
                    }
                });

            },
            queryPredictResultAndDetail(tid){
                var param={tid:tid};
                var timer = setInterval(() => { //每分钟查询一次任务状态
                    getPredictResultAndDetail(param).then(data=>{
                        let {msg, code} = data;
                        if (code > 0) {
                            window.clearInterval(timer);
                            this.$message({
                                message: msg,
                                type: 'error'
                            });
                        } else {
                            if(data.data.result){
                                window.clearInterval(timer);
                                this.predictResult = JSON.parse(data.data.result.predictResult).dataList;
                                this.predictDetail = data.data.detail;
                            }

                        }
                    });
                },5000);

            },
            uploadError(){
                console.log("upload error")
            },
            fromServer(){
                this.serverDialogVisible = true;
                var param = {
                    projectId: this.projectId,
                }
                serverChoose(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.serverFileList = data.data;
                    }
                });
            },
            handleServerDialogClose(){
                this.serverDialogVisible = false;
            },
            fromHistory(){
                this.historyDialogVisible = true;
                var param = {
                    pageNum: 1,
                    pageSize: 1000,
                }
                getHistoryFileList(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.historyFileList = data.data.list;
                    }
                });
            },
            handleHistoryDialogClose(){
                this.historyDialogVisible = false;
            },
            deleteFile(){ //删除文件

            },
            addFile(){
                if(this.uploading){
                    this.$message({
                        message: '当前还有文件未上传完成，请稍后再试!',
                        type: 'warning',
                        duration: 10000
                    });
                }else{
                    this.showFileChooser = !this.showFileChooser;
                }

            },
            viewModelDetailReport(){
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                getPredictDetail(param).then(data=> {
                    let {msg, code} = data;
                    if (code > 0 && code != 100) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else if (code == 0) {
                        this.predictDetailReport=JSON.parse(data.data.detail);
                    }
                });
            }
        },
        mounted(){
            this.projectId = this.$route.params.projectId;
            this.jobId = this.$route.params.jobId;
            this.jobSequence = this.$route.params.sequence;
            this.modelName = this.$route.params.modelName;
            var token = localStorage.getItem('token');
            this.myHeaders={Authorization: token};
            this.uploadAction=process.env.API_ROOT+'/filelist/upload';

           var param={
                projectId:this.projectId,
                jobId:this.jobId,
                jobSequence:this.jobSequence,
                modelName:this.modelName,
            };
            this.queryHistory(param);
            this.viewModelDetailReport();
        }
    }
</script>

<style lang="scss" type="text/scss">
    #predictView{
        .step-bar{
            padding: 30px 15px;
        }
        .box {
            height: 500px;
            background: white;
            border: 1px solid #1d8ce0;
            margin-top: 15px;
            overflow: hidden;
        }
        .predict{
            height: 450px;
            overflow: hidden;
        }
        .predict .el-tab-pane{
            height: 500px;
            overflow: scroll;
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
        .file-chooser{
            margin: 30px;
            margin-top: 150px;
        }
        .file-list {
            height: 500px;
            border: 1px solid #1d8ce0;
            background: #174574;
            padding: 0 5px;
            .title {
                height: 40px;
                font-size: 18px;
                text-align: center;
                color: white;
                line-height: 40px;
            }

            .tool-bar {
                height: 40px;
                padding: 5px 0;
                line-height: 22px;
            }

            .file-item {
                height: 60px;
                border-bottom: 1px solid #ccc;
                border-top: 1px solid #ccc;
                line-height: 30px;
                color: white;
                cursor:pointer;
            }
        }
    }
</style>