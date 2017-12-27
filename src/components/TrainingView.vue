<template>
    <section id="trainingView">
        <div class="step-bar">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="准备数据"></el-step>
                <el-step title="检查数据"></el-step>
                <el-step title="正在运行"></el-step>
                <el-step title="准备预测"></el-step>
            </el-steps>
        </div>

        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>模型算法列表</span>
                    <el-button style="float: right; padding: 3px 0" type="text">全部终止</el-button>
                </div>
                <div>
                    <template>
                        <el-table
                                :data="trainedResult"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="model_name"
                                    label="算法名称"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                prop="validate_auc"
                                label="validate_auc"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="loss"
                                    label="loss"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="mse"
                                    label="mse">
                            </el-table-column>
                            <el-table-column
                                    prop="precise"
                                    label="precise">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>

            </el-card>
        </div>
    </section>

</template>

<script>
    import{getTrainResult} from '../api/api';
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
                active:2,
                projectId:0,
                jobId:0,
                squence:0,
                trainedResult:[],
            }
        },
        methods: {
            queryTrainResult(){
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                getTrainResult(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        var  result =data.data;
                        console.log(JSON.parse(result[0].trainedResult).model_info.train_result)
                        this.trainedResult = JSON.parse(result[0].trainedResult).model_info.train_result;

                    }
                });
            },
            handleClick(row){
                this.$router.push({ path: '/main/modelDetail/'+this.projectId+"/"+this.jobId+"/"+this.sequence });
            }
        },
        mounted(){
            this.jobId = this.$route.params.jobId;
            this.projectId=this.$route.params.projectId;
            this.sequence=this.$route.params.sequence;
            this.queryTrainResult();
        }
    }
</script>

<style lang="scss" type="text/scss">
    #trainingView{
        .step-bar{
            padding: 30px 15px;
        }
        .box-card table{
            width: 100%;
        }
        .box-card table tr td{
            text-align: center;
            height: 80px;
        }

    }
</style>