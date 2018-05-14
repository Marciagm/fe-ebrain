<template>
	<div class="advanced-option">
		<el-row>
			<el-col :span="4" :offset="6" style="letter-spacing: 1px; color: #666666; margin-bottom: 39px;">高级选项</el-col>
		</el-row>
		<el-row style="margin-bottom: 59px;">
			<el-col :span="4" :offset="6" class="option-label">1.优化目标:</el-col>
			<el-col :span="10" class="option-value">Logloss（默认）</el-col>
		</el-row>

		<el-row>
			<el-col :span="4" :offset="6" class="option-label">1.区分选择:</el-col>
			<el-col :span="10">
				<div style="width: 585px;">
				<div style="display: inline-block; width: 278px;">
					<div class="option-value">选择区分方法</div>
					<div style="width: 580px;" v-if="random">
						<button class="option-button-hl">随机</button>
						<div class="option-sep"></div>
						<button :class="!noTimeType?'option-button-default' : 'option-button-dark'" @click="chooseDis(0, false)" :disabled="noTimeType">随时间划分</button>
					</div>

					<div style="width: 580px;" v-else>
						<button class="option-button-default" @click="chooseDis(0, true)">随机</button>
						<div class="option-sep"></div>
						<button class="option-button-hl">随时间划分</button>
					</div>
				</div>

				<div style="display: inline-block; width: 302px;" v-if="!random && !noTimeType">
					<div class="option-value">选择特征例</div>
					<div style="width: 580px;">
						<el-dropdown trigger="click" placement="bottom-start" @command="select">
						  	<div style="width: 182px; border-radius: 4px;height: 24px; background-color: #fff;border: solid 1px #ccc; line-height: 24px; padding-left: 12px; font-size: 12px;">
						    	{{ featureName || '默认第一个特征'}} 
						    	<i style="position: absolute; right: 15px; top: 8px;" class="el-icon-arrow-down el-icon--right"></i>
						  	</div>
						  	<el-dropdown-menu slot="dropdown">
						    	<el-dropdown-item v-for="item in timeTypeList" :command="item">{{ item.name }}</el-dropdown-item>
						  	</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>

				<div class="state-label">（保证同分布的数据拆分方法）</div>
				<div class="option-con-sep"></div>
			</div>
				<div class="option-value">训练模型用</div>

				<div style="width: 580px;" v-if="crossVadify & random">
					<button class="option-button-hl">交叉验证</button>
					<div class="option-sep"></div>
					<button class="option-button-default" @click="chooseDis(1, false)">训练测试验证</button>
				</div>

				<div style="width: 580px;" v-else>
					<button class="option-button-dark" v-if="!random" disabled>交叉验证</button>
					<button class="option-button-default" @click="chooseDis(1, true)" v-else>交叉验证</button>
					<div class="option-sep"></div>
					<button class="option-button-hl">训练测试验证</button>
				</div>
				<div style="width: 585px; margin-top: 39px;">
					<div style="display: inline-block; width: 278px; vertical-align: top;">
					    <span class="option-value">交叉验证折数</span>
					    <div>
					    	<button style="background-color: #fff; height: 24px; border-radius: 4px;border: solid 1px #ccc; width: 40px; margin-right: 16px;">{{ varifyNum/10 }}</button>
					        <el-slider v-model="varifyNum" style="width: 145px; display: inline-block;vertical-align: middle;" :format-tooltip="formatVarifyNum" :min=20 :step="10"></el-slider>
						</div>
					    <div class="state-label">（交叉验证折数结余2-10）</div>
					</div>
					<div style="display: inline-block; width: 302px; vertical-align: top;">
					    <span class="option-value">测试集百分比</span>
					    <div>
					    	<button style="background-color: #fff; height: 24px; border-radius: 4px;border: solid 1px #ccc; margin-right: 16px; width: 54px;">{{ Math.floor(testPercent/5) }}%</button>
					        <el-slider :min=25 v-model="testPercent" style="width: 145px; display: inline-block;vertical-align: middle;" :format-tooltip="formatTestPercent"></el-slider>
						</div>
					    <div class="state-label">（测试集的数据占总数据百分比必须介于5%-20%）</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				noTimeType: false,
				featureName: '',
				testPercent: 100,
				random: true,
				crossVadify: true
			}
		},
		methods: {
			updateTimeTypeList () {
				console.log('in updateTimeTypeList');
				if (!this.$store.state.timeTypeList.length) {
					this.noTimeType = true;
					this.chooseDis(0, true)
				}
				else {
					this.noTimeType = false;
				}
			},
			formatVarifyNum (val) {
				this.$store.state.trainObj.crossValidFold = val / 10;
				return val  / 10;
			},
			formatTestPercent (val) {
				this.$store.state.trainObj.testRatio = Math.floor(val / 5);
				return Math.floor(val / 5) + '%';
				// return val / 5 + '%';
			},
			chooseDis (row, val) {
				const trainObj = this.$store.state.trainObj;
				if (row === 0) {
					this.random = val;
					// 随机
					if (val) {
						trainObj.timeSerialFeatureId = '';
					}
					// 随时间划分
					else {
						// 第一个时间
						trainObj.timeSerialFeatureId = '';
					}
				}
				if (row === 1) {
					// 交叉验证
					if (val) {
						trainObj.splitMethod = 1;
					}
					else {
						trainObj.splitMethod = 2;
					}
					this.crossVadify = val;
				}
				
			},
			select (command) {
				console.log(command);
				this.featureName = command.name;
				this.$store.state.trainObj.timeSerialFeatureId = command.id;
			}
		},
		mounted () {
			setTimeout(() => {
				if (!this.$store.state.timeTypeList.length) {
					this.noTimeType = true;
				}
				else {
					this.noTimeType = false;
				}
				console.log(`this.noTimeType: ${this.noTimeType}`);
			}, 0)
		},
		computed: {
			timeTypeList () {
				console.log(this.$store.state.timeTypeList);
				if (!this.$store.state.timeTypeList.length) {
					this.noTimeType = true;
				}
				else {
					this.noTimeType = false;
				}
				return this.$store.state.timeTypeList;
			},
			varifyNum: {
				set (num) {
					this.$store.state.trainObj.varifyNum = num;
				},
				get () {
					return this.$store.state.trainObj.varifyNum;
				}
			}
		}
	}
