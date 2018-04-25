<template>
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
</template>

<script>
    export default {
        props: ['maxHeight'],
        data() {
            return {
                field: [],
                tableData: [{
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }, {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
                }, {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }, {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
                }, {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }, {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
                }, {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }, {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        mounted () {
            console.log(this.originalData);
            this.$store.commit('SET_TIPS_STATUS', true);
            this.$store.commit('SET_TIPS', '原始数据共xx行，仅显示100行');
            setTimeout(() => {
                this.$store.commit('SET_TIPS_STATUS', false);
            }, 1000)
        },
        computed: {
            originalData () {
                const { sampled_data } = this.$store.state.originalData;
                const sampledData = JSON.parse(sampled_data);

                const originalData = [];
                const rowLength = sampledData.length;
                const columnLength = sampledData[0] && sampledData[0].length;
                for (let k = 0; k < columnLength; k++) {
                    this.field.push('a' + k);
                }
                for (let i = 0; i < rowLength; i++) {
                    const item = {};
                    for (let j = 0; j < columnLength; j++) {
                        item['a' + j] = sampledData[i][j];
                    }
                    originalData.push(item);
                }
                return originalData;
            }
        }
    }
</script>



