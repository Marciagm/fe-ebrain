<template>
    <section id="resultView">
        <div style="height: 100px;padding:15px;">
            <el-row>
                <el-col :span="20">
                    <h3>数据文件</h3>
                    <p>文件大小：{{this.sourceData.fileSize}}； 异常数据行数：{{this.sourceDataResult.badTotalRows}}行；文件总行数：{{this.sourceDataResult.totalRows}}行</p>
                </el-col>
                <el-col :span="4" style="line-height: 100px;">
                    <el-button @click="viewModelDetail">查询模型详情</el-button>
                </el-col>
            </el-row>
        </div>
        <div style="padding: 15px">
            <el-tabs type="card">
                <el-tab-pane label="预测结果">
                    <div style="padding: 10px 30px">
                        <el-button @click="downloadPredictReportFile">预测结果下载</el-button>
                    </div>
                    <template>
                        <dynamic-table :headers="[]" :list="this.predictResult"></dynamic-table>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="整体报告">
                    <div style="padding: 10px 30px">
                        <el-button>整体报告下载</el-button>
                    </div>
                    <el-row style="padding:10px 30px">
                        <el-col :span="24">
                            <span class="block-title">一、预测总览</span>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">1.模型概要</span>
                        </el-col>
                        <el-col :span="24" style="padding-left:44px">
                            <table class="info-table">
                                <tbody>
                                <tr>
                                    <!--<td>总训练耗时：</td>
                                    <td>{{labelData.file_size}}</td>-->
                                    <td>算法名称：</td>
                                    <td>{{modelData.model_name}}</td>
                                    <td>准确率：</td>
                                    <td>{{modelData.threshold}}%</td>
                                    <td>AUC：</td>
                                    <td>{{modelData.auc}}</td>
                                    <!-- <td>模型大小：</td>
                                     <td>{{labelData.total_instance_count}}</td>-->
                                </tr>
                                </tbody>
                            </table>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">2.特征重要性</span>
                        </el-col>
                        <el-col :span="12" class="block">
                            <div>
                                预测结果是由特征来决定的，<br>
                                哪些特征对结果影响最大，<br>
                                可通过右图的特征重要性图表来进行解释
                            </div>
                        </el-col>
                        <el-col :span="12" class="block">
                            <div id="chart0"></div>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-title">二、预测详情</span>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">1.数据文件概况</span>
                        </el-col>
                        <el-col :span="12"  style="padding-left:44px">
                            <table class="info-table">
                                <tbody>
                                <tr>
                                    <td>文件大小：</td>
                                    <td>{{labelData.file_size}}</td>
                                    <td>行数：</td>
                                    <td>{{labelData.total_instance_count}}</td>
                                </tr>
                                <tr>
                                    <td>训练样本数：</td>
                                    <td>{{labelData.validate_instance_count}}</td>
                                    <td>预测样本数</td>
                                    <td>{{labelData.validate_instance_count}}</td>
                                </tr>
                                <tr>
                                    <td>异常数据：</td>
                                    <td>{{labelData.except_instance_count}}</td>
                                    <td>特征列数：</td>
                                    <td>{{labelData.column_count}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </el-col>
                        <el-col :span="12">
                            <div id="chart1"></div>
                        </el-col>
                        <el-col :span="24" style="padding-left:44px">
                            <el-table
                                    :data="tableData1"
                                    border
                                    style="width: 100%;height: 350px;overflow: auto;">
                                <el-table-column
                                        prop="feature_name"
                                        label="特征"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="type"
                                        label="特征类型"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="value_count"
                                        label="单一个数">
                                </el-table-column>
                                <el-table-column
                                        prop="miss"
                                        label="缺少情况">
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
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">2.训练分析</span>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">1）Lift chart（提升图）</span>
                        </el-col>
                        <el-col :span="12">
                            <div id="chart2"></div>
                        </el-col>
                        <el-col :span="12" class="block">
                            <div style="padding: 15px 0" class="explain">
                                提升图是对模型训练效果的一个评估，<br>是模型捕捉到的所有正响应，对比真实分类<br>情况的表现。横坐标是把训练集数据分成<br>100等份，纵坐标是每一等份数据预测效果<br>
                                提升率，蓝色线是基准线，即随机预测的效<br>果
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">2）准确&召回率</span>
                        </el-col>
                        <el-col :span="12">
                            <div id="chart3"></div>
                        </el-col>
                        <el-col :span="12" class="block">
                            <div style="padding: 15px 0" class="explain">
                                <p>
                                    准确率：预测为正的样本中有多少是真正的正样本，蓝色线条表示。
                                </p>
                                <p>
                                    召回率：是针对我们原来的样本而言的，它表示的是样本中的正例有多少被预测正确了，红色线条表示。
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">3）KS Chart</span>
                        </el-col>
                        <el-col :span="12">
                            <div id="chart5"></div>
                        </el-col>
                        <el-col :span="12" class="block">
                            <div style="padding: 15px 0" class="explain">
                                <p>
                                    红色线条代表TPR: 所有真实的“1”中，有多少被模型成功选出
                                </p>
                                <p>
                                    蓝色线条代表FPR: 所有真实的“0”中，有多少被模型误判为1了
                                </p>
                                <p>
                                    横坐标为样本数量，纵坐标为预测的准确率
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <span class="block-sub-title">3）ROC曲线</span>
                        </el-col>
                        <el-col :span="12">
                            <div id="chart4"></div>
                        </el-col>
                        <el-col :span="12" class="block">
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
                                <div style="padding: 15px 0" class="explain">
                                    <p>
                                        横轴FPR: FPR越大，预测正类中实际负类越多。
                                    </p>
                                    <p>
                                        纵轴TPR： TPR越大，预测正类中实际正类越多。
                                    </p>
                                    <p>
                                        理想目标：TPR=1，FPR=0,即图中(0,1)点，故ROC曲线越靠拢(0,1)点，越偏离45度对
                                    </p>

                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="原始数据">
                    <div style="padding: 10px 0">
                    </div>
                    <template>
                        <dynamic-table  :headers="[]" :list="this.sourceDataResult.dataList"></dynamic-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div>
            <el-button type="primary" class="restart-btn" @click="restart">重新预测</el-button>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                :show-close=false
                :center=true>
            <span>生成模型详细报告需要较长时间，是否继续？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDialogOk">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import { downloadPredictReport,downloadModelReport,viewModelDetailReport,getSourceFileDataResult,getDataResult,getTrainResult,getModelExplain,getPredictResult } from '../api/api';
    import echarts from 'echarts';
    import DynamicTable from "@/components//DynamicTable.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    export default {
        data() {
            return {
                fileId:"",
                chartBar: null,
                predictResult: [],
                sourceData:{},
                sourceDataResult:{},
                labelData:[],
                projectId:"",
                jobId:"",
                sequence:0,
                dialogVisible:false,
                modelExplain:{},
                modelData:{},
                tableData1:[],
                barData:{},
                confusion_matrix:[]
            };
        },
        components:{
            ElButton,
            ElCol,
            DynamicTable,
        },
        methods: {
            formatJobType: function (row, column) {
                return row.job_type == 'binary_classify' ? '分类' :  '回归';
            },
            querySourceFileData(ev){
                var param={fileId:this.fileId};
                getSourceFileDataResult(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.sourceData = data.data;
                        this.sourceDataResult =JSON.parse(data.data.dataResult);
                       // console.log(this.sourceDataResult)
                    }
                });
            },
            queryDataResult(ev) {
                var _this = this;
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                //var param={projectId:11,jobId:22,sequence:3};
                getDataResult(param).then(data=>{
                    let { msg, code } = data;
                   // console.log(data)
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        //console.log(data.data.dataResult)
                        if(data.data && data.data.dataResult){
                            this.labelData = JSON.parse(data.data.dataResult || {});
                            var datas = this.labelData.feature_and_label;
                            this.tableData1 = datas.slice(1,datas.length);
                            var feature_and_label = datas[0];
                            if(feature_and_label.type==0){
                                var xAxisData=[];
                                var barSeriesData=[];
                                for (var i=0;i< feature_and_label.value_count;i++){
                                    var obj = feature_and_label.value_top_frequence[i];
                                    xAxisData.push(obj.value);
                                    barSeriesData.push(obj.frequence);
                                }
                                this.drawBarChart(xAxisData,barSeriesData);
                            }else{

                            }

                        }
                    }
                });
            },
            queryModelExplain(ev) {
                var _this = this;
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                //var param={projectId:1,jobId:2,sequence:33};
                getModelExplain(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.modelExplain = JSON.parse(data.data.modelExplain);
                        this.modelData={model_name:this.modelExplain.models[0].model_name,
                            threshold:this.modelExplain.models[0].precise_recall.threshold,
                            auc:this.modelExplain.models[0].roc.auc
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
            queryTrainResult(ev) {
                var _this = this;
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                getTrainResult(param).then(data=>{
                    let { msg, code } = data;

                    if (code >0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.modelExplain= data.data;
                    }
                });
            },
            queryPredictResult(ev) {
                var _this = this;
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                getPredictResult(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                       // var result= JSON.parse(data.data.predictResult || {});
                        var result = eval('(' +data.data.predictResult+ ')');
                        for(var ii=0;ii<result.dataList.length;ii++){
                            this.predictResult.push(result.dataList[ii]);
                        }
                        this.predictHeader=[];
                        //this.predictResult = result.dataList;
                        //console.log(this.predictResult);
                        var temp;
                        for(var i=0;i<result.dataList.length;i++){
                            temp=result.dataList[0];
                            result.dataList[0]=result.dataList[1];
                            result.dataList[1]=temp;
                        }
                       // console.log(this.predictResult)
                    }
                });
            },

            downloadPredictReportFile(){
                //var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                //downloadPredictReport(param);
                var url=process.env.API_ROOT+"/project/download-predict-result/"+this.projectId+"/"+this.jobId+"/"+this.sequence;
                window.open(url);
            },
            downloadModelReportFile(){
                var param={};
                downloadModelReport(param).then(data=>{
                    let { msg, code } = data;
                    if (code >0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    }
                });
            },
            viewModelDetail(){
                this.dialogVisible=true;
            },
            handleDialogOk(){
                this.dialogVisible=false;
                //this.$router.push({ path: '/main/modelDetailView/'+this.projectId+"/"+this.jobId+"/"+this.sequence });
                var url='/#/main/modelDetailView/'+this.projectId+"/"+this.jobId+"/"+this.sequence;
                window.open(url);
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
            restart(){
                localStorage.removeItem("jobInfo");
                this.$router.push({ path: '/main/uploadView' });
            },

        },
        computed: {

        },
        mounted(){
            localStorage.removeItem("jobInfo");
            this.projectId = this.$route.params.projectId;
            this.jobId = this.$route.params.jobId;
            this.sequence = this.$route.params.sequence;
            this.fileId = this.$route.params.fileId;
            this.querySourceFileData();
            this.queryDataResult();
            this.queryPredictResult();
            this.queryTrainResult();
            this.queryModelExplain();
        }
    }

