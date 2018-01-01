<template>
    <section id="uploadView">
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
                <el-col :span="18">
                    <div class="file-chooser">
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
                                                    class="upload-file"
                                                    :action="uploadAction"
                                                    :headers="myHeaders"
                                                    :show-file-list=false
                                                    :before-upload="beforeUpload"
                                                    :on-progress="onUploadProgress"
                                                    :on-success="handleUploadSuccess"
                                                    multiple
                                                    >
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
                                        <div class="name">
                                            <a style="cursor: pointer" @click="fromHistory">点击上传</a>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="file-list">
                        <div class="title">文件传清单</div>
                        <div class="tool-bar">
                            <el-row>
                                <el-col :span="24">
                                    <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                        <el-button type="text" style="cursor: pointer;color: #20a0ff;" @click="next" v-show="jobFiles.length>0" :loading="isLoading">下一步</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="content">
                            <div>
                                <el-row v-for="file in jobFiles" :key="file.tid"  class="file-item">
                                    <el-col :span="22">
                                        <el-row>
                                            <el-col :span="24" style="overflow: hidden">
                                                {{file.filename}}
                                            </el-col>
                                            <el-col :span="12" style="text-align: center">
                                                {{file.fileSize}}
                                            </el-col>
                                            <el-col :span="12" style="text-align: center">
                                                {{file.status || '已上传'}}
                                            </el-col>
                                            <el-col :span="24" v-if="file.status">
                                                <el-progress :percentage="uploadProgress[file.tid]"></el-progress>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="2">
                                        <span class="del-btn" @click="deleteFile(file.tid)">×</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </section>

</template>

<script>
    import {newProject, newJob, getJobFiles, updateJobFiles, runJobStep,getJobProgress} from '../api/api';
    import util from '@/common/js/util';
    import store from '@/vuex/store';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    //import NProgress from 'nprogress'

    export default {
        components: {ElButton},
        data() {
            return {
                active: 0,
                store: store,
                uploadAction: '',
                myHeaders: {Authorization: ''},
                fileId: "",
                projectId: "",
                jobId: "",
                sequence: 0,
                file: {},
                screenLoading: {},
                dialogVisible: false,
                msg: '运行中...',
                percentage: 0,
                jobFiles: [],
                jobFileIds: [],
                uploadProgress:{},
                checkList: {},
                isLoading:false,
            };
        },
        methods: {
            queryJobInfo(){
                var that = this;
                let param = {
                    jobId: this.jobId,
                    sequence: this.sequence,
                };
                getJobFiles(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        that.jobFiles = data.data;
                        for (var i = 0; i < that.jobFiles.length; i++) {
                            that.jobFileIds.push(that.jobFiles[i].tid);
                        }
                    }
                });
            },
            onFileChange(value){
                if (this.checkList[value]) {
                    delete this.checkList[value];
                } else {
                    this.checkList[value] = value;
                }
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            beforeUpload(file){
                console.log(file);
                var f = {
                    tid: file.uid,
                    filename: file.name,
                    fileSize: util.formatFileSize(file.size),
                    status: '正在上传',
                };
                this.jobFiles.push(f);
                this.showFileChooser = false;
            },
            onUploadProgress(event, file, fileList){
                console.log(file)
                this.uploadProgress[file.uid] = Math.ceil(event.percent);
            },
            handleUploadSuccess(response, file, fileList){
                if (response.data.code > 0) {
                    this.$message({
                        message: '未登录',
                        type: 'warning',
                        duration: 10000
                    });
                    this.$router.push({path: '/login'});
                }
                this.jobFileIds.push(response.data.tid);
                //上传成功更新job文件
                var param = {tid: this.jobId, fileList: this.jobFileIds.join(",")};
                updateJobFiles(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        //更新文件成功刷新文件列表
                        this.queryJobInfo();
                    }
                });
            },
            uploadError(){
                console.log("upload error")
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
            deleteFile(tid){ //删除文件
                for (var i = 0; i < this.jobFileIds.length; i++) {
                    if (this.jobFileIds[i] == tid) {
                        this.jobFileIds.splice(i, 1);
                    }
                }
                var pm = {
                    tid: this.jobId,
                    fileList: this.jobFileIds.join(',')
                };
                updateJobFiles(pm).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        //更新文件成功刷新文件列表
                        this.queryJobInfo();
                    }
                });
            },
            next(){
                var pm = {
                    projectId: this.projectId,
                    jobId: this.jobId,
                    sequence: this.sequence,
                    step: 'dataCheck',
                };
                this.isLoading=true;
                runJobStep(pm).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        var timer = setInterval(() => { //每分钟查询一次任务状态
                            var param = {jobId: this.jobId};
                            getJobProgress(param).then(data => {
                                let {msg, code} = data;
                                if (code > 0) {
                                    window.clearInterval(timer);
                                    this.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                } else {
                                    if(data.data.progress!='0'){
                                        window.clearInterval(timer);
                                        this.$router.push({path: "/main/dataCheckView/" + this.projectId + "/" + this.jobId + "/" + this.sequence});
                                    }
                                }
                            });
                        },5000);
                    }
                });

            }
        },
        mounted(){
            //var token = sessionStorage.getItem('token');
            var token = localStorage.getItem('token');
            this.myHeaders = {Authorization: token};
            this.uploadAction = process.env.API_ROOT + '/filelist/upload';
            this.projectId = this.$route.params.projectId;
            this.jobId = this.$route.params.jobId;
            this.sequence = this.$route.params.sequence;
            this.queryJobInfo();
        }

    }

