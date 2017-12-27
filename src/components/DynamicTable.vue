<template>
    <section  class="dynamic-table-section">
        <table class="dynamic-table" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th v-for="h in headers">{{h}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in this.list">
                    <td v-for="cv in row">
                        <div class="cell">{{cv}}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>
<script>
    export default {
        props:{
            headers:{
                required:false,
                type:Array,
                default:function(){
                    return [];
                }
            },
            list:{
                required:true,
                type:Array,
                default:function(){
                    return [];
                }
            }
        },
        mounted(){
        }
    }
</script>
<style scoped lang="scss" type="text/scss">
    table{
        overflow: hidden;
        width: 100%;
        max-width: 100%;
        background-color: #fff;
        border: 1px solid #dfe6ec;
        font-size: 14px;
        color: #1f2d3d;
        tr{
            background-color: #fff;
            td{
                height: 40px;
                min-width: 80px;
                text-overflow: ellipsis;
                vertical-align: middle;
                border-bottom: 1px solid #dfe6ec;
                transition: background-color .25s ease;
                box-sizing: border-box;
                white-space: nowrap;
                position: relative;
                .cell{
                    padding-left: 18px;
                    padding-right: 18px;
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                }
            }
        }
        thead tr:first-child{
            background-color: #eef1f6;
            color: #1f2d3d;
        }
    }
</style>
