<template>
    <section id="modelDetail">
        <div class="step-bar">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="准备数据"></el-step>
                <el-step title="检查数据"></el-step>
                <el-step title="正在运行"></el-step>
                <el-step title="准备预测"></el-step>
            </el-steps>
        </div>
        <el-row>
            <el-col style="text-align: right;">
                <el-button @click="updateFile">更新</el-button>
            </el-col>
        </el-row>
        <div class="box">
            <div v-show="showModelDetail" style="margin-bottom: 30px;">
                <el-row class="header">
                    <el-col :span="4">模型名称</el-col>
                    <el-col :span="4">准确率</el-col>
                    <el-col :span="4">模型大小</el-col>
                    <el-col :span="4">AUC</el-col>
                    <el-col :span="3">训练时间</el-col>
                    <el-col :span="3" style="text-align: center">操作</el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" v-show="isLoading" style="text-align: center">
                        <el-button :loading="isLoading" type="text">加载中...</el-button>
                    </el-col>
                    <el-col :span="24" v-show="!isLoading">
                        <el-collapse accordion>
                            <el-collapse-item>
                                <template slot="title">
                                    <el-row style="border-bottom: 1px solid #e6ebf5;">
                                        <el-col :span="4">{{modelData.model_name}}</el-col>
                                        <el-col :span="4">{{modelData.precise}}</el-col>
                                        <el-col :span="4">{{modelData.model_size}}</el-col>
                                        <el-col :span="4">{{modelData.auc}}</el-col>
                                        <el-col :span="3">{{modelData.train_time}}</el-col>
                                        <el-col :span="3" style="text-align: center;">
                                            <span style="color:#006bc7;" @click="startPredict(modelData)">预测</span>
                                        </el-col>
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
                                                                <div id="chart0"></div>
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
                                                                <div id="chart2"></div>
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
                                                                <div id="chart3"></div>
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
                                                                <div id="chart5"></div>
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
                                                                <div id="chart4"></div>
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
                                                        <table id="trueValueTable" style="width: 100%" v-if="confusion_matrix.length>0">
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
                    </el-col>
                </el-row>
            </div>
            <div style="height: 400px">
                <el-row v-show="!showModelDetail">
                    <el-col :span="24">
                        <table class="status-table" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th style="text-align: left;padding-left:10px">
                                        算法名称
                                    </th>
                                    <th>
                                        训练进度
                                    </th>
                                    <th>
                                        CPU使用量
                                    </th>
                                    <th>
                                        内存占用量
                                    </th>
                                    <th>
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="job in jobInfo">
                                <td style="text-align: left;padding-left:10px">
                                    <i class="el-icon-star-on">{{job.algorithm}}</i>
                                </td>
                                <td width="400" style="text-align: center;">
                                    <div>
                                        <div>{{runPercentage}}%</div>
                                        <div><el-progress :percentage="runPercentage" :show-text="false"></el-progress></div>
                                    </div>
                                </td>
                                <td width="200" style="text-align: center;">
                                    CPU:<span>{{job.cpu || 1}}%</span>;
                                </td>
                                <td width="200" style="text-align: center;">
                                    内存:<span>{{job.mem || 1}}KB</span>;
                                </td>
                                <td width="200" style="text-align: center;">
                                    <el-button type="text" @click="stop(job)">终止</el-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </el-col>
                </el-row>
            </div>
        </div>

    </section>

</template>

