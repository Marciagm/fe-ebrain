<template>
    <el-row>
        <el-col :span="20" :offset="2">
            <section id="resultPage">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="model-name">模型名称：{{projectInfo.projectName}}</span>
                        <span style="float: right; padding: 3px 0">
                    <span style="padding-right: 15px;">创建时间：{{projectInfo.createTime}}</span>
                    <el-button @click="updateModel" v-if="!hasRunning" type="primary">更新模型</el-button>
                    <el-button @click="viewModel" v-if="hasRunning" type="primary">未完成模型</el-button>
                </span>
                    </div>
                    <div>
                        <p class="model-desc">
                            模型描述：{{projectInfo.projectDesc}}
                        </p>
                    </div>
                </el-card>
                <el-row>
                    <el-col :span="12">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-size: 18px">算法：v{{currentVersion}}-{{currentModel.model_name}}</span>
                                <span style="float: right; padding: 3px 0">
                            <span style="padding-right: 15px;">创建时间：{{currentModel.createTime}}</span>
                            <el-button type="primary" :disabled="!canPredict" @click="predict(cmodel)">预测</el-button>
                        </span>
                            </div>
                            <div style="text-align: center">
                                <el-row>
                                    <el-col :span="6">{{currentModel.precise_recall.precise || '-'}}</el-col>
                                    <el-col :span="6">{{currentModel.roc.auc || '-'}}</el-col>
                                    <el-col :span="6">{{currentModel.model_size || '-'}}</el-col>
                                    <el-col :span="6">{{currentModel.train_time || '-'}}</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6">准确率</el-col>
                                    <el-col :span="6">AUC</el-col>
                                    <el-col :span="6">模型大小</el-col>
                                    <el-col :span="6">训练时长</el-col>
                                </el-row>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card class="box-card">
                            <div style="height: 142px;line-height:60px">
                                <el-row>
                                    <el-col :span="4">
                                        选择模型版本：
                                    </el-col>
                                    <el-col :span="20">
                                        <el-button size="mini" round
                                                   :type="m.sequence== currentVersion ? 'primary':'default'"
                                                   v-for="(m,index) in modelJobList"
                                                   @click="changeVersion(m,index,0)" :index="parentIndex">
                                            v{{m.sequence}}
                                        </el-button>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="4">
                                        选择算法：
                                    </el-col>
                                    <el-col :span="20">
                                        <el-button size="mini" round v-for="(mm,subIndex) in modelList"
                                                   :type="mm.model_name== currentAlgorithm ? 'primary':'default'"
                                                   @click="changeVersion(modelJobList[parentIndex],parentIndex,subIndex)"
                                                   :index="subIndex">{{mm.model_name}}
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-card class="box-card" v-show="canPredict">
                            <div>
                                <el-tabs v-model="tabActive" type="card">
                                    <el-tab-pane label="特征重要性" name="2">
                                        <div>
                                            <el-row>
                                                <el-col :span="12" class="block left-block">
                                                    <div class="explain">
                                                        <div>预测结果是由特征来决定的，<br/>
                                                            哪些特征对结果影响最大，<br/>
                                                            可通过右图的特征重要性图表来进行解释
                                                        </div>
                                                    </div>
                                                </el-col>
                                                <el-col :span="12" class="block">
                                                    <div id="chart0"></div>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="准确率&召回率" name="3">
                                        <div>
                                            <el-row>
                                                <el-col :span="12" class="left-block">
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
                                    </el-tab-pane>
                                    <el-tab-pane label="混淆矩阵" name="4">
                                        <div>
                                            <table id="trueValueTable" style="width: 100%"
                                                   v-if="confusion_matrix.length>0">
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
                                                        <span>{{confusion_matrix[1][2].value}}</span>
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
                                                        <span>{{confusion_matrix[2][2].value}}</span>
                                                        <span style="font-size: 12px">({{Math.floor(confusion_matrix[2][2].percent*100)}}%)</span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="ROC曲线" name="5">
                                        <div>
                                            <el-row>
                                                <el-col :span="12" class="left-block">
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
                                    </el-tab-pane>
                                    <el-tab-pane label="提升图" name="6">
                                        <div>
                                            <el-row>
                                                <el-col :span="12" class="left-block">
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
                                    </el-tab-pane>
                                    <el-tab-pane label="KS曲线" name="7">
                                        <div>
                                            <el-row>
                                                <el-col :span="12" class="left-block">
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
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import {
        getProject,
        getJobList,
        newJob,
        getModelExplain,
        getPredictResultAndDetail,
        getPredictHistory
    } from '../api/api';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import moment from 'moment';
    import echarts from 'echarts';
    export default {
        components: {
            ElCol,
            ElRow,
            ElButton
        },
        data() {
            return {
                projectInfo: {},
                currentJob: {},
                runningJob: {},
                canPredict: false,
                currentVersion: '-',
                isLoading: false,
                hasRunning: false,
                projectId: 0,
                list: [],
                msgs: {
                    "0": "数据处理",
                    feature_analyse: "特征分析...",
                    train: '模型训练...',
                    predict: '正在预测...',
                    predict_explain: "模型解释..."
                },
                steps: {'failed': '失败', 'running': '运行中', 'finish': '完成', "waiting": "等待"},
                modelJobList: [],
                modelList: [],
                currentModel: {
                    precise_recall: {
                        precise: 0
                    },
                    roc: {},

                },
                algorithmList: [],
                currentAlgorithm: '-',
                tabActive: "1",
                predictTableData: [],
                confusion_matrix: {},
                parentIndex: 0,
                subIndex: 0,
                chartList: {},
                cmodel: {},
            }
        },
        methods: {
            updateModel(){ //更新模型
                var that = this;
                newJob(that.projectId, []).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        that.jobId = data.data.tid;
                        that.sequence = data.data.sequence;
                        //job状态保存，退出再进使用
                        var jobInfo = this.projectId + "/" + this.jobId + "/" + this.sequence + "/" + this.projectInfo.projectName + "/0";
                        this.$router.push({path: '/main/uploadView/' + jobInfo});
                    }
                });
            },
            viewModel(){//查看未完成模型
                if (this.runningJob.progress == '0') {
                    //console.log("1progress=="+this.runningJob.progress);
                    this.$router.push({path: '/main/uploadView/' + this.runningJob.projectId + "/" + this.runningJob.tid + "/" + this.runningJob.sequence + "/" + this.projectInfo.projectName + "/" + this.runningJob.progress});
                } else if (this.runningJob.progress == 'train') {
                    //console.log("2progress=="+this.runningJob.progress);
                    this.$router.push({path: '/main/trainingView/' + this.projectId + "/" + this.jobId + "/" + this.sequence});
                    //this.$router.push({ path: '/main/uploadView/'+this.runningJob.projectId+"/"+this.runningJob.tid+"/"+this.runningJob.sequence+"/"+this.projectInfo.projectName+"/"+this.runningJob.progress});
                } else {
                    //console.log("3progress=="+this.runningJob.progress);
                    this.$router.push({path: '/main/uploadView/' + this.runningJob.projectId + "/" + this.runningJob.tid + "/" + this.runningJob.sequence + "/" + this.projectInfo.projectName + "/" + this.runningJob.progress});
                    // this.$router.push({ path: '/main/modelDetail/'+this.runningJob.projectId+'/'+this.runningJob.tid+'/'+this.runningJob.sequence+"/true" });
                }
            },
            changeVersion(v, index, subIndex){
                console.log(v, index, subIndex)
                this.parentIndex = index;
                this.cmodel = v;
                this.currentVersion = v.sequence;

                if (v.jobStatus == 'finish' && v.progress == 'train') {
                    let param = {
                        projectId: v.projectId,
                        jobId: v.tid,
                        sequence: v.sequence,
                    };
                    this.canPredict = true;
                    this.queryModelExplain(param, index, subIndex);
                } else {
                    this.canPredict = false;
                    // this.modelList=[];
                    this.clearChart();
                }

            },
            predict(model){
                console.log(model);
                //console.log('/main/predictView/'+this.currentJob.projectId+'/'+this.currentJob.tid+'/'+this.currentVersion+"/"+this.currentAlgorithm);
                this.$router.push({path: '/main/predictView/' + model.projectId + '/' + model.tid + '/' + model.sequence + "/" + this.currentAlgorithm});
            },
            queryProjectInfo(){ //查询模型基本信息
                let param = {
                    projectId: this.projectId,
                };
                getProject(param).then(data => {
                    this.isLoading = false;
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.projectInfo = data.data;
                        this.queryJobList();
                    }
                });
            },
            queryJobList(){
                let param = {
                    "projectId": this.projectId,
                };
                this.isLoading = true;
                getJobList(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.modelJobList = data.data;
                        this.currentJob = this.modelJobList[0];
                        this.currentVersion = this.modelJobList[0].sequence;
                        if (this.modelJobList[0].jobStatus == 'finish' && this.modelJobList[0].progress == 'train') {
                            this.cmodel = this.modelJobList[0];
                            this.hasRunning = false;
                            this.canPredict = true;
                            let param = {
                                projectId: this.projectId,
                                jobId: this.modelJobList[0].tid,
                                sequence: this.currentVersion,
                            };
                            this.queryModelExplain(param, 0, 0);
                        } else {
                            //console.log(2)
                            this.hasRunning = true;
                            this.canPredict = false;
                            this.runningJob = this.modelJobList[0];
                        }

                    }
                });

            },
            queryModelExplain(param, index, subIndex){
                getModelExplain(param).then(data => {
                    this.isLoading = false;
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        var modelExplain = JSON.parse(data.data.modelExplain);
                        this.modelList = modelExplain.models;
                        this.currentModel = this.modelList[subIndex];
                        //console.log(this.currentModel)

                        this.currentAlgorithm = this.currentModel.model_name;
                        this.queryPredictHistory(param);
                        this.drawChart(this.currentModel);
                    }
                });


            },
            queryPredictHistory(param){//查询预测历史
                getPredictHistory(param).then(data => {
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.predictTableData = data.data;
                        //console.log(this.predictTableData);
                    }
                });
            },
            drawChart(modelExplain){
                this.modelData = {
                    model_name: modelExplain.model_name,
                    threshold: modelExplain.precise_recall.threshold,
                    auc: modelExplain.roc.auc
                };
                this.confusion_matrix = modelExplain.confusion_matrix;

                var feature_importance_chart = modelExplain.feature_importance;
                var feature_importance_yAxisData = [];
                var feature_importance_seriesData = [];
                for (var i = 0; i < feature_importance_chart.length; i++) {
                    feature_importance_seriesData.push(feature_importance_chart[i].contribution);
                    feature_importance_yAxisData.push(feature_importance_chart[i].feature_name);
                }
                var feature_importanceChartData = {
                    yAxisData: feature_importance_yAxisData,
                    seriesData: [{
                        name: '特征重要性',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#006bc7',
                            }
                        },
                        data: feature_importance_seriesData
                    }],
                    legendData: []
                };
                this.drawFeatureBarChart("chart0", feature_importanceChartData);

                var lift_chart = modelExplain.lift_chart[0].x_y;
                var xAxisData = [];
                var seriesData = [];
                var baseLineData = [];
                for (var i = 0; i < lift_chart.length; i++) {
                    xAxisData.push(lift_chart[i].x);
                    seriesData.push(lift_chart[i].y);
                    baseLineData.push(1);
                }
                xAxisData.push(1.5);
                var liftChartData = {
                    xAxisData: xAxisData,
                    seriesData: [{
                        name: 'Lift Curve',
                        type: 'line',
                        data: seriesData
                    }, {
                        name: 'Base Line',
                        type: 'line',
                        data: baseLineData
                    }],
                    legendData: ["Lift Curve", "BaseLine"]
                };
                this.drawLineChart("chart2", liftChartData);

                var ksChartData = {};
                var ks_chart = modelExplain.ks[0].x_y;
                var ks_xAxisData = [];
                var ks_seriesData1 = [];
                var ks_seriesData2 = [];
                for (var i = 0; i < ks_chart.length; i++) {
                    ks_xAxisData.push(ks_chart[i].x);
                    ks_seriesData1.push(ks_chart[i].y_tpr);
                    ks_seriesData2.push(ks_chart[i].y_fpr);
                }
                ks_xAxisData.push(1.5);
                var ksChartData = {
                    xAxisData: ks_xAxisData,
                    seriesData: [{
                        name: 'K',
                        type: 'line',
                        data: ks_seriesData1
                    }, {
                        name: 'S',
                        type: 'line',
                        data: ks_seriesData2
                    }],
                    legendData: ["K", 'S']
                };
                //console.log(ksChartData)
                this.drawLineChart("chart5", ksChartData);

                var rocChartData = {};
                var roc_chart = modelExplain.roc.x_y;
                var roc_xAxisData = [];
                var roc_seriesData = [];
                for (var i = 0; i < roc_chart.length; i++) {
                    roc_xAxisData.push(roc_chart[i].x_value);
                    roc_seriesData.push(roc_chart[i].y_value);
                }
                roc_xAxisData.push(1.5);
                var rocChartData = {
                    xAxisData: roc_xAxisData,
                    seriesData: [{
                        name: 'ROC',
                        type: 'line',
                        data: roc_seriesData
                    }],
                    legendData: ["ROC"]
                };
                this.drawLineChart("chart4", rocChartData);


                var recallChartData = {};
                var recall_chart = modelExplain.precise_recall.x_y;
                var recall_xAxisData = [];
                var precise_seriesData = [];
                var recall_seriesData = [];
                for (var i = 0; i < recall_chart.length; i++) {
                    recall_xAxisData.push(recall_chart[i].pctr);
                    precise_seriesData.push(recall_chart[i].precise);
                    recall_seriesData.push(recall_chart[i].recall);
                }
                recall_xAxisData.push(1.2);
                var recallChartData = {
                    xAxisData: recall_xAxisData,
                    seriesData: [{
                        name: 'precise',
                        type: 'line',
                        data: precise_seriesData
                    }, {
                        name: 'recall',
                        type: 'line',
                        data: recall_seriesData
                    }],
                    legendData: ["recall", "precise"]
                };
                this.drawLineChart("chart3", recallChartData);
            },
            drawBarChart(xAxisData, barSeriesData) {
                var chartBar = echarts.init(document.getElementById('chart1'));
                this.chartList['chart1'] = chartBar;
                chartBar.setOption({
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
                            itemStyle: {
                                normal: {
                                    color: '#01579b'
                                }
                            },
                            data: barSeriesData
                        }
                    ]
                });
            },
            drawFeatureBarChart(target, data) {
                var featureBar = echarts.init(document.getElementById(target));
                this.chartList[target] = featureBar;
                featureBar.setOption({
                    title: {
                        text: '特征重要性',
                        left: '20%'
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
            drawLineChart(targetId, chartData) {
                //console.log(targetId);
                var chartLine = echarts.init(document.getElementById(targetId));
                this.chartList[targetId] = chartLine;
                chartLine.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: chartData.legendData
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        splitLine: {show: true},
                        type: 'category',
                        boundaryGap: false,
                        data: chartData.xAxisData,
                    },
                    yAxis: {
                        splitLine: {show: true},
                        type: 'value'
                    },
                    series: chartData.seriesData
                });
            },
            clearChart(){
                for (var c in this.chartList) {
                    try {
                        this.chartList[c].dispose();
                    } catch (e) {
                    }

                }
            }
        },
        mounted(){
            this.projectId = this.$route.params.projectId;
            this.queryProjectInfo();
            //this.queryJobList();
        }
    }
