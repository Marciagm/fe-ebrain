<template>
	<div id="tables">
		<div id="tablePart">
			<div id="eigenPart" :class="[isEigenActive ? active : notActive]">
				<div class="eigen-label" @click="tab('detail')">
					<img src="../images/All-features.png">
					<span>特征详情</span>
				</div>
				<el-autocomplete
			      v-model="state1"
			      :fetch-suggestions="querySearch"
			      placeholder="搜索"
			      @select="search"
			      style="height: 15px; border: 0; text-align: center; font-size: 12px;"
			    ></el-autocomplete>	
				<el-dropdown style="cursor: pointer;" @command="getList">
					<span class="el-dropdown-link">
					    <span>全部特征</span>
					    <span style="color: #666; font-size: 10px;">(特征列表)</span>
					    <i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
					    <el-dropdown-item v-for="(item, index) in featureList" :divided="index==1" :command="item">
					    	{{ item.name }}
					    </el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<div class="eigen-list" v-if="isListNameShow"> 
					<input placeholder="新建特征列表" class="eigen-list-input" v-model="listName" />
					<button class="eigen-list-button" @click="setList">确定</button>
				</div>
			</div>

			<div id="originalPart" :class="[isEigenActive ? originalNotActive : originalActive]" :style="{width: originalPartwidth + 'px'}" @click="tab('original')">
				<div class="original-label" >
					<img src="../images/Original-data.png" style="margin-right: 5px;" >
					原始数据
				</div>
			</div>
		</div>

		<div id="core-data">

			<!-- 特征详情 -->
			<!-- <eigenvalue-table :max-height="maxHeight" v-if="isEigenActive" v-on:setTarget="showBar" v-on:setList="showSetList"></eigenvalue-table> -->
			
			<el-table
				v-if="isEigenActive"
			 	width="0"
				align="center"
				stripe
			    ref="multipleTable"
			    :data="eigenData"
			    tooltip-effect="light"
			    :max-height="maxHeight"
			    @select="select"
			    @select-all="select"
			    @cell-mouse-enter="showTip"
			    @cell-mouse-leave="hideTip"
			    @expand-change="expand"
			    show-overflow-tooltip
			    style="border-radius: 4px;"
			    >
			    <el-table-column
			      type="selection">
			    </el-table-column>
			    <el-table-column
			      type="expand"
			    >
			    <template slot-scope="props">
			    	<!-- nav part -->
			    	<div class="eigen-detail-nav">
			    		<button class="nav-item" :style="{color: dataDistr}" @click="showData('dataDistr', props.row)">数据分布</button>
			    		<div class="nav-sep"></div>
			    		<button class="nav-item" :style="{color: topn}" @click="showData('topn', props.row)">TopN</button>
			    	</div>
			    	<div id="dataShow"></div>

			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="特征名称"
			      sortable
			      width="200"
			     >
			      <template slot-scope="props" style="text-align: left;">
			      	<div :id="props.row.featrure_id" style=" height: 49px; line-height: 49px;">
			      		<span >{{ props.row.name }}</span>
			      		<span v-show="props.row.showTip" class="target-tip" @click="chooseTarget(props.row)">
			      			选该特征值为目标
			      		</span>
			      	</div>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="column_index"
			      label="列号"
			      sortable
			    >
			    </el-table-column>
			    <el-table-column
			      prop="typeValue"
			      sortable
			      label="数据类型"
			      width="100"
			      show-overflow-tooltip>
			      <template slot-scope="props" style="text-align: left;">
			      	<el-dropdown trigger="click"  style="font-size: 12px; color: #333; cursor: pointer;" @command="selectDataType">
				      	<span>
						    {{ props.row.typeValue }}
						    <i class="el-icon-arrow-down el-icon--right"></i>
						</span>
				      	<el-dropdown-menu slot="dropdown">
						    <el-dropdown-item :command="{v: '2', n: props.row}"> 离散</el-dropdown-item>
						    <el-dropdown-item :command="{v: '1', n: props.row}"> 连续</el-dropdown-item>
						    <el-dropdown-item :command="{v: '3', n: props.row}"> 时间</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="values_count"
			      label="特征个数"
			      sortabl
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="missed_instances_count"
			      sortable
			      label="缺失值"
			      width="100"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="valid_instances_count"
			      sortable
			      label="有效样本数"
			      width="120"
			      show-overflow-tooltip>
			    </el-table-column>							    
			    <el-table-column
			      prop="max"
			      label="最大值"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="min"
			      label="最小值"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="mode"
			      label="众数"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="mean"
			      label="平均数"
			      show-overflow-tooltip
			      >
			    </el-table-column>
			    <el-table-column
			      prop="sum"
			      label="取值加和"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="std"
			      label="方差"
			      show-overflow-tooltip>
			    </el-table-column>
			</el-table>
			<!-- 表格部分 -->
			<div style="" v-if="!isEigenActive">
				<original-data :max-height="maxHeight"></original-data>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	#tables {
		margin-left: 5%;
		width: 90%;
		overflow: hidden;
		#eigenPart {
			padding-left: 14px;
			padding-right: 14px;
			display: inline-block;
			height: 41px; 
			line-height: 41px;
			.eigen-list { 
				display: inline-block;
				margin-left: 30px;
				.eigen-list-input {
					height: 18px;
					background-color: #e6e6e6;
					border: 0;
				}
				.eigen-list-button {
					background-image: linear-gradient(90deg, 
						#0d65be 0%, 
						#1978d9 45%, 
						#248bf4 100%), 
					linear-gradient(
						#e0952a, 
						#e0952a);
					border-radius: 2px;
					color: #fff;
					font-size: 10px;
					outline: none;
					&:hover {
						opacity: 0.7;
					}
					&:active {
						opacity: 1;
					}
				}
			}
		}
		.active {
			border-top: 1px solid #eee;
			border-left: 1px solid #eee;
		}
		.not-active {
			border-bottom: 1px solid #eee;
		}
		.original-active {
			border-bottom: 1px solid #eee;
			border-left: 1px solid #eee;
			.original-label {
				cursor: pointer;
				border: 1px solid #eee; 
				height: 41px; 
				width: 128px;
				color: #333; 
				font-size: 14px;
				letter-spacing: 1px; 
				padding-left: 45px; 
				border-bottom: 0; 
				background: #fff;
			}
			
		}
		.original-not-active {
			border-bottom: 1px solid #eee;
			.original-label {
				width: 128px;
				color: #333; 
				cursor: pointer;
				border-left: 1px solid #eee;
				padding-left: 45px;
				font-size: 14px;
				letter-spacing: 1px; 
			}
		}
		#originalPart {
			display: inline-block; 
			vertical-align: top; 
			height: 41px; 
			line-height: 41px;
			margin-left: -3px;
		}
		.active {
			border-top: 1px solid #eee;
			//border-bottom: 1px solid #eee;
		}
		.not-active {
			border-bottom: 1px solid #eee;
		}
		.el-table {
			color:  #333;
			font-size: 12px;
		}
		.el-input__inner {
			border: 0px;
			width: 100px;
			font-size: 12px;
		}
		.el-table thead {
			color: #333;
			letter-spacing: 1px;
			text-align: center;
			margin-bottom: 20px;
		}
		.el-table tr {
			background: #fafafa;
			height: 53px;
			box-sizing: border-box;
		}
		.el-table--striped .el-table__body tr.el-table__row--striped td {
			background-color: #f5f5f5;
			border: 0;
		}
		.el-table td, .el-table th.is-leaf {
			padding: 0;
			border: 0;
			height: 53px;
			box-sizing: border-box;
		}
		.target-tip {
			float: right;
			font-size: 12px;
			color: #1b7bdd;
			cursor: pointer;
			height: 100%;
		}
		
		#core-data {
			margin-top: 19px; 
			margin-bottom: 20px; 
			width: 100%;
			.eigen-detail-nav {
				margin-top: 28px;
				margin-left: 28px;
				.nav-item {
					cursor: pointer;
					border: 0;
					outline: none;
					background: transparent;
					font-size: 12px;
				}
				.nav-sep {
					display: inline-block;
					vertical-align: middle;
					width: 1px;
					height: 10px;
					background-color: #ccc;
					margin-left: 30px;
					margin-right: 30px;
				}
				
			}
			#dataShow {
				width: 400px;
				height: 316px;
			}
		}
	}
