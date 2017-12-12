<template>
    <section id="modelDetailView">
        <dynamic-table :headers="predictDetailHeader" :list="this.predictDetail.dataList"></dynamic-table>
    </section>
</template>

<script>
    import {getPredictDetail } from '../api/api';
    import DynamicTable from "@/components//DynamicTable.vue";
    export default {
        data() {
            return {
                screenLoading:{},
                projectId:"",
                jobId:"",
                sequence:0,
                predictDetailHeader:[],
                predictDetail:[]
            };
        },
        components:{
            DynamicTable,
        },
        methods: {
            openFullScreenLoading() {
                this.screenLoading = this.$loading({
                    lock: true,
                    text: '正在生成详细报告，时间较长，请耐心等等...',
                    spinner: 'el-icon-loading',
                    backgroundColor: 'rgba(1, 1, 1, 0.7)'
                });
            },
            viewModelDetail(){
                this.openFullScreenLoading();
                var param={projectId:this.projectId,jobId:this.jobId,sequence:this.sequence};
                getPredictDetail(param).then(data=> {
                    let {msg, code} = data;
                    if (code > 0 && code != 100) {
                        this.screenLoading.close();
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else if (code == 0) {
                        this.screenLoading.close();
                        this.predictDetail=JSON.parse(data.data.detail);
                    }
                });
            },

        },
        mounted(){
            this.projectId = this.$route.params.projectId;
            this.jobId = this.$route.params.jobId;
            this.sequence = this.$route.params.sequence;
            this.viewModelDetail();
        },
        destroyed(){
            this.screenLoading.close();
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';
    #modelDetailView{
        background-color: white;
        height: 100%;
        padding:30px 15px;
        .dynamic-table-section{
            height: 500px;
        }
    }
</style>