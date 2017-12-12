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
                <el-input v-model="predict_label" size="medium" style="width: 200px"></el-input>
            </div>
            <div id="fileInfo">

                dfsdfsdfs
            </div>
            <div>
                <template>
                    <el-table
                            :data="tableData1"
                            height="250"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="date"
                                label="日期"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="姓名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="地址">
                        </el-table-column>
                    </el-table>
                </template>
            </div>

        </div>
    </section>

</template>

<script>
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import ElInput from "../../node_modules/element-ui/packages/input/src/input";
    export default {
        components: {
            ElInput,
            ElCol,
            ElRow,
            ElButton},
        data() {
            return {
                active:1,
                predict_label:'',
                tableData1: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }]
            }
        },
        methods: {
            showNewModelDialog(){
                this.dialogNewModelVisible = true;
            },
            saveModel(){
                this.dialogNewModelVisible=false;
                this.$router.push({ path: '/main/fileSelectView' });
            }
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
    #dataCheckView{
        .step-bar{
            padding: 30px 15px;
        }
        .box{
            height: 500px;
            background: white;
            border:1px solid #1d8ce0;
            padding:15px;

            #fileInfo{
                padding: 15px 0;
            }
        }
    }
</style>