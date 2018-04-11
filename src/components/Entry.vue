<template>
    <section id="registView">
        <header>
            <img src="../images/logo.png">
        </header>
        <div class="regist-frame-wrapper">
            <slot name="frame"></slot>
        </div>
        <footer>
            <div class="slogan">AI驱动 预见未来 才能遇见未来</div>
            <div class="foot">
                Copyright （c）2017  北京智铀科技有限公司 京ICP备17072393号 All Rights Reserved
            </div>
        </footer>
    </section>
</template>

<script>
    //import NProgress from 'nprogress'
    export default {
        name: 'entry'
    }

</script>

<style lang="scss" type="text/scss">
    #registView {
        height: 100%;
        min-width: 600px;
        header {
            height: 71px;
            img {
                margin-top: 19px;
                margin-left: 60px;
                width: 107px;
                height: 29px;
            }
        }
        footer {
            width: 100%;
            min-height: 72px;
            height: calc(100% - 685px);
            text-align: center;
            position: relative;
            >div {
                height: 17px;
                font-size: 16px;
                color: #999999;   
            }
            .slogan {
                margin-top: 32px;
            }
            .foot {
                position: absolute;
                min-top: 1000px;
                bottom: 20px;
                width: 100%;
                text-align: center;
            }
        }
        .regist-frame-wrapper {
            height: 579px;
            background: #1d4786;
            background: url("../images/banner-1920*1080.png") no-repeat;
            background-position: top left;
        }
    }
</style>