</style>
<script>
	import echarts from 'echarts'
	import { getFeatureData } from '../api/api'
	import originalData from '@/components/OriginalData'

	const values = ['未知', '连续', '离散', '时间'];

	export default {
		props: ['maxHeight'],
		components: {
			originalData
		},
		data () {
			return {
				isEigenActive: false,
				active: 'active',
				notActive: 'not-active',
				originalActive: 'original-active',
				originalNotActive: 'original-not-active',
				originalPartwidth: '',
				eigenData: [],
				dataDistr: '#0d68c4',
				topn: '#666',
				multipleSelection: [],
				restaurants: [],
				state1: '',
				searchItem: '',
				projectId: '',
				featureList: [],
				isListNameShow: false,
				listName: '',
				dataPicFinished: false,
				progressOk: true,
				testPercent: 0,
				varifyNum: 0,
				showAdvancedOption: false,
				filename: '',
				uploadProgress: '0%',
				target: ''
			}
		},
		methods: {
			tab (tag) {
				if (tag === 'detail') {
					this.isEigenActive = true;
					if (this.$store.state.selection && this.$store.state.selection.length) {
						this.isListNameShow = true;
					}
					// set selection
				}
				else {
					this.isEigenActive = false;
					this.isListNameShow = false;
				}
			},
			showSetList (isShow) {
				this.isListNameShow = isShow;
				if (isShow) {
					this.originalPartwidth = ($('tablePart').offsetWidth - $('eigenPart').offsetWidth - 305);
				}
				else {
					this.originalPartwidth = this.originalPartwidth + 202;
				}
				
			},
			setList () {
				if (this.listName) {
					console.log(this.listName);
					console.log(this.$store.state.selection);
					const ids = [];
					this.$store.state.selection.forEach((value, index) => {
						ids.push(value.feature_id);
					})
					const param = {
						project_id: this.$store.state.projectId,
						name: this.listName,
						feature_ids: ids
					};
					createFeatureList(param).then(data => {
						console.log(data);
						getFeatureList({ project_id: this.$store.state.projectId }).then(data => {
							let { feature_lists } = data;
							this.featureList.length = 0;
							for (let i = 0; i < feature_lists.length; i++) {
								const item = feature_lists[i];
								this.featureList.push({
									name: item.name || '全部特征',
									id: item.feature_list_id
								})
							}
							console.log(data);
							// @TODO add feature list
						})
					})

				}
				else {
					this.$message.error('填列表名字啊！');
				}
				
			},
			getList (item) {
				this.isEigenActive = true;
				console.log(item);
				getFeatureData(item.id, {project_id: this.projectId}).then(data => {
					let { feature_list } = data;
					let { features } = feature_list;
					// this.featureData = features;

					for (let i = 0, len = features.length; i < len; i++) {
						const item = features[i];
						item.showTip = false;
						item.typeValue = values[item.type];
						item.order = i;
					}

					//this.eigenData = features;
					this.$store.commit('SET_EIGEN_DATA', features);
					console.log('in test');
					console.log(features);
					console.log(this.$store.state.eigenData);
				})
			},
			getFeatureData (featureListId, projectId) {
				getFeatureData(featureListId, { project_id: projectId }).then(data => {
					let { feature_list } = data;
					let { features } = feature_list;

					for (let i = 0, len = features.length; i < len; i++) {
						const item = features[i];
						item.showTip = false;
						item.typeValue = values[item.type];
						item.order = i;
					}
					this.eigenData = features;
					this.$store.commit('SET_EIGEN_DATA', features);
					console.log('data in getFeatureData');
					// @TODO add feature data
					console.log(data);
				})
			},
			createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },
			loadAll() {
	        	return [
			          { "value": "gender", "address": "长宁区新渔路144号" },
			          { "value": "-01", "address": "上海市长宁区淞虹路661号" },
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
			          { "value": "-06", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
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
			showBar (target) {
				if (target) {
					this.target = target;	
				}
				this.dataPicFinished = true;
				var barChart = echarts.init(document.getElementById('bar-chart'));
				var option = {
					color: '#71b2f3',
		            title: {
		                text: 'ECharts 入门示例'
		            },
		            tooltip: {},
		            legend: {
		                data:['销量']
		            },
		            xAxis: [
		            	{
		                    splitLine:{show: false},//去除网格线
		                    type : 'category',
		                	data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋"],
		                	show: true,
		                	color: '#fff',
			                axisLabel: {
			                	rotate: -45,
			                	textStyle:{
                            		color: "#999"  
                        		}  
			                },
			                axisLine: {
			                	lineStyle: {
			                		color: '#fff',
			                		width: 1
			                	}
			                }
		                }
		            ],
		            yAxis: [
		            	{
		                    splitLine:{show: false},//去除网格线
		                    type : 'value',
		                    axisLine: {
			                	lineStyle: {
			                		color: '#ccc',
			                		width: 2
			                	}
			                },
			                nameTextStyle: {
			                	color: '#b3b3b3'
			                }
		                }
		        	],
		            grid: {
		            	show: 'true',
		            	borderWidth:'0'
		            },
		            series: [
				        {
				            type: 'bar',
				            itemStyle: {
				                normal: {
				                    color: new echarts.graphic.LinearGradient(
				                        0, 0, 0, 1,
				                        [
				                            {offset: 0, color: '#83bff6'},
				                            {offset: 0.5, color: '#188df0'},
				                            {offset: 1, color: '#188df0'}
				                        ]
				                    )
				                },
				                emphasis: {
				                    color: new echarts.graphic.LinearGradient(
				                        0, 0, 0, 1,
				                        [
				                            {offset: 0, color: '#2378f7'},
				                            {offset: 0.7, color: '#2378f7'},
				                            {offset: 1, color: '#83bff6'}
				                        ]
				                    )
				                }
				            },
				            barWidth: '80%',
				            data: [5, 20, 36, Math.random() * 20 + 10, 10]
				        }
		            ]
		        };
				barChart.setOption(option);
			},
			querySearch(queryString, cb) {
		        var restaurants = this.restaurants;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		    },
			search (item) {
				console.log(item);
				if (item && item.value) {
					document.getElementById(item.value).scrollIntoView();
				}
			},

			// 表格操作
			select (selection, row) {
				console.log(selection);
				if (!selection.length) {
					this.$emit('setList', false);
				}
				else {
					this.$emit('setList', true);
				}
				this.$store.commit('SET_SELECTION', selection);
			},
			showTip (row, column, cell, event) {
				setTimeout(() => {
					row.showTip = true;
				}, 0)
				
			},
			hideTip (row, column, cell, event) {
				row.showTip = false;
			},
			chooseTarget (row) {
				this.$emit('setTarget', row.name);
			},
			selectDataType (command) {
				const row = command.n;
				row.type = command.v;
				row.typeValue = values[command.v];
				// 此处有接口
			},
			expand (row, expandRows) {
				setTimeout(() => {
					expandRows.isShow = expandRows.isShow || false;
					if (expandRows.isShow) {
						expandRows.isShow = false;
						return;
					}
					expandRows.isShow = true;
					this.showData('dataDistr', expandRows);
				}, 0)
				
			},
			showData (tag, row) {
				if (tag !== 'topn') {
					var dataShow = document.getElementById('dataShow');
					let chart = echarts.init(dataShow);
					this.topn = '#666';
					this.dataDistr = '#0d68c4';
					let option = {
						color: '#71b2f3',
			            title: {
			                text: 'ECharts 入门示例',
			                show: false
			            },
			            tooltip: {},
			            legend: {
			                data:['销量']
			            },
			            xAxis: [
			            	{
			                    splitLine:{show: false},//去除网格线
			                    type : 'category',
			                	data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋"],
			                	show: true,
			                	color: '#fff',
				                axisLabel: {
				                	rotate: -45,
				                	textStyle:{
	                            		color: "#999"  
	                        		}  
				                },
				                axisLine: {
				                	lineStyle: {
				                		color: '#fff',
				                		width: 1
				                	}
				                }
			                }
			            ],
			            yAxis: [
			            	{
			                    splitLine:{show: false},//去除网格线
			                    type : 'value',
			                    axisLine: {
				                	lineStyle: {
				                		color: '#ccc',
				                		width: 2
				                	}
				                },
				                nameTextStyle: {
				                	color: '#b3b3b3'
				                }
			                }
			        	],
			            grid: {
			            	show: 'true',
			            	borderWidth:'0'
			            },
			            series: [
					        {
					            type: 'bar',
					            itemStyle: {
					                normal: {
					                    color: new echarts.graphic.LinearGradient(
					                        0, 0, 0, 1,
					                        [
					                            {offset: 0, color: '#83bff6'},
					                            {offset: 0.5, color: '#188df0'},
					                            {offset: 1, color: '#188df0'}
					                        ]
					                    )
					                },
					                emphasis: {
					                    color: new echarts.graphic.LinearGradient(
					                        0, 0, 0, 1,
					                        [
					                            {offset: 0, color: '#2378f7'},
					                            {offset: 0.7, color: '#2378f7'},
					                            {offset: 1, color: '#83bff6'}
					                        ]
					                    )
					                }
					            },
					            barWidth: '40%',
					            data: [5, 20, 36, Math.random() * 20 + 10, 10],
					            label: {
					            	normal: {
					            		show: false
					            	}
					            }
					        }
			            ]
			        };
					chart.setOption(option);
				}
				else {
					var dataShow = document.getElementById('dataShow');
					let chart = echarts.init(dataShow);
					this.dataDistr = '#666';
					this.topn = '#0d68c4';
					let option = {
					    title: {
					        text: '特征名',
					        textStyle: {
					        	color: '#999',
					        	fontSize: '12px'
					        }
					    },
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'shadow'
					        }
					    },
					    legend: {
					        //data: ['2011年', '2012年']
					    },
					    grid: {
					        left: '3%',
					        right: '4%',
					        bottom: '3%',
					        containLabel: true
					    },
					    xAxis: {
					    	splitLine: {
					    		// false 时没有网格线
					    		//show: true
					    		show: false
					    	},
					        type: 'value',
					        boundaryGap: [0, 0.01],
					        axisLabel: {
					        	color: '#ccc',
					        	textStyle: {
					        		color: '#fff'
					        	}
					        },
					        axisLine: {
					        	lineStyle: {
					        		color: '#ccc',
					        		width: 2
					        	}
					        }
					    },
					    yAxis: {
					        type: 'category',
					        data: ['巴西','印尼','美国','印度','中国','世界人口(万)'],
					        axisLabel: {
					        	rotate: -45,
					        	textStyle: {
					        		color: '#999'
					        	}
					        },
					        axisLine: {
					        	lineStyle: {
					        		color: '#ccc',
					        		width: 2
					        	}
					        }
					    },
					    series: [
					        {
					            name: '2011年',
					            type: 'bar',
					            color: '#000',
					            data: [18203, 23489, 29034, 104970, 131744, 630230],
					            itemStyle: {
					                normal: {
					                    color: new echarts.graphic.LinearGradient(
					                        0, 0, 0, 1,
					                        [
					                            {offset: 0, color: '#4f9eef'},
					                            {offset: 0.5, color: '#62a9f1'},
					                            {offset: 1, color: '#71b2f3'}
					                        ]
					                    )
					                },
					                emphasis: {
					                    color: new echarts.graphic.LinearGradient(
					                        0, 0, 0, 1,
					                        [
					                            {offset: 0, color: '#2378f7'},
					                            {offset: 0.7, color: '#2378f7'},
					                            {offset: 1, color: '#83bff6'}
					                        ]
					                    )
					                }
					            },
					            // 展示数据
					            label: {
					            	normal: {
					            		show: true,
					            		position: 'right'
					            	}
					            },
					            barWidth: 10,
					            barMaxWidth: 30
					        }/*,
					        {
					            name: '2012年',
					            type: 'bar',
					            data: [19325, 23438, 31000, 121594, 134141, 681807]
					        }*/
					    ]
					};
					chart.setOption(option);
				}

			}
		},
		mounted () {
			const projectId = this.$route.params.projectId;
			this.getFeatureData(-1, projectId);
		}
	}
</script>