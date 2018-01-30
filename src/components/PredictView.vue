<template>
    <div id="predictPage">
        <div id="uploadView" ref="uploadView">
            <div class="left">
                <div class="container" ref="container">
                    <div class="uploadView" v-show="currentPage=='uploadView'">
                        <el-row>
                            <el-col :span="12">
                                <el-card class="box-card project">
                                    <div class="model-name">
                                        模型名称：<el-button type="text" @click="gotoResult">{{projectInfo.projectName}}</el-button>
                                    </div>
                                    <p class="model-desc">
                                        模型描述：{{projectInfo.projectDesc}}
                                    </p>
                                </el-card>
                            </el-col>
                            <el-col :span="12">
                                <el-card class="box-card model-info" style="line-height: 30px;text-align: center">
                                    <el-row>
                                        <el-col :span="4">v{{sequence || '-'}}</el-col>
                                        <el-col :span="5">{{currentModel.precise_recall.precise || '-'}}</el-col>
                                        <el-col :span="5">{{currentModel.roc.auc || '-'}}</el-col>
                                        <el-col :span="5">{{currentModel.model_size || '-'}}</el-col>
                                        <el-col :span="5">{{currentModel.train_time || '-'}}</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="4">模型版本</el-col>
                                        <el-col :span="5">准确率</el-col>
                                        <el-col :span="5">AUC</el-col>
                                        <el-col :span="5">模型大小</el-col>
                                        <el-col :span="5">训练时长</el-col>
                                    </el-row>
                                </el-card>
                            </el-col>
                        </el-row>
                        <div style="text-align: center;font-size: 20px; padding: 30px;color:#ccc;">请上传预测文件</div>
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
                                        <el-upload ref="upload"
                                                   class="upload-file"
                                                   :action="uploadAction"
                                                   :headers="myHeaders"
                                                   :show-file-list=false
                                                   :on-change="onFileChange"
                                                   :before-upload="beforeUpload"
                                                   :on-progress="onUploadProgress"
                                                   :on-success="handleUploadSuccess"
                                                   :auto-upload="true"
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
                    <div class="resultView" v-show="currentPage=='resultView'">
                        <el-tabs v-model="tabActiveName" type="card">
                            <el-tab-pane label="详细报告" name="tab1">
                                <div>
                                    <el-button @click="download(predictFile)">下载预测报告</el-button>
                                </div>
                                <div>
                                    <dynamic-table :headers="[]" :list="predictDetail"></dynamic-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="预测结果" name="tab2">
                                <div>
                                    <el-button  @click="download(detailFile)">下载预测结果</el-button>
                                </div>
                                <div>
                                    <dynamic-table :headers="[]" :list="predictResult"></dynamic-table>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>

            <div class="right">
                <div class="file-list" ref="fileListDiv">
                    <div style="border-bottom: 1px solid #ccc;padding: 5px;display: flex;justify-content: space-between;">
                        <el-button type="text" @click="newPredict">新建预测</el-button>
                        <el-button type="text"  size="mini" @click="gotoResult">返回</el-button>
                    </div>
                    <div class="content">
                        <div v-show="!loadHistory">
                            <el-row v-for="(file,index) in predictHistoryList" :key="file.tid"
                                    :class="currentSelectFileIndex==index ? 'file-item active' : 'file-item'">
                                <el-col :span="22">
                                    <i class="el-icon-loading" v-show="file.status =='running'"></i>
                                    <div @click="showResult(file,index)">{{file.srcFile}}</div>
                                </el-col>
                                <el-col :span="2">
                                    <el-button v-if="file.status=='waiting'" size="mini" type="text">等待</el-button>
                                    <el-button v-if="file.status=='success'" size="mini" type="text">成功</el-button>
                                    <el-button v-if="file.status=='fail'" @click="showReason(file)" size="mini" type="text">失败</el-button>
                                </el-col>
                                <el-col :span="24" v-if="file.state">
                                    <el-progress :percentage="uploadProgress[file.tid]" :show-text="false" :stroke-width="5" v-show="uploadProgress[file.tid]<100"></el-progress>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-show="loadHistory" style="color:white">
                            <i class="el-icon-loading"></i>正在加载预测历史...
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { getProject,getModelExplain,getPredictHistory,savePredictHistory,getPredictResult,runJobStep,getPredictResultAndDetail } from '../api/api';
    import util from '@/common/js/util';
    import echarts from 'echarts';
    import DynamicTable from "@/components/DynamicTable";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import ElInput from "../../node_modules/element-ui/packages/input/src/input";

    export default {
        components: {
            ElInput,
            ElCol,
            ElRow,
            ElButton,
            DynamicTable
        },
        data() {
            return {
                currentPage: 'uploadView',//resultView  uploadView
                active: 3,
                projectInfo:{},
                predictHistoryList:[],
                uploadAction: '',
                myHeaders: {Authorization: ''},
                fileId: "",
                projectId: "",
                jobId: "",
                sequence: 0,
                algorithm:'',
                progress:'0',
                file: {},
                screenLoading: {},
                uploadProgress:{},
                currentModel:{
                    precise_recall:{},
                    roc:{}
                },
                predictDetailReport:[],
                predictDetailHeader:[],
                predictResult:[],
                predictDetail:[],
                runningList:{},
                tabActiveName:'tab1',
                runningCount:1,//当前未完成的预测
                currentSelectFileIndex:-1,
                detailFile:'',
                predictFile:'',
                loadHistory:true,
            };
        },
        methods: {
            queryProjectInfo(){ //查询模型基本信息
                let param = {
                    projectId:this.projectId,
                };
                getProject(param).then(data=>{
                    this.isLoading=false;
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.projectInfo= data.data;
                    }
                });
            },
            queryModelExplain(){
                var param={
                    projectId:this.projectId,
                    jobId:this.jobId,
                    sequence:this.sequence
                }
                getModelExplain(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        var models = JSON.parse(data.data.modelExplain).models;
                        for(var i=0;i<models.length;i++){
                            if(models[i].model_name ==this.algorithm){
                                this.currentModel = models[i];
                                break;
                            }
                        }
                        //console.log(this.currentModel);
                    }
                });
            },
            queryHistory(){
                 var param={
                    projectId:this.projectId,
                    jobId:this.jobId,
                     sequence:this.sequence,
                    modelName:this.algorithm,
                };
                this.loadHistory=true;
                getPredictHistory(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.loadHistory=false;
                        this.predictHistoryList = data.data;
                        this.runningCount=0;
                        for(var i=0;i<this.predictHistoryList.length;i++){
                            if(this.predictHistoryList[i].status=='running'){
                                this.runningCount++;
                            }
                        }

                    }
                });
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
            onFileChange(file,$event){
            },
            handleRemove(file, fileList) {
                //console.log(file, fileList);
            },
            beforeUpload(file){
                var  that = this;
                this.active=3;
                this.$set(this.uploadProgress,file.uid,1);
                var f = {
                    tid: file.uid,
                    srcFile: file.name,
                    fileSize: util.formatFileSize(file.size),
                    create_time:'刚刚',
                    state: '正在上传',
                };
                that.runningList[f.srcFile]=false;
                that.predictHistoryList.push(f);
            },
            onUploadProgress(event, file, fileList){
                this.$set(this.uploadProgress,file.uid,file.percentage);
            },
            handleUploadSuccess(response, file, fileList){
                //console.log("-------------------------------");
                //console.log(file);
                var that = this;
                if (response.data.code > 0) {
                    this.$message({
                        message: '未登录',
                        type: 'warning',
                        duration: 10000
                    });
                    this.$router.push({path: '/login'});
                }

                this.$set(this.runningList,file.filename,true);
                this.$set(this.uploadProgress,file.uid,file.percentage);

                //上传成功，未完成任务数加1
                this.runningCount++;

                var pm={
                    projectId:this.projectId,
                    jobId:this.jobId,
                    jobSequence:this.sequence,
                    modelName:this.algorithm,
                    srcFile:response.data.filename,
                    filePath:response.data.filepath,
                    step:"predict"
                };
                this.startPredict(pm);
            },
            startPredict(param){
                savePredictHistory(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                       param.tid= data.data.tid;
                       param.sequence = param.jobSequence;

                        runJobStep(param).then(data => {
                            let {msg, code} = data;
                            if (code > 0) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            }
                        });
                    }
                });

            },
            queryPredictResultAndDetail(result){
                var that = this;
                var param={
                    tid:result.tid,
                };
                getPredictResultAndDetail(param).then(data=>{
                    let {msg, code} = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                            that.currentPage="resultView";
                            that.predictResult = JSON.parse(data.data.result).dataList;
                            that.predictDetail = JSON.parse(data.data.detail).dataList;

                            that.predictFile = data.data.predictFile;
                            that.detailFile = data.data.detailFile;

                    }
                });

            },
            showResult(result,index){
                if(result.status!='success'){
                    this.$message({
                        message: '预测未完成',
                        type: 'error'
                    });
                }
                this.active=4;
                this.currentSelectFileIndex = index;
                this.queryPredictResultAndDetail(result);
            },
            newPredict(){
                this.currentPage='uploadView';
            },
            download(file){
                var url=process.env.API_ROOT+"/predict/download-file?fileName="+file;
                window.open(url);
            },
            showReason(file){
                this.$message({
                    message: file.reason,
                    type: 'error'
                });
            },
            gotoResult(){
                this.$router.push({ path: '/main/result/'+this.projectId });
            }
        },
        created(){
            this.uploadAction = process.env.API_ROOT + '/filelist/upload';
        },
        mounted(){
            var that = this;
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            that.$refs.uploadView.style.height = (h - 60) + 'px';
            that.$refs.container.style.height = (h - 60) + 'px';
            var token = localStorage.getItem('token');
            that.myHeaders = {Authorization: token};

            that.projectId = this.$route.params.projectId;
            that.jobId = this.$route.params.jobId;
            that.sequence = this.$route.params.sequence;
            that.algorithm = this.$route.params.algorithm;
            that.queryProjectInfo();
            that.queryModelExplain();

            //循环查询是否有未完成的任务
            window.timer = window.setInterval(function(){
                //console.log("========"+that.runningCount);
                if(that.runningCount>0){
                    that.queryHistory();
                }
            },1000);
            var that = this;
            window.onresize = function(){
                let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                that.$refs.uploadView.style.height = (h - 60) + 'px';
            };
        },
        destroyed(){
            window.clearInterval(window.timer);
        }

    }
