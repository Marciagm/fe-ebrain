<template>
    <section id="modelDetailView">
        <div style="padding: 15px;">
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="createJob">新建任务</el-button>
        </div>
        <el-row v-show="isLoading">
            <el-col :span="24" style="display: flex;justify-content: center;align-items: center;">
                <i class="el-icon-loading"></i>
            </el-col>
        </el-row>
        <el-row v-show="!isLoading" style="height: 350px;padding: 15px;">
            <!--<el-col :span="6" class="box" v-for="m in list">
                <div class="model-card" @click="goToModelDetail(m.tid,m.progress)">
                    <div class="icon">
                        1
                    </div>
                    <div class="name">
                        {{msgs[m.progress]}}
                    </div>
                </div>
            </el-col>-->
            <template>
                <el-table
                        :data="list"
                        stripe
                        header-align="center"
                        style="width: 100%">
                    <el-table-column
                            prop="sequence"
                            label="序号"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="time"
                            label="提交时间"
                            :formatter="formatTime"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="progress"
                            :formatter="formatProgress"
                            label="当前步骤"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="right"
                            label="正确率"
                            :formatter="formatRight"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="jobStatus"
                            label="状态"
                            :formatter="formatJobStatus"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="reason"
                            label="失败原因">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <div>
                                <el-button
                                        size="mini" :disabled="scope.row.jobStatus!='success'"
                                        @click="handleView(scope.$index, scope.row)">查看</el-button>
                                <el-button
                                        size="mini" :disabled="scope.row.jobStatus!='success'"
                                        @click="handlePredict(scope.$index, scope.row)">预测</el-button>
                                <el-button
                                        size="mini" :disabled="scope.row.jobStatus!='success'"
                                        type="success"
                                        @click="handleDelete(scope.$index, scope.row)">发布</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-row>
    </section>

</template>

<script>
    import {getJobList,newJob} from '../api/api';
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
                isLoading:false,
                projectId:0,
                list:[],
                msgs:{"0":"数据处理",feature_analyse:"特征分析...",train:'模型训练...',predict:'正在预测...',predict_explain:"模型解释..."},

            }
        },
        methods: {
            goToJobDetail(e,projectId){
                this.$router.push({ path: '/main/modelDetailView/'+projectId });
            },
            queryJobList(projectId){
                var param = {
                    "projectId":projectId,
                };
                this.isLoading=true;
                getJobList(param).then(data=>{
                    this.isLoading=false;
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.list= data.data;
                    }
                });
            },
            formatTime: function (row, column) {
                return moment(row.time).format("YYYY-MM-DD HH:mm:ss");
            },
            formatProgress: function (row, column) {
                return this.msgs[row.progress];
            },
            formatJobStatus: function (row, column) {
                return row.jobStatus == 'success' ? '成功' : '失败';
            },
            formatRight(){
              return "78%" ;
            },
            handleView($index,row){
                console.log(row);
                if(row.progress=='0'){
                    this.$router.push({ path: '/main/fileSelectView/'+row.projectId });
                }else if(row.progress=='feature_analyse'){
                    this.$router.push({ path: '/main/dataCheckView/'+row.projectId+"/"+row.tid+"/"+row.sequence});
                }else if(row.progress=='train'){
                    this.$router.push({ path: '/main/trainingView/'+row.projectId  });
                }else if(row.progress=='predict'){
                    this.$router.push({ path: '/main/resultView/'+row.projectId });
                }else if(row.progress=='predict_explain'){
                    this.$router.push({ path: '/main/resultView/'+row.projectId });
                }else{
                    this.$router.push({ path: '/main/modelDetail/'+row.projectId+"/"+row.tid+"/"+row.sequence });
                }
            },
            handlePredict($index,row){

            },
            createJob(){
                this.$router.push({ path: '/main/fileSelectView/'+this.projectId });
            }
        },
        mounted(){
            this.projectId = this.$route.params.projectId;
            this.queryJobList(this.projectId);
        }
    }
</script>

<style lang="scss">
    #modelDetailView{
        height: 500px;
        background: white;
        border:1px solid #1d8ce0;
        .box{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        /* .el-pagination{
             margin-top: 190px;
         }*/
        .model-card{
            height: 133px;
            width:201px;
            text-align: center;
            border:1px solid #cccccc;
            margin: 15px;
            border-radius: 5px;
            cursor: pointer;
            .icon{
                color:#1d8ce0;
                text-align: center;
                font-size: 22px;
                line-height: 60px;
                height: 60px;
                width: 201px;
                background: url("../assets/model-icon2.png") no-repeat center center;
                background-size: contain;
                background-repeat: no-repeat;
                margin-bottom: 20px;
                margin-top:10px;
            }
            .name{
                font-size:20px;
                height: 50px;
                line-height: 50px;
                overflow: hidden;
            }
        }
        .model-card:hover{
            background: #cccccc;
        }
    }
</style>