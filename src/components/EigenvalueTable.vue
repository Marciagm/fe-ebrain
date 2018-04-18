<template>
	<el-table
		align="center"
		stripe
	    ref="multipleTable"
	    :data="tableData3"
	    tooltip-effect="light"
	    style="width: 94%; margin-left: 2%;"
	    :max-height="maxHeight"
	    @cell-mouse-enter="showTip"
	    @cell-mouse-leave="hideTip"
	    show-overflow-tooltip
	    >
	    <el-table-column
	      type="selection">
	    </el-table-column>
	     <el-table-column
	      type="expand"
	    >
	    <template slot-scope="props">
	        <el-form label-position="left" inline class="demo-table-expand">
	          <el-form-item label="商品名称">
	            <span>{{ props.row.name }}</span>
	          </el-form-item>
	          <el-form-item label="店铺地址">
	            <span>{{ props.row.address }}</span>
	          </el-form-item>
	          <el-form-item label="商品描述">
	            <span>{{ props.row.desc }}</span>
	          </el-form-item>
	        </el-form>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="date"
	      label="特征名称"
	      sortable
	      width="220"
	     
	     >
	      <template slot-scope="props" style="text-align: left;">
	      	<div :id="props.row.date" style=" height: 49px; line-height: 49px;">
	      		<span >{{ props.row.date }}</span>
	      		<span v-show="props.row.showTip" class="target-tip" @click="chooseTarget(props.row.date)">选该特征值为目标</span>
	      	</div>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="列号"
	      sortable
	    >
	    </el-table-column>
	    <el-table-column
	      prop="dataType"
	      sortable
	      label="数据类型"
	      width="120"
	      show-overflow-tooltip>
	      <template slot-scope="props" style="text-align: left;">
	      	<el-dropdown trigger="click"  style="font-size: 12px; color: #333; cursor: pointer;" @command="selectDataType">
		      	<span>
				    {{ props.row.dataType }}
				    <i class="el-icon-arrow-down el-icon--right"></i>
				</span>
		      	<el-dropdown-menu slot="dropdown">
				    <el-dropdown-item :command="{v: '离散', n: props.row}"> 离散</el-dropdown-item>
				    <el-dropdown-item :command="{v: '连续', n: props.row}"> 连续</el-dropdown-item>
				    <el-dropdown-item :command="{v: '时间', n: props.row}"> 时间</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="特征个数"
	      width="120"
	      sortable
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      sortable
	      label="缺失值"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      sortable
	      label="总和"
	      show-overflow-tooltip>
	    </el-table-column>							    
	    <el-table-column
	      prop="fnum"
	      label="最大值"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="最小值"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="众数"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="平均数"
	      show-overflow-tooltip
	      >
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="方差"
	      show-overflow-tooltip>
	    </el-table-column>
	    <el-table-column
	      prop="fnum"
	      label="偏度"
	      show-overflow-tooltip>
	    </el-table-column>
	</el-table>		
</template>
<style lang="scss">
	
</style>
<script>
	export default {
		mounted () {
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            //this.$refs.left.style.height = (h - 88) + 'px';
            //this.$refs.right.style.height = (h - 88) + 'px';
            this.maxHeight = (h - 500);
            this.restaurants = this.loadAll();
		},
		data () {
			return {
				maxHeight: 0,
				tableData3: [{
			          date: 'gender',
			          name: '张小虎',
			          dataType: '离散',
			          fnum: 15,
			          showTip: false
			        }, {
			          date: '-02',
			          name: 'a小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '3016-04',
			          name: 'b小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '-01',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '-08',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '2016-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '2016-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 12,
			          showTip: false
			        }, {
			          date: '2016-06',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120,
			          showTip: false
			        }, {
			          date: '2016-05-07',
			          name: '王小虎',
			          dataType: '离散',
			          fnum: 120000,
			          showTip: false
			        }
			    ],
		        multipleSelection: []
			}
		},
		methods: {
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },
		    loadAll() {
	        	return [
			          { "value": "gender", "address": "长宁区新渔路144号" },
			          { "value": "Hot", "address": "上海市长宁区淞虹路661号" },
			          { "value": "新旺", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
			          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
			          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
			          { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
			          { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
			          { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
			          { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
			          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
			          { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
			          { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
			          { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
			          { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
			          { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
			          { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
			          { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
			          { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
			          { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
			          { "value": "枪会山", "address": "上海市普陀区棕榈路" },
			          { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
			          { "value": "钱记", "address": "上海市长宁区天山西路" },
			          { "value": "壹杯加", "address": "上海市长宁区通协路" },
			          { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
			          { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
			          { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
			          { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
			          { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
			          { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
			          { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
			          { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
			          { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
			          { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
			          { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
			          { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
			          { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
			          { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
			          { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
			          { "value": "浏阳蒸菜", "address": "天山西路430号" },
			          { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
			          { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
			          { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
			          { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
			          { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
			          { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
			          { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
			          { "value": "阳阳麻辣烫", "address": "天山西路389号" },
			          { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
			]},
			showTip (row, column, cell, event) {
				//if (!row.showTip && column.property === 'date') {
					row.showTip = true;	
				//}
				//else {
				//	row.showTip = false;
				//}
			},
			hideTip (row, column, cell, event) {
				row.showTip = false;
			},
			chooseTarget (value) {
				this.$emit('setTarget', value);
			},
			selectDataType (command) {
				command.n.dataType = command.v;
				// 此处有接口
			}
		}
	}
</script>




