<template>
    <section id="trainingView">
        <div class="left" ref="left">
            <div class="step-bar">
                <el-steps :active="active" finish-status="success" simple>
                    <el-step title="数据上传"></el-step>
                    <el-step title="数据检查"></el-step>
                    <el-step title="模型训练"></el-step>
                </el-steps>
            </div>
            <div>
                <div class="model-info">
                    <div class="model-name">模型名称：{{ projectInfo.projectName }}</div>
                    <p>
                        模型描述：{{projectInfo.projectDesc || '无'}}
                    </p>
                </div>
                <div class="model-table">
                    <el-row class="header">
                        <el-col :span="4"><el-button type="text" @click="gotoResult">模型名称</el-button></el-col>
                        <el-col :span="4">准确率</el-col>
                        <el-col :span="4">模型大小</el-col>
                        <el-col :span="4">AUC</el-col>
                        <el-col :span="3">训练时间</el-col>
                        <el-col :span="3" style="text-align: center">操作</el-col>
                    </el-row>
                    <div class="body">
                        <el-collapse accordion>
                            <el-collapse-item  v-for="(job, index) in modelJobList">
                                <template slot="title">
                                    <el-row>
                                        <el-col :span="4"><i class="el-icon-loading" v-show="job.loading"></i>{{job.algorithm}}</el-col>
                                        <el-col :span="4">{{job.accuracy_rate || '-'}}</el-col>
                                        <el-col :span="4">{{job.model_size || '-'}}</el-col>
                                        <el-col :span="4">{{job.auc || '-'}}</el-col>
                                        <el-col :span="3">{{job.train_time || '-'}}</el-col>
                                        <el-col :span="3" style="text-align: center"><el-button type="text" @click="goPredict(job.algorithm)">预测</el-button></el-col>
                                    </el-row>
                                </template>
                                <div style="padding:15px;background: #e6ebf5">
                                    <template>
                                        <el-tabs  v-model="activeName">
                                            <el-tab-pane label="特征重要性" name="tab1">
                                                <el-card class="box-card">
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="12" class="block">
                                                                <div class="explain">
                                                                    <div>预测结果是由特征来决定的，
                                                                        哪些特征对结果影响最大，
                                                                        可通过右图的特征重要性图表来进行解释</div>
                                                                </div>
                                                            </el-col>
                                                            <el-col :span="12" class="block">
                                                                <div :id="'chart0_'+index" class="my-chart"></div>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-card>
                                            </el-tab-pane>
                                            <el-tab-pane label="Lift Chart" name="tab2">
                                                <el-card class="box-card">
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <div :id="'chart2_'+index" class="my-chart"></div>
                                                            </el-col>
                                                            <el-col :span="12" class="block">
                                                                <div style="padding: 15px 0" class="explain">
                                                                    <div>
                                                                        提升图是对模型训练效果的一个评估，
                                                                        <br/>
                                                                        是模型捕捉到的所有正响应，对比真实分类情况的表现。
                                                                        <br/>
                                                                        横坐标是把训练集数据分成100等份
                                                                        <br/>
                                                                        纵坐标是每一等份数据预测效果
                                                                        <br/>
                                                                        提升率，蓝色线是基准线，即随机预测的效果
                                                                    </div>
                                                                </div>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-card>
                                            </el-tab-pane>
                                            <el-tab-pane label="准确率&召回率" name="tab3">
                                                <el-card class="box-card">
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <div :id="'chart3_'+index" class="my-chart"></div>
                                                            </el-col>
                                                            <el-col :span="12" class="block">
                                                                <div style="padding: 15px 0" class="explain">
                                                                    <div>
                                                                        准确率：预测为正的样本中有多少是真正的正样本，蓝色线条表示。
                                                                        <br/>
                                                                        召回率：是针对我们原来的样本而言的，它表示的是样本中的正例有多少被预测正确了，红色线条表示。
                                                                    </div>
                                                                </div>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-card>
                                            </el-tab-pane>
                                            <el-tab-pane label="KS Chart" name="tab4">
                                                <el-card class="box-card">
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <div :id="'chart5_'+index" class="my-chart"></div>
                                                            </el-col>
                                                            <el-col :span="12" class="block">
                                                                <div style="padding: 15px 0" class="explain">
                                                                    <div>
                                                                        红色线条代表TPR: 所有真实的“1”中，有多少被模型成功选出
                                                                        <br/>
                                                                        蓝色线条代表FPR: 所有真实的“0”中，有多少被模型误判为1了
                                                                        <br/>
                                                                        横坐标为样本数量，纵坐标为预测的准确率
                                                                    </div>
                                                                </div>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-card>
                                            </el-tab-pane>
                                            <el-tab-pane label="ROC曲线" name="tab5">
                                                <el-card class="box-card">
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <div :id="'chart4_'+index" class="my-chart"></div>
                                                            </el-col>
                                                            <el-col :span="12" class="block">
                                                                <div style="padding: 15px 0" class="explain">
                                                                    <div>
                                                                        横轴FPR: FPR越大，预测正类中实际负类越多。
                                                                        <br/>
                                                                        纵轴TPR： TPR越大，预测正类中实际正类越多。
                                                                        <br/>
                                                                        理想目标：TPR=1，FPR=0,即图中(0,1)点，故ROC曲线越靠拢(0,1)点，越偏离45度对角线越好。
                                                                    </div>
                                                                </div>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-card>
                                            </el-tab-pane>
                                            <el-tab-pane label="混淆矩阵" name="tab6">
                                                <el-card class="box-card">
                                                    <div>
                                                        <table class="status-table" :id="'trueValueTable_'+index" style="width: 100%" v-if="confusion_matrix.length>0">
                                                            <tbody>
                                                            <tr>
                                                                <td rowspan="2" colspan="2"></td>
                                                                <td colspan="2">真实值</td>
                                                            </tr>
                                                            <tr>
                                                                <td>{{confusion_matrix[0][1].value}}</td>
                                                                <td>{{confusion_matrix[0][2].value}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td rowspan="2">预测值</td>
                                                                <td>{{confusion_matrix[1][0].value}}</td>
                                                                <td>
                                                                    <span>{{confusion_matrix[1][1].value}}</span>
                                                                    <span style="font-size: 12px;">({{Math.floor(confusion_matrix[1][1].percent*100)}}%)</span>
                                                                </td>
                                                                <td>
                                                                    <span >{{confusion_matrix[1][2].value}}</span>
                                                                    <span style="font-size: 12px;">({{Math.floor(confusion_matrix[1][2].percent*100)}}%)</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>{{confusion_matrix[2][0].value}}</td>
                                                                <td>
                                                                    <span>{{confusion_matrix[2][1].value}}</span>
                                                                    <span style="font-size: 12px;">({{Math.floor(confusion_matrix[2][1].percent*100)}}%)</span>
                                                                </td>
                                                                <td>
                                                                    <span >{{confusion_matrix[2][2].value}}</span>
                                                                    <span style="font-size: 12px">({{Math.floor(confusion_matrix[2][2].percent*100)}}%)</span>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </el-card>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </template>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>

            </div>
        </div>
        <div class="right" ref="right">
            <div class="aside">
                <el-row class="title">
                    <el-col :span="12">
                        当前进程：{{modelJobList.length}}
                    </el-col>
                    <el-col :span="12">
                        训练计时：<span>{{formatTimeMeter}}</span>
                    </el-col>
                </el-row>
                <div class="content">
                    <div>
                        <el-row v-for="progress in modelJobList" class="algorithm">
                            <el-col :span="24" >
                                <span>{{ progress.algorithm }}</span>
                            </el-col>
                            <el-col :span="24">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="progress.ratio*100"></el-progress>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
    </section>

</template>

<script>
    import{getProject,getJobProgress,getTrainResult,getModelExplain} from '../api/api';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import echarts from 'echarts';
    import moment from 'moment';
    export default {
        components: {
            ElCol,
            ElRow,
            ElButton},
        data() {
            return {
                active:2,
                timeMeter:6,
                timeMeterTimer:false,
                formatTimeMeter:'00:00:00',
                activeName:'tab1',
                projectId:0,
                jobId:0,
                squence:0,
                projectInfo:{},
                trainedResult:[],
                modelList:[],
                uploadProgress:{},
                isLoading:false,
                timer:false,
                modelJobList:[],
                confusion_matrix:{}
            }
        },
        methods: {
            killModel(modelId){

            },
            queryJobInfo(){
                var that = this;
                let param={
                    jobId:that.jobId
                };
                var date = new Date();
                that.timeMeterTimer = window.setInterval(function(){
                    that.formatTimer(date);
                },1000);


                this.timer = window.setInterval(function(){
                    that.queryProgress(param);
                },2000);

            },
            formatTimer(date){
                var that = this;
                var newDate = new Date();
                var h=newDate.getHours()-date.getHours();
                var m=0;
                var s=0;
                if(h<=0){
                    m = newDate.getMinutes()-date.getMinutes();
                }else{
                    m = newDate.getMinutes()
                }
                if(m<=0){
                    s = newDate.getSeconds()-date.getSeconds();
                }else{
                    s = newDate.getSeconds();
                }
                that.formatTimeMeter = h+":"+m+":"+s;
            },
            queryProgress(param){
                var that = this;
                getJobProgress(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        var job = data.data;
                        if(data.data.jobStatus == 'failed'){
                            window.clearInterval(timer);
                            that.$message({
                                message: data.data.reason,
                                type: 'error'
                            });
                        }else if(job.jobStatus=='finish' && job.progress=='train'){
                            window.clearInterval(that.timer);
                            window.clearInterval(that.timeMeterTimer);
                            that.modelJobList = JSON.parse(job.reason);
                            that.queryTrainResult();
                            that.queryModelDetail();
                        }else{
                            that.modelJobList = JSON.parse(job.reason);
                        }
                    }
                });
            },
            queryTrainResult(){
                var that = this;
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                getTrainResult(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        var  result =data.data;
                        that.trainedResult = JSON.parse(result[0].trainedResult).model_info.train_result;
                        //console.log(that.trainedResult);
                    }
                });
            },
            queryProject(){
                var that = this;
                let param={
                    projectId:this.projectId
                };
                getProject(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.projectInfo = data.data;
                    }
                });
            },
            queryModelDetail(){
                let param={
                    projectId:this.projectId,
                    jobId:this.jobId,
                    sequence:this.sequence,
                };
                getModelExplain(param).then(data=>{
                    let { msg, code } = data;
                    this.isLoading=false;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {

                        var models = JSON.parse(data.data.modelExplain).models;
                        for(var mi=0;mi<models.length;mi++){
                            var model = models[mi];
                            this.modelJobList[mi].algorithm = model.model_name;
                            this.modelJobList[mi].accuracy_rate = model.precise_recall.precise;
                            this.modelJobList[mi].model_size = model.model_size;
                            this.modelJobList[mi].auc = model.roc.auc;
                            this.modelJobList[mi].train_time = model.train_time;
                            this.modelJobList[mi].ratio=1;
                            this.modelJobList[mi].loading=false;

                            this.confusion_matrix = model.confusion_matrix;

                            var feature_importance_chart = model.feature_importance;
                            var feature_importance_yAxisData=[];
                            var feature_importance_seriesData=[];
                            for(var i=0;i<feature_importance_chart.length;i++){
                                feature_importance_seriesData.push(feature_importance_chart[i].contribution);
                                feature_importance_yAxisData.push(feature_importance_chart[i].feature_name);
                            }
                            var feature_importanceChartData={
                                yAxisData:feature_importance_yAxisData,
                                seriesData:[{
                                    name: '特征重要性',
                                    type: 'bar',
                                    itemStyle:{
                                        normal:{
                                            color:'#006bc7',
                                        }
                                    },
                                    data: feature_importance_seriesData
                                }],
                                legendData:[]
                            };
                            this.drawFeatureBarChart("chart0_"+mi,feature_importanceChartData);

                            var lift_chart = model.lift_chart[0].x_y;
                            var xAxisData=[];
                            var seriesData=[];
                            var baseLineData=[];
                            for(var i=0;i<lift_chart.length;i++){
                                xAxisData.push(lift_chart[i].x);
                                seriesData.push(lift_chart[i].y);
                                baseLineData.push(1);
                            }
                            xAxisData.push(1.5);
                            var liftChartData={
                                xAxisData:xAxisData,
                                seriesData:[{
                                    name: 'Lift Curve',
                                    type: 'line',
                                    data: seriesData
                                },{
                                    name: 'Base Line',
                                    type: 'line',
                                    data: baseLineData
                                }],
                                legendData:["Lift Curve","BaseLine"]
                            };
                            this.drawLineChart("chart2_"+mi,liftChartData,mi);

                            var ksChartData={};
                            var ks_chart = model.ks[0].x_y;
                            var ks_xAxisData=[];
                            var ks_seriesData1=[];
                            var ks_seriesData2=[];
                            for(var i=0;i<ks_chart.length;i++){
                                ks_xAxisData.push(ks_chart[i].x);
                                ks_seriesData1.push(ks_chart[i].y_tpr);
                                ks_seriesData2.push(ks_chart[i].y_fpr);
                            }
                            ks_xAxisData.push(1.5);
                            var ksChartData={
                                xAxisData:ks_xAxisData,
                                seriesData:[{
                                    name: 'K',
                                    type: 'line',
                                    data: ks_seriesData1
                                },{
                                    name: 'S',
                                    type: 'line',
                                    data: ks_seriesData2
                                }],
                                legendData:["K",'S']
                            };
                            //console.log(ksChartData)
                            this.drawLineChart("chart5_"+mi,ksChartData,mi);

                            var rocChartData={};
                            var roc_chart = model.roc.x_y;
                            var roc_xAxisData=[];
                            var roc_seriesData=[];
                            for(var i=0;i<roc_chart.length;i++){
                                roc_xAxisData.push(roc_chart[i].x_value);
                                roc_seriesData.push(roc_chart[i].y_value);
                            }
                            roc_xAxisData.push(1.5);
                            var rocChartData={
                                xAxisData:roc_xAxisData,
                                seriesData:[{
                                    name: 'ROC',
                                    type: 'line',
                                    data: roc_seriesData
                                }],
                                legendData:["ROC"]
                            };
                            this.drawLineChart("chart4_"+mi,rocChartData,mi);


                            var recallChartData={};
                            var recall_chart = model.precise_recall.x_y;
                            var recall_xAxisData=[];
                            var precise_seriesData=[];
                            var recall_seriesData=[];
                            for(var i=0;i<recall_chart.length;i++){
                                recall_xAxisData.push(recall_chart[i].pctr);
                                precise_seriesData.push(recall_chart[i].precise);
                                recall_seriesData.push(recall_chart[i].recall);
                            }
                            recall_xAxisData.push(1.2);
                            var recallChartData={
                                xAxisData:recall_xAxisData,
                                seriesData:[{
                                    name: 'precise',
                                    type: 'line',
                                    data: precise_seriesData
                                },{
                                    name: 'recall',
                                    type: 'line',
                                    data: recall_seriesData
                                }],
                                legendData:["recall","precise"]
                            };
                            this.drawLineChart("chart3_"+mi,recallChartData,mi);
                        }
                       
                    }
                });
            },
            drawBarChart(target,xAxisData,barSeriesData) {
                this.chartBar = echarts.init(document.getElementById(target));
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
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData,
                        boundaryGap: [0, 0.01]
                    },
                    series: [
                        {
                            type: 'bar',
                            data: barSeriesData
                        }
                    ]
                });
            },
            drawFeatureBarChart(target,data) {
                //console.log(target)
                var featureBar = echarts.init(document.getElementById(target));
                featureBar.setOption({
                    title: {
                        text: '特征重要性',
                        left:'20%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: data.yAxisData,
                    },
                    series: data.seriesData
                });
            },
            drawLineChart(targetId,chartData) {
                //console.log(targetId);
                this.chartLine = echarts.init(document.getElementById(targetId));
                this.chartLine.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:chartData.legendData
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        splitLine:{show: true},
                        type: 'category',
                        boundaryGap: false,
                        data: chartData.xAxisData,
                    },
                    yAxis: {
                        splitLine:{show: true},
                        type: 'value'
                    },
                    series: chartData.seriesData
                });
            },
            handleClick(row){
                this.$router.push({ path: '/main/modelDetail/'+this.projectId+"/"+this.jobId+"/"+this.sequence });
            },
            goPredict(modelName){
                this.$router.push({ path: '/main/predictView/'+this.projectId+'/'+this.jobId+'/'+this.sequence+"/"+modelName });
            },
            gotoResult(){
                this.$router.push({ path: '/main/result/'+this.projectId });
            }
        },
        mounted(){
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.$refs.right.style.height = (h - 60) + 'px';
            this.$refs.left.style.height = (h - 60) + 'px';

            this.jobId = this.$route.params.jobId;
            this.projectId=this.$route.params.projectId;
            this.sequence=this.$route.params.sequence;
            //this.queryTrainResult();
            this.queryProject();
            this.queryJobInfo();

            var that = this;
            window.onresize = function(){
                let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                that.$refs.right.style.height = (h - 60) + 'px';
                that.$refs.left.style.height = (h - 60) + 'px';
            };

        },
        destroyed(){
            window.clearInterval(this.timer);
        }
    }