</script>

<style lang="scss" type="text/scss">

    #uploadView .step-bar {
        padding: 30px 15px;
    }

    #uploadView .box {
        height: 500px;
        background: white;
        border: 1px solid #1d8ce0;
        margin-top: 15px;
    }

    #uploadView .file-chooser {
        height: 500px;
        margin-top: 150px;
    }

    #uploadView .card {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #uploadView .title {
        padding: 10px 0;
    }

    #uploadView .data-source {
        height: 180px;
        width: 257px;
        border: 2px solid #1d8ce0;
        border-radius: 5px;
    }

    #uploadView .icon {
        color: #1d8ce0;
        text-align: center;
        font-size: 22px;
        line-height: 60px;
        height: 60px;
        width: 257px;
        margin-bottom: 20px;
        margin-top: 40px;
    }

    #uploadView .name {
        text-align: center;
        color: #20a0ff;
    }

    #uploadView #serverUpload {
        background: url("../assets/server-upload.png") no-repeat center center;
        background-size: contain;
        background-repeat: no-repeat;
    }

    #uploadView #localUpload {
        background: url("../assets/local-upload.png") no-repeat center center;
        background-size: contain;
        background-repeat: no-repeat;
    }

    #uploadView #historyUpload {
        background: url("../assets/history-upload.png") no-repeat center center;
        background-size: contain;
        background-repeat: no-repeat;
    }

    #uploadView .file-list {
        height: 500px;
        border: 1px solid #1d8ce0;
        background: #174574;
        padding: 0 5px;
    }
    #uploadView .file-list .el-icon-circle-plus-outline{
        color:white;
    }

    #uploadView .title {
        height: 40px;
        font-size: 18px;
        text-align: center;
        color: white;
        line-height: 40px;
    }

    #uploadView .tool-bar {
        height: 40px;
        padding: 5px 0;
        line-height: 22px;
    }

    #uploadView .file-item {
        height: 60px;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
        line-height: 22px;
        color: white;
    }
    #uploadView .file-item .del-btn{
        line-height: 60px;
        cursor: pointer;
        color:#1d8ce0;
        padding:2px 6px;
    }
    #uploadView .file-item .del-btn:hover{
        color:white;
    }
    #uploadView .el-checkbox {
        color: white;
    }

    #uploadView .file-list .content{
        overflow-y: auto;
        overflow-x: hidden;
        height: 390px;
    }
</style>