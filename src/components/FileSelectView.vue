<template>
    <section id="fileSelectView">
       <div class="step-bar">
           <el-steps :active="active" finish-status="success" align-center>
               <el-step title="准备数据"></el-step>
               <el-step title="检查数据"></el-step>
               <el-step title="正在运行"></el-step>
               <el-step title="准备预测"></el-step>
           </el-steps>
       </div>
        <div class="box">
            <div class="box-title">
                <span>请选择数据源（暂时支持.csv格式）</span>
            </div>
            <el-row>
                <el-col :span="8" class="card">
                    <div>
                        <div class="title">服务器</div>
                        <div class="data-source">
                            <div id="serverUpload" class="icon">

                            </div>
                            <div class="name">
                                <el-upload
                                        class="upload-demo"
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        :on-remove="handleRemove"
                                        :on-success="handleUploadSuccess"
                                        multiple
                                        :limit="3"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="card">
                    <div>
                        <div class="title">本地</div>
                        <div class="data-source">
                            <div id="localUpload" class="icon">

                            </div>
                            <div class="name">
                                点击上传
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="card">
                    <div>
                        <div class="title">历史库</div>
                        <div class="data-source">
                            <div id="historyUpload" class="icon">

                            </div>
                            <div class="name">
                                点击上传
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </section>

</template>

<script>
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
                active: 0
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handleUploadSuccess(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            }
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
    #fileSelectView{
        .step-bar{
            padding: 30px 15px;
        }
        .box{
            height: 400px;
            background: white;
            border:1px solid #1d8ce0;
            margin-top:15px;

            .box-title{
                margin-bottom: 60px;
                text-align: center;
                font-size: 24px;
                padding: 15px;
            }
        }
        .card{
            display: flex;
            justify-content: center;
            align-items: center;
            .title{
                padding: 10px 0;
            }
            .data-source{
                height: 180px;
                width:257px;
                border:2px solid #1d8ce0;
                border-radius: 5px;
                .icon{
                    color:#1d8ce0;
                    text-align: center;
                    font-size: 22px;
                    line-height: 60px;
                    height: 60px;
                    width: 257px;
                    margin-bottom: 20px;
                    margin-top:40px;
                }
                .name{
                    text-align: center;
                    color:#20a0ff;
                }
                #serverUpload{
                    background: url("../assets/server-upload.png") no-repeat center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }

                #localUpload{
                    background: url("../assets/local-upload.png") no-repeat center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }

                #historyUpload{
                    background: url("../assets/history-upload.png") no-repeat center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
        }

    }
</style>