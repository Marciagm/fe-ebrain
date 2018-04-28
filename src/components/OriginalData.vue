<template>
  <div class="original-data" :max-height="maxHeight">
    <table cellspacing="0" cellpadding="0" :max-height="maxHeight">
        <tr v-for="item in originalData">
            <td  v-for="col in item">           
                {{ col }}
            </td>
        </tr>
    </table>
    <!-- <el-table
    	align="center"
      width="500"
    	:max-height="maxHeight"
      :data="originalData"
      stripe
      style="border-radius: 4px;"
      :show-header=false
      >
      <el-table-column
        v-for="item in field"
        :prop="item"
        label="item"
      >
      </el-table-column> 
    </el-table> -->
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
    export default {
        props: ['maxHeight'],
        data() {
            return {
                field: []
            }
        },
        mounted () {
            //console.log(this.originalData);
            this.$store.commit('SET_TIPS_STATUS', true);
            this.$store.commit('SET_TIPS', '原始数据共xx行，仅显示100行');
            setTimeout(() => {
                this.$store.commit('SET_TIPS_STATUS', false);
            }, 1000)
        },
        computed: {
            originalData () {
                let { sampled_data } = this.$store.state.originalData;
                const sampledData = JSON.parse(sampled_data);
                return sampledData;
            }
        }
    }
</script>



