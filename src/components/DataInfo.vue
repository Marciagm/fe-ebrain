<template>
	<left-right>
		<div slot="left" ref="info-left">
			<div class="target">
				<div style="display: inline-block; width: 210px; margin-right: 80px;">
					<div v-if="!dataPicFinished" class="target-label" style="color: #ccc;">输入预测目标</div>
					<div v-else class="target-label" for="target">输入预测目标</div>
					<el-autocomplete
				      v-model="target"
				      :fetch-suggestions="querySearch"
				      placeholder="输入预测目标"
				      @select="showBar(target)"
				      class="target-input"
				    ></el-autocomplete>	
				</div>

				<div class="chart-con">
					<div id="bar-chart"></div>
				</div>					
				<el-button v-if="!dataPicFinished" type="info" class="start-run run-default" disabled>启动训练</el-button>
				<button v-else class="start-run run-hilight" @click="startRun">启动训练</button>
				<div class="tips" v-if="tipsStatus">
					{{ tips }}
				</div>
			</div>

			<!-- 显示高级选项 -->
			<div class="data-info-avo">
				<div @click="advancedOption" class="info-avo-option">
					<span class="info-avo-label">显示高级选项</span>
					<img v-if="!showAdvancedOption" src="../images/Down-arrow-small.png">
					<img v-else src="../images/Down-arrow-small.png" style="transform:rotate(180deg);">
				</div>
				<div v-show="showAdvancedOption" class="info-avo-con">
					<advanced-option></advanced-option>			
				</div>
			</div> 

			<!-- 表格 -->
			<div id="tables">
				<div id="tablePart">
					<div id="eigenPart" :class="[isEigenActive ? active : notActive]">
						<img src="../images/All-features.png" style="width: 13px; height: 13px;margin-right: 5px;">
						<span style="cursor: pointer; color: #333; font-size: 14px;letter-spacing: 1px;" @click="tab('detail')">特征详情</span>
						<el-autocomplete
					      v-model="state1"
					      :fetch-suggestions="querySearch"
					      placeholder="搜索"
					      @select="search"
					      style="height: 15px; border: 0; text-align: center; font-size: 12px;"
					    ></el-autocomplete>	
						<el-dropdown style="cursor: pointer;">
							<span class="el-dropdown-link">
							    <span>全部特征</span>
							    <span style="color: #666; font-size: 10px;">(特征列表)</span>
							    <i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
							    <el-dropdown-item>全部特征</el-dropdown-item>
							    <el-dropdown-item divided>特征列表二</el-dropdown-item>
							    <el-dropdown-item>特征列表三</el-dropdown-item>
							    <el-dropdown-item>特征列表四</el-dropdown-item>
							    <el-dropdown-item>特征列表五</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<div class="eigen-list" v-if="isListNameShow"> 
							<input placeholder="新建特征列表" class="eigen-list-input" v-model="listName" />
							<button class="eigen-list-button" @click="setList">确定</button>
						</div>
					</div>

					<div id="originalPart" :class="[isEigenActive ? originalNotActive : originalActive]" :style="{width: originalPartwidth + 'px'}">
						<div class="original-label" @click="tab('original')">
							<img src="../images/Original-data.png" style="margin-right: 5px;" >
							原始数据
						</div>
					</div>
				</div>

				<div style="margin-top: 19px; margin-bottom: 20px; width: 100%;">
					<!-- 特征详情 -->
					<eigenvalue-table v-if="isEigenActive" v-on:setTarget="showBar" v-on:setList="showSetList"></eigenvalue-table>
					
					<!-- 表格部分 -->
					<div style="" v-if="!isEigenActive">
						<original-data :max-height="maxHeight"></original-data>
					</div>
				</div>
			</div>
			<!-- 下标 -->
			<div class="data-foot">
				{{ filename }}
			</div>
		</div>
		<div slot="right" ref="info-right" >
			<div class="loading-progress">
				<div class="load-progress-border" style="top: 0;"></div>
				<div class="loading-progress-con progress-bg"></div>
				<div class="loading-progress-con offset">
					<div>1.上传数据</div>
					<span class="load-progress-status">(2.5s)</span>
				</div>
				<img src="../images/finish.png" class="load-effect">
				<div class="load-progress-border"></div>
			</div>
			
			<div class="loading-progress">
				<div class="load-progress-border" style="top: 0;"></div>
				<div class="loading-progress-con progress-bg"></div>
				<div class="loading-progress-con offset">
					<div>2.生产数据画像</div>
					<span class="load-progress-status">(2.5s)</span>
				</div>
				<img src="../images/finish.png" class="load-effect">
				<div class="load-progress-border"></div>
			</div>
			<div class="loading-progress">
				<div class="load-progress-border" style="top: 0;"></div>
				<div class="progress-bar" style="width: 100%; background: #eee;" v-if="progressOk">
					<div class="progress-bar" :style="{width: uploadProgress}"></div>
				</div>
				<div class="loading-progress-con progress-bg" :style="{width: uploadProgress}"></div>
				<div class="loading-progress-con offset">
					<div>2.生成数据画像</div>
					<span class="load-progress-status">已完成{{ uploadProgress }}</span>
				</div>
				<img src="../images/loading.gif" class="load-effect">
			</div>
		</div>
	</left-right>
