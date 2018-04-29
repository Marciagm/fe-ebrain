<template>
  <div class="original-data" :max-height="maxHeight">
    <table cellspacing="0" cellpadding="0" :max-height="maxHeight">
        <tr v-for="item in originalData">
            <td  v-for="col in item">           
                {{ col }}
            </td>
        </tr>
    </table>
  </div>
</template>
<style lang="scss">
    .original-data {
        overflow: scroll;
        max-height: 400px;
        table {
            border-radius: 4px;
            width: 100%;
            text-align: center;
        }
        table tr {
            height: 53px;
        }
        table tr:nth-child(even) td {
            background: #fafafa;
            text-align: center;
            min-width: 50px;
        }
        table tr:nth-child(odd) td {
            background: #f5f5f5;
            text-align: center;
            min-width: 50px;
        }
    }
</style>
<script>
    import { showOriginalData } from '../api/api'
    export default {
        props: ['maxHeight'],
        data() {
            return {
                originalData: ''
            }
        },
        mounted () {
            this.originalData = this.$store.state.originalData;
            if (this.originalData.length) {
                return;
            }
            const projectId = this.$route.params.projectId;
            showOriginalData(projectId).then(data => {
                let { dataset } = data;
                console.log(dataset);
                if (dataset) {
                    //this.$store.commit('SET_ORIGINAL_DATA', dataset);
                    let { sampled_data } = dataset;
                    if (sampled_data) {
                        const sampledData = JSON.parse(sampled_data);
                        this.originalData = sampledData;
                    }
                    this.$store.commit('SET_TIPS_STATUS', true);
                    this.$store.commit('SET_TIPS', '原始数据共xx行，仅显示100行');
                    // @TODO 添加消失逻辑
                    setTimeout(() => {
                        this.$store.commit('SET_TIPS_STATUS', false);
                    }, 1000)
                }
            })
        },
        computed: {
           /* originalData () {
                let { sampled_data } = this.$store.state.originalData;
                if (sampled_data) {
                    const sampledData = JSON.parse(sampled_data);
                    return sampledData;
                }
                return [];
            }*/
        }
    }
</script>



