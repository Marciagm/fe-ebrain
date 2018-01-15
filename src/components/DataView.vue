<template>
    <section id="dataView">
       <el-table
               :data="fileList"
               stripe
               style="width: 100%">
           <el-table-column
                   sortable
                   prop="filename"
                   label="文件名"
                   width="280">
           </el-table-column>
           <el-table-column
                   prop="filepath"
                   label="文件路径">
           </el-table-column>
           <el-table-column
                   prop="fileSize"
                   label="文件大小"
                   width="180">
           </el-table-column>
           <el-table-column
                   sortable
                   prop="createTime"
                   label="上传日期"
                   width="180">
           </el-table-column>
       </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :total="total" @current-change="pageChange">
        </el-pagination>
    </section>

</template>

<script>
    import {getHistoryFileList} from '../api/api';
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
                fileList:[],
                total:0
            }
        },
        methods: {
            queryFileList(pageNum,pageSize){
                var param={
                    pageNum:pageNum,
                    pageSize:pageSize,
                }
                getHistoryFileList(param).then(data=>{
                    let { msg, code } = data;
                    if (code > 0) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.fileList= data.data.list;
                        this.total = data.data.total;
                    }
                });
            },
            pageChange(val){
                this.queryFileList(val,10);
            }
        },
        mounted(){
            this.queryFileList(1,10);
        }
    }
</script>

<style lang="scss" type="text/scss">
    #dataView{
        padding:30px;

        .el-pagination{
            margin:15px 0;
            text-align: center;
        }
    }
</style>