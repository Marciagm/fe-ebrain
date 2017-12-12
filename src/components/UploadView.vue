<template>
    <section id="uploadView">
        <div class="step-bar">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="准备数据"></el-step>
                <el-step title="检查数据"></el-step>
                <el-step title="正在运行"></el-step>
                <el-step title="准备预测"></el-step>
            </el-steps>
        </div>
        <div class="box">
            <el-row>
                <el-col :span="18">
sdfsdfsdf
                </el-col>
                <el-col :span="6">
                   <div class="file-list">
                       <div class="title">文件传清单</div>
                       <div class="title">
                           <el-button>删除</el-button>
                           <el-button>添加</el-button>
                       </div>
                       <div class="content">
                           <div class="item"></div>
                       </div>
                   </div>
                </el-col>
            </el-row>
        </div>
    </section>

</template>

<script>
    import {newProject,newJob,getJobInfo } from '../api/api';
    import store from '@/vuex/store';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    //import NProgress from 'nprogress'

    export default {
        components: {ElButton},
        data() {
            return {
                adSrc:'./static/ad.jpg',
                store:store,
                uploadAction:'',
                myHeaders: {Authorization: ''},
                fileId:"",
                projectId:"",
                jobId:"",
                sequence:0,
                file:{},
                screenLoading:{},
                dialogVisible:false,
                msg:'运行中...',
                percentage:0,
            };
        },
        methods: {
            uploadSuccess(response, file, fileList){
                console.log(response);
                if(response.data.code>0){
                    this.$message({
                        message: '未登录',
                        type: 'warning',
                        duration:10000
                    });
                    this.$router.push({ path: '/login'});
                }

                this.file = response.data;
                this.createProject();
            },
            uploadError(){
                this.$router.push({ path: '/main/resultView' });
            },
            openFullScreenLoading(msg) {
                this.msg = msg;
                this.dialogVisible=true;
            },
            closeFullScreenLoading(){
                this.dialogVisible=false;
            },
            createProject(){
                this.openFullScreenLoading("初始化项目");
                var param = {
                    "projectName": "临时项目_"+(new Date()).toLocaleString(),
                    "projectDesc": "一个临时项目",
                };
                newProject(param).then(data=>{
                    let { msg, code } = data;
                    this.closeFullScreenLoading();
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.createJob(data.data.tid);
                    }
                });
            },
            createJob(projectId){
                var that = this;
                that.openFullScreenLoading("初始化任务...");
                var param=[];
                param.push(this.file);
                newJob(projectId,param).then(data=>{
                    that.closeFullScreenLoading();
                    let { msg, code } = data;
                    if (code > 0) {
                        that.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        that.projectId=projectId;
                        that.jobId  = data.data.tid;
                        that.sequence = data.data.sequence;
                        that.fileId = this.file.tid;

                        //job状态保存，退出再进使用
                        var jobInfo = this.projectId+"/"+this.jobId+"/"+this.sequence+"/"+this.fileId;
                        localStorage.setItem("jobInfo",jobInfo);
                        //job创建成功后查询job执行状态
                        this.queryJobInfo();
                    }
                });
            },
            queryJobInfo(callback){
                var that=this;
                var msgs={feature_analyse:"特征分析...",train:'模型训练...',predict:'正在预测...',predict_explain:"模型解释..."};
                that.openFullScreenLoading("正在进行模型训练，时间较长，请耐心等等...");
                var timer = setInterval(() => { //每分钟查询一次任务状态
                    var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                    getJobInfo(param).then(data=>{
                        let { msg, code } = data;
                        if (code > 0) {
                            that.closeFullScreenLoading();
                            callback();
                            that.$message({
                                message: msg,
                                type: 'error'
                            });
                        } else {
                            if(data.data.jobStatus=='success'){
                                that.closeFullScreenLoading();
                                clearInterval(timer);
                                //var jobInfo = localStorage.getItem("jobInfo");
                                localStorage.removeItem("jobInfo");
                                var path="/main/resultView/"+this.projectId+"/"+this.jobId+"/"+this.sequence+"/"+this.fileId;
                                this.$router.push({ path: path });
                            }else if(data.data.jobStatus=='failed'){
                                clearInterval(timer);
                                localStorage.removeItem("jobInfo");
                                this.dialogVisible=false;
                                this.$alert(data.data.reason, '错误提醒', {
                                    confirmButtonText: '确定',
                                    callback: action => {}
                                });
                            }else{
                                if(msgs[data.data.progress]){
                                    this.msg=msgs[data.data.progress];
                                    if(data.data.progress=="feature_analyse"){
                                        this.percentage=25;
                                    }else if(data.data.progress=="train"){
                                        this.percentage=50;
                                    }else if(data.data.progress=="predict"){
                                        this.percentage=75;
                                    }else{
                                        this.percentage=100;
                                    }
                                }else{
                                    this.msg="运行中...";
                                }

                            }
                        }
                    });
                },10000);

            },
            killAll(){
                localStorage.removeItem('jobInfo');
                this.dialogVisible=false;
            }
        },
        mounted(){
            //var token = sessionStorage.getItem('token');
            var token = localStorage.getItem('token');
            this.myHeaders={Authorization: token};
            this.uploadAction=process.env.API_ROOT+'/filelist/upload';
            var jobInfo = localStorage.getItem('jobInfo');
            if(jobInfo){
                var list = jobInfo.split("/");
                this.projectId = list[0];
                this.jobId  = list[1];
                this.sequence = list[2];
                this.fileId = list[3];
                this.queryJobInfo();
            }
        }

    }

</script>

<style lang="scss">
    #uploadView{
        .step-bar{
            padding: 30px 15px;
        }
        .box{
            height: 500px;
            background: white;
            border:1px solid #1d8ce0;
            margin-top:15px;
            .file-list{
                height: 500px;
                border:1px solid #1d8ce0;
                background: #1d8ce0;
            }
        }
    }
</style>