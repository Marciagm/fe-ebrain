<template>
    <section>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">模型</el-menu-item>
            <el-menu-item index="2"><a href="https://www.ele.me" target="_blank">数据</a></el-menu-item>
        </el-menu>
    </section>
</template>

<script>
    export default {
        data(){
            return{
                activeIndex:0,
            }
        }
    }

</script>

<style scoped>

</style>