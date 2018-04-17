<template>
	<div class="advanced-option">
		<el-row>
			<el-col style="letter-spacing: 1px; color: #666666; margin-bottom: 39px;">高级选项</el-col>
		</el-row>
		<el-row style="margin-bottom: 59px;">
			<el-col :span="10" class="option-label">1.优化目标:</el-col>
			<el-col :span="10" class="option-value">Logloss（默认）</el-col>
		</el-row>

		<el-row>
			<el-col :span="10" class="option-label">1.区分选择:</el-col>
			<el-col :span="10">
				<div class="option-value">选择区分方法</div>
				<div style="width: 580px;">
					<button class="option-button-hl">随机</button>
					<div class="option-sep"></div>
					<button class="option-button-default">随时间划分</button>
				</div>

				<div class="state-label">（保证同分布的数据拆分方法）</div>
				<div class="option-con-sep"></div>

				<div class="option-value">训练模型用</div>

				<div style="width: 580px;">
					<button class="option-button-hl">交叉验证</button>
					<div class="option-sep"></div>
					<button class="option-button-default">训练测试验证</button>
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
					    	<button style="background-color: #fff; height: 24px; border-radius: 4px;border: solid 1px #ccc; margin-right: 16px; width: 54px;">{{ testPercent/5 }}%</button>
					        <el-slider v-model="testPercent" style="width: 145px; display: inline-block;vertical-align: middle;" :format-tooltip="formatTestPercent"></el-slider>
						</div>
					    <div class="state-label">（测试集的数据占总数据百分比必须介于0%-20%）</div>
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
				varifyNum: 0,
				testPercent: 0
			}
		},
		methods: {
			formatVarifyNum (val) {
				return val  / 10;
			},
			formatTestPercent (val) {
				return val / 5 + '%';
			}
		}
	}
</script>
<style lang="scss">
	.advanced-option {
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
			background-blend-mode: normal, 
				normal;
			box-shadow: 0px 2px 4px 0px 
				rgba(5, 0, 50, 0.2);
			border-radius: 4px;
		}
	}
</style>
