<template>
    <section id="dataView">
       <div class="box">
           <el-row>
               <el-col :span="6" class="box">
                   <div class="file" data-file-id="21" ref="fileInfo">
                       <el-upload
                               class="avatar-uploader"
                               action="https://jsonplaceholder.typicode.com/posts/"
                               :show-file-list="false"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                           <img v-if="imageUrl" :src="imageUrl" class="avatar">
                           <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                       </el-upload>
                   </div>
               </el-col>
               <el-col :span="6" class="box">
                   <div class="file" data-file-id="21" ref="fileInfo">
                       <div class="icon">

                       </div>
                       <div class="name">
                           文件名
                       </div>
                   </div>
               </el-col>
               <el-col :span="6" class="box">
                   <div class="file" data-file-id="21" ref="fileInfo">
                       <div class="icon">

                       </div>
                       <div class="name">
                           文件名
                       </div>
                   </div>
               </el-col>
               <el-col :span="6" class="box">
                   <div class="file" data-file-id="21" ref="fileInfo">
                       <div class="icon">

                       </div>
                       <div class="name">
                           文件名
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

            }
        },
        methods: {
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
    #dataView{
        height: 500px;
        background: white;
        border:1px solid #1d8ce0;
        margin-top:60px;

        .box{
            padding:15px;
        }

        .file{
            height: 133px;
            width:201px;
            line-height: 133px;
            text-align: center;
            border:1px solid #cccccc;
            margin: 15px;
            border-radius: 5px;
            cursor: pointer;
            .icon{
                height: 50px;
                width: 201px;
            }
            .name{
                font-size:20px;
            }
        }
        .file:hover{
            background: #cccccc;
        }
    }
</style>