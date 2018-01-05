<template>
    <section id="resultView">
       <el-row>
           <el-col :span="14">
               <div class="model-info">
                   <el-card class="box-card">
                       <div slot="header" class="clearfix">
                           <span>{{projectInfo.projectName}}</span>
                       </div>
                       <div>
                           <div>{{projectInfo.projectDesc}}</div>
                           <el-row>
                               <el-col :span="16">
                                   <div>创建时间：{{projectInfo.createTime}}</div>
                                   <div>最近更新：{{projectInfo.updateTime || projectInfo.createTime}}</div>
                               </el-col>
                               <el-col :span="8" style="height: 70px;display: flex;align-items: center;justify-content: flex-end;">
                                   <el-button @click="update">模型更新</el-button>
                               </el-col>
                           </el-row>

                       </div>
                   </el-card>
               </div>
           </el-col>
           <el-col :span="10">
               <div class="model-summary">
                   <el-card class="box-card">
                       <div slot="header" class="clearfix">
                           <span>{{currentModel.model_name}}</span>
                       </div>
                       <div v-show="currentModel">
                           <el-row>
                               <el-col :span="12">
                                   <div>准确率：{{currentModel.precise}}</div>
                                   <div>模型大小：{{currentModel.model_size}}</div>
                               </el-col>
                               <el-col :span="12">
                                   <div>AUC：{{currentModel.auc}}</div>
                                   <div>耗费时间：{{currentModel.train_time}}</div>
                               </el-col>
                               <el-col :span="12">
                                   <el-button>预测</el-button>
                               </el-col>
                               <el-col :span="12">
                                   <el-button>发布</el-button>
                               </el-col>
                           </el-row>
                       </div>
                   </el-card>
               </div>
           </el-col>
       </el-row>
        <el-row>
            <el-col :span="14">
                <el-card class="box-card">
                    <el-table
                            :data="modelJobTableData"
                            border
                            @row-click="selectJob"
                            highlight-current-row
                            style="width: 100%">
                        <el-table-column
                                prop="sequence"
                                label="模型版本"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="algorithm"
                                label="运行算法"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="trainTime"
                                label="运行时间">
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>预测结果快速下载</span>
                    </div>
                    <div class="model-summary">
                        <el-table
                                :data="predictTableData"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="srcFile"
                                    label="预测文件"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="modelName"
                                    label="使用模型"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="createTime"
                                    label="时间">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </section>

</template>

<script>
    import {getProject,getJobList,newJob,getModelExplainList,getPredictResultAndDetail,getPredictHistory} from '../api/api';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import moment from 'moment';
    export default {
        components: {
            ElCol,
            ElRow,
            ElButton},
        data() {
            return {
                activeName2: 'first',
                isLoading:false,
                projectId:0,
                list:[],
                msgs:{"0":"数据处理",feature_analyse:"特征分析...",train:'模型训练...',predict:'正在预测...',predict_explain:"模型解释..."},
                steps:{'failed':'失败','running':'运行中','finish':'完成',"waiting":"等待"},
                predictTableData:[],
                modelJobTableData:[],
                projectInfo:{},
                modelJobTableData:[],
                currentModel:false,

            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            update(){

            },
            queryProjectInfo(){
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
            queryJobList(){
                var param = {
                    "projectId":this.projectId,
                };
                this.isLoading=true;
                getModelExplainList(param).then(data=>{
                    this.isLoading=false;
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.modelJobTableData= data.data;
                        this.currentModel = this.modelJobTableData[0].models[0];
                      //  console.log(this.modelJobTableData);
                        //this.queryPredictHistory('198658041128685568',this.modelJobTableData[0].sequence);
                        this.queryPredictHistory(this.modelJobTableData[0].jobId,this.modelJobTableData[0].sequence);
                    }
                });
            },
            selectJob(row, event, column){
//                console.log("aaaa",row,event,column);
                this.currentModel = row.models[0];
            },
            queryModelInfo(){

            },
            queryPredictHistory(jobId,sequence){
                var param={
                    jobId:jobId,
                    sequence:sequence
                };
                getPredictHistory(param).then(data=>{
                    let {msg, code} = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.predictTableData = data.data;
                        console.log(this.predictTableData);
                    }
                });
            },
            update(){
                var that = this;
                newJob(that.projectId,[]).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        that.jobId  = data.data.tid;
                        that.sequence = data.data.sequence;
                        //job状态保存，退出再进使用
                        var jobInfo = this.projectId+"/"+this.jobId+"/"+this.sequence;
                        this.$router.push({ path: '/main/uploadView/'+jobInfo });
                    }
                });
            },
        },
        mounted(){
            this.projectId = this.$route.params.projectId;
            this.queryProjectInfo();
            this.queryJobList();
        }
    }
</script>

<style lang="scss" type="text/scss">
    #resultView{
        background: white;
        border:1px solid #1d8ce0;
        padding:15px;
        line-height: 35px;

        .box-card{
            margin:15px;
        }
    }
</style>