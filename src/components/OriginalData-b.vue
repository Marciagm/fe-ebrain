<template>
  <div>
    <el-table
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
    </el-table>
  </div>
</template>

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
              const len = this.$store.state.originalData[0] && Object.keys(this.$store.state.originalData[0]).length;
              for (let k = 0; k < len; k++) {
                  this.field.push('a' + k);
              }
                //const { sampled_data } = this.$store.state.originalData;
              return this.$store.state.originalData;
            }
        }
    }
</script>



