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
                </el-col>
                <el-col :span="6">
                   <div class="file-list">
                       <div class="title">文件传清单</div>
                       <div class="tool-bar">
                           <el-row>
                               <el-col :span="8">
                                    <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                        <i class="el-icon-delete"></i>
                                        <a style="cursor: pointer;color: #20a0ff;" @click="deleteFile">删除</a>
                                    </div>
                               </el-col>
                               <el-col :span="8">
                                   <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                       <i class="el-icon-circle-plus-outline"></i>
                                       <a style="cursor: pointer;color: #20a0ff;" @click="addFile">继续添加</a>
                                   </div>
                               </el-col>
                               <el-col :span="8">
                                   <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                       <i class="el-icon-circle-plus-outline"></i>
                                       <a style="cursor: pointer;color: #20a0ff;" @click="next">下一步</a>
                                   </div>
                               </el-col>
                           </el-row>
                       </div>
                       <div class="content">
                           <div class="file-item">
                               <el-row >
                                   <el-col :span="24">
                                       <template>
                                           <el-checkbox >发射点发射点发射点</el-checkbox>
                                       </template>
                                   </el-col>
                                   <el-col :span="12">
                                       10M
                                   </el-col>
                                   <el-col :span="12">
                                       正在上传
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
    import {newProject,newJob,getJobInfo } from '../api/api';
    import store from '@/vuex/store';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    //import NProgress from 'nprogress'

    export default {
        components: {ElButton},
        data() {
            return {
                active:0,
                adSrc:'./static/ad.jpg',
                store:store,
                uploadAction:'',
                myHeaders: {Authorization: ''},
                fileId:"",
                projectId:"",
                jobId:"",
                sequence:0,
                file:{},
                screenLoading:{},
                dialogVisible:false,
                msg:'运行中...',
                percentage:0,
                fileList:[],
            };
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handleUploadSuccess(response, file, fileList){
                console.log(response);
                if(response.data.code>0){
                    this.$message({
                        message: '未登录',
                        type: 'warning',
                        duration:10000
                    });
                    this.$router.push({ path: '/login'});
                }

                this.file = response.data;
                this.createProject();
            },
            uploadError(){
                this.$router.push({ path: '/main/resultView' });
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
            deleteFile(){

            },
            addFile(){

            },
            next(){
                this.$router.push({ path: "/main/dataCheckView/"+this.projectId+"/"+this.jobId+"/"+this.sequence });
            }
        },
        mounted(){
            //var token = sessionStorage.getItem('token');
            var token = localStorage.getItem('token');
            this.myHeaders={Authorization: token};
            this.uploadAction=process.env.API_ROOT+'/filelist/upload';
            this.projectId = this.$route.params.projectId;
            this.jobId = this.$route.params.jobId;
            this.sequence = this.$route.params.sequence;
        }

    }

</script>

<style lang="scss">
    #uploadView{
        .step-bar{
            padding: 30px 15px;
        }
        .box{
            height: 500px;
            background: white;
            border:1px solid #1d8ce0;
            margin-top:15px;
            .file-chooser{
                height: 500px;
                margin-top: 150px;
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
            .file-list{
                height: 500px;
                border:1px solid #1d8ce0;
                background: #174574;
                padding:0 5px;
                .title{
                    height: 40px;
                    font-size: 18px;
                    text-align: center;
                    color: white;
                    line-height: 40px;
                }

                .tool-bar{
                    height: 40px;
                    padding: 5px 0;
                    line-height: 22px;
                }

                .file-item{
                    height: 60px;
                    border-bottom: 1px solid #ccc;
                    border-top: 1px solid #ccc;
                    line-height: 30px;
                    color:white;

                    .el-checkbox__label{
                        color:white;
                    }
                }
            }


        }
    }
</style>