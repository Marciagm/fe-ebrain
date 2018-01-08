<template>
    <div id="uploadView" ref="uploadView">
        <div class="left">
            <div class="step-bar">
                <el-steps :active="active" finish-status="success"  simple >
                    <el-step title="准备数据"></el-step>
                    <el-step title="检查数据"></el-step>
                    <el-step title="正在运行"></el-step>
                    <el-step title="准备预测"></el-step>
                </el-steps>
            </div>
            <div class="file-chooser">
                <div class="box">
                    <div class="data-source">
                        <div id="serverUpload" class="icon">

                        </div>
                        <div class="name">
                            <el-button @click="fromServer" type="primary">数据库文件</el-button>
                        </div>
                    </div>
                </div>
                <div class="box">
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
                                <el-button type="primary">本地文件</el-button>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div class="data-source">
                        <div id="historyUpload" class="icon">

                        </div>
                        <div class="name">
                            <el-button @click="fromHistory" type="primary">历史文件</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="file-list" ref="fileListDiv">
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
                                        <el-progress :percentage="uploadProgress[file.tid]" :show-text="false"></el-progress>
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
        </div>
    </div>
    <!--<section id="uploadView">
        <div class="box">
            <el-row>
                <el-col :span="18">

                </el-col>
                <el-col :span="6">

                </el-col>
            </el-row>
        </div>
    </section>-->

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
                this.uploadProgress[file.uid] = parseInt(event.percent);
                console.log(this.uploadProgress);
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
        created(){
            //let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        },
        mounted(){
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.$refs.uploadView.style.height=(h-60)+'px';
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
    #uploadView{
        overflow: hidden;
        .left,.right{
            min-height: 100%;
        }
        .left{
            width: 80%;
            float:left;
        }
        .right{
            float:right;
            width:20%;
            background-color: #262932;
        }
    }
    #uploadView {
        overflow: hidden;
    }
    #uploadView .step-bar {
        .el-steps--simple {
            border-radius:0;
        }
    }
    #uploadView {
        overflow: hidden;
    }
    #uploadView .file-chooser {
        display: flex;
        justify-content: center;
        margin-top: 100px;
        .box{
            margin:60px 30px;
        }
    }

    #uploadView .card {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #uploadView .title {
        padding: 10px 0;
    }

    #uploadView .file-list {
        background: #262932;
        padding: 0 5px;
        border-top:solid 1px #ccc;
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