</script>

<style lang="scss" type="text/scss">
    #trainingView{
        .left, .right {
            min-height: 100%;
        }
        .left {
            width: 80%;
            float: left;
            .step-bar {
                .el-steps--simple {
                    border-radius: 0;
                }
            }

            .model-info{
                padding:15px;

                .model-name{
                    font-size:18px;
                }
            }

            .model-table {
                .header {
                    height: 45px;
                    background: #f5f7fa;
                    color: #1F2D3D;
                    line-height: 45px;
                    font-size: 18px;
                }
                .body {
                    line-height: 40px;
                    font-size: 16px;
                }
                .el-col {
                    padding: 0 10px;
                    text-align: center;
                }

                .my-chart {
                    height: 400px;
                    width: 400px;
                }

            }

             .explain>div{
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 height: 300px;
             }
            .status-table{
                border-collapse:collapse;
                border:1px solid #ccc;
                overflow: hidden;
                width: 100%;
                max-width: 100%;
                background-color: #fff;
                border: 1px solid #dfe6ec;
                font-size: 14px;
                color: #1f2d3d;
                tr{
                    background-color: #fff;
                    td{
                        border-collapse:collapse;
                        border:1px solid #ccc;
                        height: 40px;
                        min-width: 80px;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                        border-bottom: 1px solid #dfe6ec;
                        transition: background-color .25s ease;
                        box-sizing: border-box;
                        white-space: nowrap;
                        position: relative;
                        .cell{
                            padding-left: 18px;
                            padding-right: 18px;
                            box-sizing: border-box;
                            text-overflow: ellipsis;
                        }
                    }
                }
                thead tr:first-child{
                    background-color: #eef1f6;
                    color: #1f2d3d;
                    height:40px;
                }
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

            .aside{

                border-top: 1px solid #ccc;
                color:white;

                .title{
                    line-height: 50px;
                    height: 50px;
                    font-size:16px;
                }
                .content{
                    font-size:16px;

                    .algorithm{
                        padding:0 15px;
                        line-height: 30px;
                        border-bottom: 1px solid #ccc;
                        padding: 5px;
                    }
                }

                .el-progress-bar__outer{
                    border-radius:0;
                }
                .el-progress-bar__inner{
                    border-radius:0;
                }
            }

        }




    }
</style>