<script>
    import {getModelDetail,getModelExplain,getJobInfo} from '../api/api';
    import echarts from 'echarts';
    import DynamicTable from "@/components//DynamicTable.vue";
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
                active:3,
                dialogNewModelVisible:false,
                modelExplain:{},
                modelData:{},
                tableData1:[],
                barData:{},
                confusion_matrix:[],
                activeName: 'tab1',
                jobInfo:{},
                runPercentage:0,
                showModelDetail:true,
                isLoading:true,
            }
        },
        methods: {
            queryJobInfo(){
                var that = this;
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                window.clearInterval(window.timer);
                window.timer = setInterval(() => { //每分钟查询一次任务状态
                    getJobInfo(param).then(data=>{
                        let { msg, code } = data;
                        if (code > 0) {
                            window.clearInterval(window.timer);
                            this.$message({
                                message: msg,
                                type: 'error'
                            });
                        } else {
                            that.jobInfo = JSON.parse(data.data.reason);
                            //this.jobInfo = JSON.parse('[{"algorithm":"gbdt","job_statues":" START", "total_step":"246", "ratio":1.00, "stage_name":"TRAIN"}]');

                            if(data.data.jobStatus=='FINISHED' || data.data.jobStatus=='finish'){
                                window.clearInterval(window.timer);
                                that.runPercentage=99;
                                setTimeout(function(){
                                    that.showModelDetail=true;
                                    that.queryModelDetail();
                                },1000);
                            }else{
                                that.runPercentage=Math.ceil(that.jobInfo.ratio || 0 * 100);
                            }

                        }
                    });
                },5000);

            },
            showNewModelDialog(){
                this.dialogNewModelVisible = true;
            },
            saveModel(){
                this.dialogNewModelVisible=false;
                this.$router.push({ path: '/main/fileSelectView' });
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
                        this.modelExplain = JSON.parse(data.data.modelExplain);
                        this.modelData={model_name:this.modelExplain.models[0].model_name,
                            precise:this.modelExplain.precise+"%",
                            model_size:this.modelExplain.models[0].model_size,
                            train_time:this.modelExplain.models[0].train_time,
                            auc:this.modelExplain.models[0].roc.auc||'-'
                        };
                        this.confusion_matrix = this.modelExplain.models[0].confusion_matrix;

                        var feature_importance_chart = this.modelExplain.models[0].feature_importance;
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
                        this.drawFeatureBarChart("chart0",feature_importanceChartData);

                        var lift_chart = this.modelExplain.models[0].lift_chart[0].x_y;
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
                        this.drawLineChart("chart2",liftChartData);

                        var ksChartData={};
                        var ks_chart = this.modelExplain.models[0].ks[0].x_y;
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
                        this.drawLineChart("chart5",ksChartData);

                        var rocChartData={};
                        var roc_chart = this.modelExplain.models[0].roc.x_y;
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
                        this.drawLineChart("chart4",rocChartData);


                        var recallChartData={};
                        var recall_chart = this.modelExplain.models[0].precise_recall.x_y;
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
                        this.drawLineChart("chart3",recallChartData);
                    }
                });
            },
            drawBarChart(xAxisData,barSeriesData) {
                this.chartBar = echarts.init(document.getElementById('chart1'));
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
                console.log(targetId);
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
            startPredict(modelData){
                this.$router.push({ path: '/main/predictView/'+this.projectId+"/"+this.jobId+"/"+this.sequence+"/"+ modelData.model_name});
            },
            updateFile(){
                this.$router.push({ path: '/main/uploadView/'+this.projectId+"/"+this.jobId+"/"+(this.sequence+1)});
            },
            stop(job){

            },

        },
        mounted(){
            this.projectId = this.$route.params.projectId;
            this.jobId = this.$route.params.jobId;
            this.sequence = this.$route.params.sequence;
            this.showModelDetail=this.$route.params.state;
            this.queryJobInfo();
        },
        destroyed(){
            console.log("destory");
            window.clearInterval(window.timer);
        }
    }
</script>

<style lang="scss" type="text/scss">
    #modelDetail{
        .step-bar{
            padding: 30px 15px;
        }
        .box {
            min-height: 500px;
            background: white;
            border: 1px solid #1d8ce0;
            margin-top: 15px;

            .header{
                height: 45px;
                background: #1d8ce0;
                line-height: 45px;
            }
        }
        #chart0,#chart1,#chart2,#chart3,#chart4,#chart5{
            width: 450px;
            height:400px;
            margin:30px;
        }
        #trueValueTable,#trueValueTable tr td{
            border-collapse:collapse;
            border:1px solid #ccc;
            text-align: center;
            vertical-align: middle;
            height:35px;
        }

        .explain{
            line-height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 450px;
            height:400px;
        }
        .explain div{
            width: 200px;
        }

        .status-table{
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
</style>