</template>
<style lang="scss">
	table {
		border: 0;
	}
	.el-autocomplete-suggestion li {
		font-size: 12px;
	}
	.target {
		position: relative;
		height: 300px;
		width: 90%;
		margin-left: 5%;
		text-align: left;
		.target-label {
			margin-top: 87px;
			font-size: 20px;
			font-weight: normal;
			letter-spacing: 2px;
			color: #333;
		}
		.target-input {
			font-size: 14px;
			color: #333;
			margin-top: 24px;
			width: 210px;
			height: 50px;
			background-color: #fff;
			box-shadow: 0px 4px 6px 0px 
				rgba(0, 0, 0, 0.06);
			border-radius: 4px;
			border: solid 1px #eeeeee;
			input {
				border: 1px;
				height: 50px;
				font-size: 14px;
			}
		}
		::-webkit-input-placeholder { /* WebKit browsers */
		    color:    #ccc;
		}
		:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
		    color:    #ccc;
		}
		::-moz-placeholder { /* Mozilla Firefox 19+ */
		    color:    #ccc;
		}
		:-ms-input-placeholder { /* Internet Explorer 10+ */
		    color:    #ccc;
		}
		.chart-con {
			display: inline-block;
			vertical-align: top;
			max-width: 677px;
			height: 300px;
			text-align: center;
			#bar-chart {
				margin-left: 189px;
				margin-top: 50px;
				text-align: center;
				width: 300px;
				height: 200px;
			}	
		}
		.run-default {
			background-color: #ccc;
		}
		.run-hilight {
			background-image: linear-gradient(90deg, 
				#0d65be 0%, 
				#1978d9 45%, 
				#248bf4 100%), 
			linear-gradient(
				#cccccc, 
				#cccccc);
			background-blend-mode: normal, 
				normal;
			box-shadow: 0px 4px 6px 0px 
				rgba(5, 0, 50, 0.2);
			&:hover {
				opacity: 0.7;
			}
			&:active {
				opacity: 1;
			}
		}
		.start-run {
			position: absolute;
			top: 107px;
			right: 87px;
			float: right;
			width: 127px;
			height: 51px;
			outline: none;
			border-radius: 4px;
			font-size: 20px;
			letter-spacing: 2px;
			color: #ffffff;
		}
		.tips {
			position: absolute;
			right: 20px;
			top: 20px;
			height: 33px;
			line-height: 33px;
			background-color: #fafafa;
			border-radius: 4px;
			border: 1px solid #eee;
			font-size: 12px;
			letter-spacing: 1px;
			color: #e09e2a;
			padding-left: 24px;
			padding-right: 24px;
		}
	}
	.data-info-avo {
		margin-bottom: 21px; 
		text-align: center;
		.info-avo-option {
			cursor: pointer; 
			width: 20%; 
			margin-left: 40%;
			margin-bottom: 21px;
		}
		.info-avo-label {
			font-size: 12px; 
			color: #666; 
			letter-spacing: 1px;
		}
		.info-avo-con {
			width: 100%; 
			height: 642px;
			padding-top: 57px; 
			background-color: #fafafa;
		}
	}

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
	.offset {
		margin-left: 20%;
	}
	.progress-bg {
		background: #eff3f5;
	}
	.progress-bar {
		height: 6px;
		border-radius: 0px 3px 3px 0px;
		background-image: linear-gradient(90deg, 
			#a0cfff 0%, 
			#5ca7f4 45%, 
			#187fe8 100%), 
		linear-gradient(
			#86c0fb, 
			#86c0fb);
	}
	.data-process {
		background: #eff3f5;
		height: 68px;
		position: relative;
	    
		.data-process-con {
			position: absolute;
			top: 15px; 
			left: 20%
		}
	}
	.load-effect {
		right: 20%; 
		top: 24px; 
		position: absolute;
	}
	.loading-progress {
		text-align: center;
		height: 74px;
		font-size: 15px;
		letter-spacing: 1px;
		border-radius: 0px 4px 4px 0px;
		position: relative;
		.loading-progress-con {
			padding-top: 12px; 
			height: 56px;
			position: absolute;
			color: #666666;
			font-size: 15px;
		    letter-spacing: 1px;
		}
		.load-progress-border {
			width: 100%;
			height: 1px;
			position: absolute;
			top: 74px;
			background-color: #eeeeee;
		}
		.load-progress-status {
			font-size: 12px;
		}
	}
	.load-fail-tip {
		font-size: 12px;
		letter-spacing: 1px;
		color: #e00202;
	}
	
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
	}
	.el-tooltip__popper.is-dark {
		background: #187fe8;
	}
	.el-dropdown-menu__item {
		font-size: 12px;
	}
</style>
<script>
	import echarts from 'echarts'
	import advancedOption from '@/components/AdvancedOption'
	import originalData from '@/components/OriginalData'
    import eigenvalueTable from '@/components/EigenvalueTable'
	import leftRight from '@/components/LeftRight.vue'

    let obj = {};
    function $ (id) {
    	return document.getElementById(id);
    }
    window.onresize = () => {
    	const tablePart = $('tablePart');
    	const eigenPart = $('eigenPart');
    	if (tablePart && eigenPart) {
    		obj.originalPartwidth = (tablePart.offsetWidth - eigenPart.offsetWidth - 100);
    	}
    	
    }
    
    function infInit (obj) {

    }

    //
    function drawLine () {

    }
    function drawBar () {

    }
	export default {
		components: {
			advancedOption,
			originalData,
			eigenvalueTable,
			leftRight
		},
		data () {
			return {
				isEigenActive: true,
				active: 'active',
				notActive: 'not-active',
				originalActive: 'original-active',
				originalNotActive: 'original-not-active',
				originalPartwidth: '',
				isListNameShow: false,
				listName: '',
				dataPicFinished: false,
				progressOk: true,
				testPercent: 0,
				varifyNum: 0,
				showAdvancedOption: false,
				restaurants: [],
				state1: '',
				filename: '',
				searchItem: '',
				maxHeight: 374,
				uploadProgress: '0%',
				target: ''
			}
		},
		methods: {
			showSetList (isShow) {
				this.isListNameShow = isShow;
				//$('originalPart').style.width = $('originalPart').offsetWidth - 150 + 'px';
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
				}
				else {
					this.$message.error('填列表名字啊！');
				}
				
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
			advancedOption () {
            	this.showAdvancedOption = !this.showAdvancedOption;
			},
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
			startRun () {
				alert('run');
			}
		},
		mounted () {
			obj = this;
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.maxHeight = (h - 500);
            this.uploadProgress = '30%';
            this.filename = this.$store.state.filename;
            this.$store.commit('SET_PROJECT_STATUS', true);
            this.restaurants = this.loadAll();
            this.originalPartwidth = ($('tablePart').offsetWidth - $('eigenPart').offsetWidth - 100);
		},
		computed: {
			/*originalPartwidth () {
				const width = resize();
				if (this.isShow) {
					return (width - 205) + 'px'; 
				}
				else {
					return width + 'px';
				}
			}*/
			tips () {
				return this.$store.state.tips;
			},
			tipsStatus () {
				return this.$store.state.tipsStatus;
			}
		}
	}
</script>


