</script>

<style lang="scss" type="text/scss">
    #resultPage {
        background: white;
        padding: 15px;
        line-height: 35px;

        .model-name {
            font-size: 24px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 27px;
            letter-spacing: 1px;
            color: #2f2e2e;
        }
        .model-desc {
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 27px;
            letter-spacing: 0px;
            color: #413f3f;
        }

        .box-card {
            margin: 15px;
            border: 1px solid #e6ebf5;
            background-color: none;
            box-shadow: none;
        }
        #chart0, #chart1, #chart2, #chart3, #chart4, #chart5 {
            width: 450px;
            height: 400px;
            margin: 30px;
        }
        .block-title {
            font-size: 18px;
            height: 50px;
            line-height: 50px;
        }
        .block-sub-title {
            font-size: 18px;
            height: 40px;
            line-height: 40px;
            padding-left: 44px;
        }
        .block {
            display: flex;
            justify-content: left;
            align-items: center;
            min-height: 500px;
        }
        .left-block {
            display: flex;
            justify-content: right;
            align-items: center;
        }
        .explain {
            font-size: 20px;
            line-height: 44px;
        }
        #trueValueTable, #trueValueTable tr td {
            border-collapse: collapse;
            border: 1px solid #ccc;
            text-align: center;
            vertical-align: middle;
            height: 35px;
        }
    }
</style>