</script>

<style lang="scss" type="text/scss">
    #predictPage {

        .box-card{
            margin:15px;
            border:1px solid #e6ebf5;
            background-color:none;
            box-shadow:none;
            height:100px;

            .model{
                line-height: 40px;
            }
        }

        #uploadView {
            overflow: hidden;
            .left, .right {
                min-height: 100%;
            }
            .left {
                width: 80%;
                float: left;

                .project{
                    .model-name{
                        font-size: 30px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 27px;
                        letter-spacing: 1px;
                        color: #2f2e2e;
                    }
                    .model-desc{
                        font-size: 18px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 27px;
                        letter-spacing: 0px;
                        color: #413f3f;
                    }
                }

                .model-info{
                    font-size: 18px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 27px;
                    letter-spacing: 0px;
                    color: #413f3f;
                }
            }
            .container {
                overflow-y: scroll;
                overflow-x: hidden;
            }
            .right {
                float: right;
                width: 20%;
                background-color: #262932;
            }

            .step-bar {
                .el-steps--simple {
                    border-radius: 0;
                }
            }

            .el-progress-bar__outer {
                border-radius: 0;
            }

            .file-chooser {
                display: flex;
                justify-content: center;
                margin-top: 20px;
                .box {
                    margin: 60px 30px;
                }
            }

            .card {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .file-list {
                background: #262932;
                padding: 0 5px;
                border-top: solid 1px #ccc;
            }
            .file-list .el-icon-circle-plus-outline {
                color: white;
            }

            .title {
                padding: 10px 0;
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
                height: 65px;
                border-bottom: 1px solid #ccc;
                font-size:24px;
                line-height:60px;
                color: white;
                overflow: hidden;
            }
            .file-item.active{
                background:#006bc7;
            }
            .file-item .del-btn {
                line-height: 60px;
                cursor: pointer;
                color: #1d8ce0;
                padding: 2px 6px;
            }
            .file-item .del-btn:hover {
                color: white;
            }
            .el-checkbox {
                color: white;
            }

            .file-list .content {
                overflow-y: auto;
                overflow-x: hidden;
                height: 390px;
            }

            .file-info-list {
                text-align: center;
                margin-top: 200px;
            }
        }

    }
</style>