</script>
<style lang="scss">
	.advanced-option {
		text-align: left;
		.option-con-sep {
			width: 564px;
			height: 1px;
			background-color: #e6e6e6;
			margin-bottom: 39px;
			margin-top: 39px;
		}
		.option-label {
			font-size: 16px;
			letter-spacing: 1px;
			color: #333333;
		}
		.option-value {
			display: inline-block;
			font-size: 14px;
			letter-spacing: 1px;
			color: #333333;
			margin-bottom: 19px;
		}
		.state-label {
			font-size: 12px;
			letter-spacing: 1px;
			color: #b3b3b3;
			margin-top: 9px;
		}
		.option-sep {
			display: inline-block;
			vertical-align: middle;
			margin-left: 17px;
			margin-right: 17px;
			width: 1px;
			height: 14px;
			background-color: #ccc;
		}
		.option-button-default {
			padding-left: 14px;
			padding-right: 14px;
			height: 24px;
			background-color: rgba(51, 51, 51, 0.5);
			border-radius: 4px;
			color: #fff;
			letter-spacing: 1px;
		}
		.option-button-dark {
			padding-left: 14px;
			padding-right: 14px;
			height: 24px;
			background-color: #eee;
			border-radius: 4px;
			color: #cccccc;
			letter-spacing: 1px;
		}
		.option-button-hl {
			padding-left: 14px;
			padding-right: 14px;
			font-size: 12px;
			letter-spacing: 1px;
			color: #ffffff;
			height: 24px;
			background-image: linear-gradient(90deg, 
				#0d65be 0%, 
				#1978d9 45%, 
				#248bf4 100%), 
			linear-gradient(
				#cccccc, 
				#cccccc);
			border-radius: 4px;
		}
		button {
			outline: none;
		}
	}
</style>