</script>

<style lang="scss">
    @import '~scss_vars';
    #resultView{
        background-color: white;
        height: 100%;
        .view-detail-btn{
            line-height: 130px;
            text-align: right;
            padding-right: 15px;
        }
        .el-tabs--border-card{
            height: 450px;
            border: none;
        }
        .el-popover, .el-tabs--border-card{
            box-shadow:none;
        }
        .restart-btn{
            width: 150px;
            height: 40px;
            font-size: 18px;
            float: right;
            margin: 30px;
        }
        .el-tabs__item.is-active{
            background: #006bc7;
            color: white;
            border: 1px solid #d1dbe5;
            border-bottom-color: #fff;
            border-radius:0;
        }
        .el-tabs__item:hover{
            background: #cccccc;
        }
        .el-table.count-table{
            height: 350px;
            overflow: auto;
        }
        .info-table tr td{
            width:120px;
            padding: 12px 0;
            min-width: 0;
            box-sizing: border-box;
            text-overflow: ellipsis;
            vertical-align: middle;
            position: relative;
        }

        #chart0,#chart1,#chart2,#chart3,#chart4,#chart5{
            width: 450px;
            height:400px;
            margin:30px;
        }
        .block-title{
            font-size:18px;
            height: 50px;
            line-height: 50px;
        }
        .block-sub-title{
            font-size:18px;
            height: 40px;
            line-height: 40px;
            padding-left:44px;
        }
        .block{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 360px;
        }
        .explain{
            font-size: 20px;
            line-height: 44px;
        }
        #trueValueTable,#trueValueTable tr td{
            border-collapse:collapse;
            border:1px solid #ccc;
            text-align: center;
            vertical-align: middle;
            height:35px;
        }
    }

</style>