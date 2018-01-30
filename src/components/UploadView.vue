<template>
    <div id="uploadPage">
        <div id="uploadView" ref="uploadView">
            <div class="left">
                <div class="step-bar">
                    <el-steps :active="active" finish-status="success"  simple >
                        <el-step title="数据上传"></el-step>
                        <el-step title="数据检查"></el-step>
                        <el-step title="模型训练"></el-step>
                    </el-steps>
                </div>
               <div class="container" ref="container">
                   <div class="file-chooser" v-show="currentPage=='uploadView'">
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
                   <div class="file-info-list"  v-show="currentPage=='progressView'">
                            <div><span><i class="el-icon-loading" style="font-size: 60px;"></i></span></div>
                            <p v-for="p in progressInfoList" style="font-size:24px;color:gray">
                                {{p}}
                            </p>
                   </div>
                   <div id="dataCheckView"  v-show="currentPage=='dataCheckView'">
                        <div class="box">
                            <div>
                                <div style="height: 30px">想预测什么？</div>
                                <el-row>
                                    <el-col :span="24">
                                        <el-autocomplete
                                                class="inline-input predict-label-input"
                                                v-model="predict_label"
                                                :fetch-suggestions="querySearch"
                                                value-key="feature_name"
                                                placeholder="请输入标签名称"
                                                :trigger-on-focus="false"
                                                @select="handleTagSelect"
                                        ></el-autocomplete>
                                    </el-col>
                                </el-row>
                                <div v-show="showStartbtn">
                                    <el-row>
                                        <el-col :span="8">
                                            <div id="chart0" v-show="chartType==0"></div>
                                        </el-col>
                                        <el-col :span="8" v-show="chartType==0" style="display: flex;align-items: center;justify-content: center;height: 300px;">
                                            <p>
                                            <h3>{{tips}}</h3>
                                            </p>
                                        </el-col>
                                        <el-col :span="8" v-show="chartType==0" style="display: flex;align-items: center;justify-content: center;height: 300px;">
                                            <el-button type="primary" class="start-btn" @click="startTrain" v-show="!isLoading" :disabled="startBtnDisabled">开始</el-button>
                                            <el-button type="primary" class="start-btn" v-show="isLoading" >
                                                <i class="el-icon-loading"></i>
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div style="margin-top:15px;">
                                <template>
                                    <el-tabs v-model="activeTab" type="card">
                                        <el-tab-pane label="数据报告" name="first">
                                            <el-table
                                                    :data="tableData1"
                                                    border
                                                    style="width: 100%;height: 350px;overflow: auto;">
                                                <el-table-column
                                                        label="特征"
                                                        width="180"
                                                        @cell-click="selectTag()">
                                                    <template scope="scope">
                                                        <span style="cursor: pointer" @click="selectTag(scope.row.feature_name,scope.row.column_index)">{{scope.row.feature_name}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                        prop="type"
                                                        label="特征类型"
                                                        width="180"
                                                        :formatter="labelTypeFormat">
                                                </el-table-column>
                                                <el-table-column
                                                        prop="value_count"
                                                        label="取值个数">
                                                </el-table-column>
                                                <el-table-column
                                                        prop="miss"
                                                        label="缺少数量">
                                                </el-table-column>
                                                <el-table-column
                                                        prop="max"
                                                        label="最大值">
                                                </el-table-column>
                                                <el-table-column
                                                        prop="min"
                                                        label="最小值">
                                                </el-table-column>
                                                <el-table-column
                                                        prop="mean"
                                                        label="均值">
                                                </el-table-column>
                                                <el-table-column
                                                        prop="std"
                                                        label="方差">
                                                </el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane label="原始数据" name="second" style="height: 500px;">
                                            <template>
                                                <dynamic-table  :headers="[]" :list="this.sourceDataResult.dataList"></dynamic-table>
                                            </template>
                                        </el-tab-pane>
                                    </el-tabs>
                                </template>
                            </div>
                        </div>
                    </div>
               </div>
            </div>

            <div class="right">
                <div class="file-list" ref="fileListDiv">
                    <div class="title">{{projectName || '文件清单'}}</div>
                    <div class="tool-bar">
                        <el-row>
                            <el-col :span="12">
                                <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                    <el-button type="text" style="cursor: pointer;color: #20a0ff;" @click="currentPage='uploadView'">继续添加</el-button>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div style="display: flex;flex-direction:column;justify-content: center;align-items: center">
                                    <el-button type="text" style="cursor: pointer;color: #20a0ff;" @click="dataCheck" :disabled="isLoading">下一步</el-button>
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
                                            {{file.state || '已上传'}}
                                        </el-col>
                                        <el-col :span="24" v-if="file.state">
                                            <el-progress :percentage="uploadProgress[file.tid]" :show-text="false" :stroke-width="5"></el-progress>
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

    </div>
</template>

<script>
    import { newProject, newJob, getJobFiles, updateJobFiles,runJobStep,getDataResult,getFileData,getJobInfo,getJobProgress,validateFiles,deleteJobFile } from '../api/api';
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
                currentPage: 'uploadView', //uploadView
                active: 0,
                projectName: '',
                uploadAction: '',
                myHeaders: {Authorization: ''},
                fileId: "",
                projectId: "",
                jobId: "",
                sequence: 0,
                progress:'0',
                file: {},
                screenLoading: {},
                dialogVisible: false,
                msg: '运行中...',
                jobFiles: [],
                jobFileIds: [],
                uploadProgress:{},
                checkList: {},
                isLoading: false,
                activeTab: 'first',
                predict_label: '',
                tableData1: [],
                sourceDataResult: {},
                dataSeparator: ',',
                labelIndex: 1,
                timer: false,
                startBtnDisabled: true,
                chartType: 0,
                tips:'',
                progressInfoList:['开始数据检查'],
                showStartbtn:false,
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
                        that.jobFileIds=[];
                        for (var i = 0; i < that.jobFiles.length; i++) {
                            that.jobFileIds.push(that.jobFiles[i].tid);
                        }
                        that.validateUploadFile(function(){
                            console.log("文件验证结束");
                        });

                    }
                });
            },
            onFileChange(file,$event){
                //this.$set(this.uploadProgress,file.uid,file.percentage);
            },
            handleRemove(file, fileList) {
                //console.log(file, fileList);
            },
            beforeUpload(file){
                var  that = this;
                this.$set(this.uploadProgress,file.uid,1);
                var f = {
                    tid: file.uid,
                    filename: file.name,
                    fileSize: util.formatFileSize(file.size),
                    state: '正在上传',
                };
                that.jobFiles.push(f);
            },
            onUploadProgress(event, file, fileList){
                //console.log(file);
                this.$set(this.uploadProgress,file.uid,file.percentage);
            },
            handleUploadSuccess(response, file, fileList){
                var that = this;

                if (response.data.code > 0) {
                    this.$message({
                        message: '未登录',
                        type: 'warning',
                        duration: 10000
                    });
                    this.$router.push({path: '/login'});
                }
                that.jobFileIds.push(response.data.tid);
                //上传成功更新job文件
                var param = {tid: that.jobId, fileList: that.jobFileIds.join(",")};
                updateJobFiles(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        //更新文件成功刷新文件列表
                        that.queryJobInfo();

                    }
                });

            },
            validateUploadFile(cb){
                let param={
                    jobId:this.jobId,
                };
                validateFiles(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        cb();
                    }
                });
            },
            uploadError(){
                //console.log("upload error")
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
                if(this.currentpage == 'progressView'){
                    this.$message({
                        message: '当前任务正在进行，不可删除文件',
                        type: 'error'
                    });
                    return;
                }

                //重新上传文件，清除标签
                this.predict_label = "";
                this.labelIndex = 0;
                this.startBtnDisabled = true;
                this.chartType = -1;
                this.showStartbtn = false;
                this.currentPage = 'uploadView';
                try{

                }catch(e){}

                for (var i = 0; i < this.jobFileIds.length; i++) {
                    if (this.jobFileIds[i] == tid) {
                        this.jobFileIds.splice(i, 1);
                    }
                }
                var pm = {
                    jobId: this.jobId,
                    fileId:tid
                };
                deleteJobFile(pm).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.progressInfoList=['开始数据检查'];
                        //更新文件成功刷新文件列表
                        this.queryJobInfo();
                    }
                });
            },
            dataCheck(){
                var  that = this;
                that.active = 1;
                that.currentPage = 'progressView';
                //this.progresInfoList = 'Data moving successed\r\nExtract column name successed\r\nFeature analyse successed\r\nData merge successed'.split("\r\n");
                //return;
                var pm = {
                    projectId: that.projectId,
                    jobId: that.jobId,
                    sequence: that.sequence,
                    step: 'dataCheck',
                };
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
                                    that.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                } else {
                                    if(data.data.jobStatus == 'failed'){
                                        window.clearInterval(timer);
                                        that.$message({
                                            message: data.data.reason,
                                            type: 'error'
                                        });
                                    }else if (data.data.progress != '0') {
                                        window.clearInterval(timer);
                                        that.progressInfoList = data.data.reason.split("\r\n");
                                        //延时进入下一页
                                        setTimeout(function(){
                                            that.currentPage = 'dataCheckView';
                                            that.queryDataResult();
                                            that.querySourceFileData();
                                        },5000);

                                    }else{
                                        that.progressInfoList = data.data.reason.split("\r\n");
                                    }
                                }
                            });
                        }, 2000);
                    }
                });
            },
            labelTypeFormat(row){
                return row.type == 0 ? '离散' : '连续'
            },
            selectTag(feature_name, columnIndex){
                this.predict_label = feature_name;
                this.labelIndex = columnIndex;
                this.showStartbtn = true;
                var xAxisData = [];
                var seriesData = [];
                for (var i = 0; i < this.tableData1[this.labelIndex].value_top_frequence.length; i++) {
                    var obj = this.tableData1[this.labelIndex].value_top_frequence[i];
                    xAxisData.push(obj.value);
                    seriesData.push(obj.frequence);
                }
                //console.log(this.tableData1[this.labelIndex].type)
                if (this.tableData1[this.labelIndex].type == 0) {
                    this.chartType = 0;
                    this.drawBarChart(xAxisData, seriesData, '样本数', '目标类型');
                    if(this.tableData1[this.labelIndex].value_count !=2){
                        this.startBtnDisabled=true;
                        this.tips = '您选择的标签是离散类型，离散值共'+this.tableData1[this.labelIndex].value_count+'个，数量较多不适合作为训练标签';
                    }else{
                        this.tips="";
                        this.startBtnDisabled=false;
                    }
                } else {
                    this.drawLineChart(xAxisData, seriesData, '样本数', '目标类型');
                    this.chartType = 0;
                    this.startBtnDisabled=false;
                    if(this.tableData1[this.labelIndex].value_count>9){
                        this.tips = '您选择的标签是连续类型';
                    }
                }

            },
            handleTagSelect(item){
                this.selectTag(item.feature_name, item.column_index)
            },
            querySearch(queryString, cb) {
                var tagSuggestions = this.tableData1;
                var results = queryString ? tagSuggestions.filter(this.createFilter(queryString)) : tagSuggestions;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (tag) => {
                    return (tag.feature_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            querySourceFileData(ev){
                var param = {jobId: this.jobId};
                getFileData(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.sourceData = data.data;
                        this.sourceDataResult = JSON.parse(data.data.dataResult);
                        // //console.log(this.sourceDataResult)
                    }
                });
            },
            queryDataResult(){
                var _this = this;
                var param = {projectId: this.projectId, jobId: this.jobId, sequence: this.sequence};
                getDataResult(param).then(data => {
                    let {msg, code} = data;
                    // //console.log(data)
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        //console.log(data.data.dataResult)
                        this.projectId = data.data.projectId;
                        this.sequence = data.data.jobSequence;
                        this.dataSeparator = data.data.dataSeparator;
                        if (data.data && data.data.dataResult) {
                            this.labelData = JSON.parse(data.data.dataResult || {});
                            var datas = this.labelData.feature_and_label;
                            this.tableData1 = datas;
                        }

                    }
                });
            },
            startTrain(){
                var that = this;
                that.isLoading = true;
                var param = {
                    projectId: this.projectId,
                    jobId: this.jobId,
                    sequence: this.sequence,
                    step: 'train',
                    labelIndex: (this.labelIndex + 1),
                };
                runJobStep(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        setTimeout(function(){
                            that.isLoading = false;
                            that.$router.push({ path: '/main/trainingView/'+that.projectId+"/"+that.jobId+"/"+that.sequence});
                        },6000);

                    }
                });
            },
            drawBarChart(xAxisData,seriesData,xLabel,yLabel) {
                this.chartBar = echarts.init(document.getElementById('chart0'));
                this.chartBar.setOption({
                    title: {
                        text: '待预测目标类型分布',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '12%',
                        right: '8%',
                        bottom: '8%',
                        containLabel: true
                    },
                    yAxis: {
                        name:xLabel,
                        nameLocation:'center',
                        nameGap:50,
                        type: 'value',
                    },
                    xAxis: {
                        name:yLabel,
                        nameLocation:'center',
                        nameGap:20,
                        type: 'category',
                        data: xAxisData,
                        boundaryGap: [0, 0.01]
                    },
                    series: [
                        {
                            type: 'bar',
                            itemStyle:{
                                normal:{
                                    color:'#01579b'
                                }
                            },
                            data: seriesData
                        }
                    ]
                });
            },
            drawLineChart(xAxisData,seriesData,xLabel,yLabel) {
                var chartLine = echarts.init(document.getElementById("chart0"));
                chartLine.setOption({
                    title: {
                        text: '待预测目标类型分布',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '8%',
                        right: '8%',
                        bottom: '8%',
                        containLabel: true
                    },
                    xAxis: {
                        name:xLabel,
                        nameLocation:'center',
                        nameGap:30,
                        type: 'category',
                        splitLine:{show: true},
                        boundaryGap: false,
                        data: xAxisData,
                    },
                    yAxis: {
                        name:yLabel,
                        nameLocation:'center',
                        splitLine:{show: true},
                        nameGap:50,
                        type: 'value'
                    },
                    series: {
                        type:'line',
                        data:seriesData
                    }
                });
            }
        },
            created(){
                this.uploadAction = process.env.API_ROOT + '/filelist/upload';
            },
            mounted(){

                let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                this.$refs.uploadView.style.height = (h - 60) + 'px';
                this.$refs.container.style.height = (h - 60) + 'px';
                var token = localStorage.getItem('token');
                this.myHeaders = {Authorization: token};

                this.projectId = this.$route.params.projectId;
                this.jobId = this.$route.params.jobId;
                this.sequence = this.$route.params.sequence;
                this.projectName = this.$route.params.name;
                this.progress = this.$route.params.progress;

                //如果当前在数据监测，则显示特征列表页
                if(this.progress=='feature_analyse'){
                    this.currentPage = 'dataCheckView';
                }
                this.queryJobInfo();
                var param = {jobId: this.jobId};
                var that = this;
                getJobProgress(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        window.clearInterval(timer);
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        if(data.data.jobStatus=='failed'){
                            that.$message({
                                message: data.data.reason,
                                type: 'error'
                            });
                        }
                    }
                });
            },
            destroyed(){
                window.clearInterval(window.timer);
            }

    }
</script>

<style lang="scss" type="text/scss">
    #uploadPage {

        #uploadView {
            overflow: hidden;
            .left, .right {
                min-height: 100%;
            }
            .left {
                width: 80%;
                float: left;
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
                margin-top: 100px;
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

                line-height: 23px;
                color: white;
            }
            .file-item:first-child {
                border-top: 1px solid #ccc;
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
        #dataCheckView {

            .step-bar {
                el-steps--simple {
                    border-radius: 0;
                }
            }
            .box {
                padding: 30px;
            }
            .start-btn {
                border-radius: 100px;
                height: 200px;
                width: 200px;
                font-size: 40px;
                background: transparent;
                color: black;
                border: 2px solid;
            }
            .predict-label-input input {
                min-width: 200px;
                width: 100%;
            }
            #chart0, #chart1 {
                width: 300px;
                height: 300px;
            }
        }
    }
</style>