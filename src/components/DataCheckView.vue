<template>
    <section id="dataCheckView">
        <div class="step-bar">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="准备数据"></el-step>
                <el-step title="检查数据"></el-step>
                <el-step title="正在运行"></el-step>
                <el-step title="准备预测"></el-step>
            </el-steps>
        </div>
        <div class="box">
            <div>
                <div style="height: 30px">你想预测什么？</div>
                <!--<el-input v-model="predict_label" size="medium" style="width: 200px"></el-input>-->
                <div>
                   <el-row style="display: flex;justify-content: center;align-items: center;">
                       <el-col :span="8">
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
                       <el-col :span="16">
                           <el-button type="primary" class="start-btn" @click="startTrain">开始</el-button>
                       </el-col>
                   </el-row>

                </div>

            </div>
            <div>
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
                        </el-tab-pane>
                        <el-tab-pane label="原始数据" name="second">
                            <template>
                                <dynamic-table  :headers="[]" :list="this.sourceDataResult.dataList"></dynamic-table>
                            </template>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>

        </div>
    </section>

</template>

<script>
    import {getDataResult,getFileData,runJobStep,getJobInfo,getJobProgress} from '../api/api';
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
            DynamicTable},
        data() {
            return {
                active:1,
                activeTab:'first',
                predict_label:'',
                tableData1: [],
                sourceDataResult:{},
                dataSeparatorL:',',
                labelIndex:1,
                timer:false,
            }
        },
        methods: {
            selectTag(feature_name,columnIndex){
                this.predict_label=feature_name;
                this.labelIndex = columnIndex;
            },
            handleTagSelect(tag){
                this.predict_label=tag.feature_name;
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
                var param={jobId:this.jobId};
                getFileData(param).then(data=>{
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
            queryDataResult(){
                var _this = this;
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
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
                        this.projectId=data.data.projectId;
                        this.sequence = data.data.jobSequence;
                        this.dataSeparator = data.data.dataSeparator;
                        if(data.data && data.data.dataResult){
                            this.labelData = JSON.parse(data.data.dataResult || {});
                            var datas = this.labelData.feature_and_label;
                            this.tableData1 = datas;
                        }
                    }
                });
            },
            startTrain(){
                var param={
                    projectId:this.projectId,
                    jobId:this.jobId,
                    sequence:this.sequence,
                    step:'train',
                    labelIndex:this.labelIndex,
                };
                runJobStep(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.timer = setInterval(() => { //每分钟查询一次任务状态
                            var param = {jobId: this.jobId};
                            getJobProgress(param).then(data => {
                                let {msg, code} = data;
                                if (code > 0) {
                                    window.clearInterval(this.timer);
                                    this.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                } else {
                                    if(data.data=='train'){
                                        window.clearInterval(this.timer);
                                        this.$router.push({ path: '/main/trainingView/'+this.projectId+"/"+this.jobId+"/"+this.sequence });
                                    }
                                }
                            });
                        },5000);

                    }
                });
            },
        },
        mounted(){
            this.jobId = this.$route.params.jobId;
            this.projectId=this.$route.params.projectId;
            this.sequence=this.$route.params.sequence;
            this.queryDataResult();
            this.querySourceFileData();
        },
        destroy(){
            if(this.timer){
                window.clearInterval(this.timer);
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    #dataCheckView{
        .step-bar{
            padding: 30px 15px;
        }
        .box{
            min-height: 500px;
            background: white;
            border:1px solid #1d8ce0;
            padding:15px;

        }
        .start-btn{
            border-radius: 100px;
            height:100px;
            width:100px;
        }
        .predict-label-input input{
            min-width:200px ;
            width: 100%;
        }
    }
</style>