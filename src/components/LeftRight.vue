<template>
	<div class="left-right">
		<div class="left" :style="{minHeight: minHeight}">
			<slot name="left" :style="{minHeight: minHeight - 40}"></slot>
			<div class="data-foot">
				{{ filename }}
				<div style="float: right; margin-right: 5%;">
					<div style="display: inline-block;" v-show="showFeatureList">
						当前特征列表：<span style="color: #e0952a;">{{ featureListName }}</span> 
					</div>
					&nbsp;&nbsp;
					<div style="display: inline-block;" v-show="showFeatureNum">
						特征总数：<span style="color: #e0952a;">{{ featureNum }}</span>
					</div>
					&nbsp;&nbsp;
					<div style="display: inline-block;" v-show="showTarget">
						预测目标：<span style="color: #e0952a;">{{ trainObj.targetName }}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="right" :style="{minHeight: minHeight}">
			<div v-if="!allTrainFinished">
				<div class="progress" v-for="item in progressItems">
					<!-- 尚未开始 -->
					<div v-if="item.status==0">
						<div class="progress-border"></div>
						<!-- 正在进行时 -->
						<div class="progress-con offset">
							<div>{{ item.name }}</div>
						</div>
						<div class="progress-border"></div>
					</div>
					<!-- 已结束 -->
					<div v-else-if="item.status==2">
						<div class="progress-border" :style="{top: item.status==1 ? '' : 0}"></div>
						<div class="progress-con progress-bg"></div>
						<div class="progress-con offset">
							<div>{{ item.name }}</div>
							<span class="progress-status duration" >({{ item.duration }})</span>
						</div>
						<img src="../images/finish.png" class="load-effect">
						<div class="progress-border"></div>
					</div>
					<!-- 正在进行时或出错 -->
					<div v-else>
						<div class="progress-border" :style="{top: item.status==1 ? '' : 0}"></div>
						<!-- 正在进行时 -->
						<div v-if="item.status==1" class="progress-bar" style="width: 100%; background: #eee;">
							<div class="progress-bar" :style="{width: item.percent}"></div>
						</div>
						
						<div class="progress-con progress-bg" :style="{width: item.status==2 ?'' : item.percent}"></div>
						
						<div class="progress-con offset">
							<div>{{ item.name }}</div>
							<span v-if="item.status==2" class="progress-status duration" >({{ item.duration }})</span>
							<span v-if="item.status==1" class="progress-status">已完成{{ item.percent }}</span>
							<span v-if="item.status==-1" class="load-fail-tip">
								{{ item.failReason }}<a href="#/main/data/upload" style="color: #1b7bdd"> 请重试</a>
							</span>
						</div>

						<img v-if="item.status==-1" src="../images/cuowu.png" class="load-effect">
						<img v-if="item.status==1" src="../images/loading.gif" class="load-effect">
						<div v-if="item.status!=1" class="load-progress-border"></div>
					</div>
				</div>
				<div v-if="showTargetTips" class="tips offset">*请选择目标继续</div>
			</div>
			<!-- 算法 -->
			<div style="" v-else>
				<div v-if="allModelFinished">
					<div style="font-size: 12px; color: #999; margin-left: 30px;">
						训练结束
					</div>
					<div style="height: 29px; line-height:29px; font-size: 12px;  background: #eee; width: 99px; text-align: center; border: solid 1px #e6e6e6; margin-left: 20px; margin-top: 20px;letter-spacing: 1px; cursor: pointer;" @click="goToTrain">
						重新训练模型
					</div>
				</div>
				<div v-else>
					<div class="progress" v-for="item in modelProgressItems">
						<!-- 尚未开始 -->
						<div v-if="item.status==0">
							<div class="progress-border"></div>
							<!-- 正在进行时 -->
							<div class="progress-con offset">
								<div>{{ item.name }}</div>
							</div>
							<div class="progress-border"></div>
						</div>
						<!-- 已结束 -->
						<div v-else-if="item.status==2">
							<div class="progress-border" :style="{top: item.status==1 ? '' : 0}"></div>
							<div class="progress-con progress-bg"></div>
							<div class="progress-con offset">
								<div>{{ item.name }}</div>
								<span class="progress-status duration" >
									完成 &nbsp;&nbsp;
									耗时({{ item.duration }})
								</span>
							</div>

							<img src="../images/model-close.png" class="load-effect" @click="endTask(item)">
							<!-- <img src="../images/finish.png" class="load-effect"> -->
							<div class="progress-border"></div>
						</div>
						<!-- 正在进行时或出错 -->
						<div v-else>
							<div class="progress-border" :style="{top: item.status==1 ? '' : 0}"></div>
							<!-- 正在进行时 -->
							<div v-if="item.status==1" class="progress-bar" style="width: 100%; background: #eee;">
								<div class="progress-bar" :style="{width: item.percent}"></div>
							</div>
							
							<div class="progress-con progress-bg" :style="{width: item.status==2 ?'' : item.percent}"></div>
							
							<div class="progress-con offset">
								<div>{{ item.name }}</div>
								<span v-if="item.status==2" class="progress-status duration" >({{ item.duration }})</span>
								<span v-if="item.status==1" class="progress-status">
									已完成{{ item.percent }}&nbsp;&nbsp;&nbsp;&nbsp;已耗时 {{ item.duration }}
								</span>
								<span v-if="item.status==-1" class="load-fail-tip">
									{{ item.failReason }}<a href="#/main/data/upload" style="color: #1b7bdd"> 请重试</a>
								</span>
							</div>

							<img v-if="item.status==-1" src="../images/cuowu.png" class="load-effect">
							<img v-if="item.status==1" src="../images/loading.gif" class="load-effect">
							<img src="../images/model-close.png" class="end-task" @click="endTask(item)">
							<div v-if="item.status!=1" class="load-progress-border"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
	.left-right {
		background: #f4f4f6;
		display: flex;
		.left {
			border-radius: 0px 8px 0px 0px;
			width: 0;
			flex: 4;
			display: inline-block;
			background: #fff;
			margin-right: 20px;
			position: relative;
			.data-foot {
				background: #fff;
				z-index: 1000;
				letter-spacing: 1px; 
				color: #999; 
				position: fixed;
				bottom: 0; 
				height: 28px; 
				line-height: 28px;
				/*border-top: 1px solid #e6e6e6;*/
				box-shadow: 0px -1px 2px 0px rgba(5, 0, 50, 0.1);
				width: calc(80% - 17px);
				box-sizing: border-box;
				padding-left: 39px;
				text-align: left;
			}
		}
		.right {
			border-radius: 8px 0px 0px 8px;
			flex: 1;
			display: inline-block;
			background: #fff;
			padding-top: 20px;
			.load-effect {
				right: 20%; 
				top: 24px; 
				position: absolute;
			}
			.end-task {
				right: 5%; 
				top: 24px; 
				position: absolute;
			}
			.offset {
				margin-left: 20%;
			}
			.progress {
				text-align: center;
				height: 74px;
				font-size: 15px;
				letter-spacing: 1px;
				border-radius: 0px 4px 4px 0px;
				position: relative;
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
				.progress-con {
					padding-top: 12px; 
					height: 56px;
					position: absolute;
					color: #666666;
					text-align: left;
				}
				.progress-border {
					width: 100%;
					height: 1px;
					position: absolute;
					top: 74px;
					background-color: #eee;
				}
				.progress-status {
					font-size: 12px;
					letter-spacing: 1px;
					color: #666;
				}
				.duration {
					color: #e0952a;
					margin-left: 15px;
				}
			}
			.load-fail-tip {
				font-size: 12px;
				letter-spacing: 1px;
				color: #e00202;
			}
			.tips {
				font-size: 12px;
				padding-top: 20px;
				letter-spacing: 1px;
				color: #e0952a;
			}
		}
	}
</style>
<script>
	let obj = {};
	window.onresize = function () {
		console.log('in resize');
		let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		obj.minHeight = (h - 88) + 'px';
	}

	export default {
		data () {
			return {
				showTarget: false,
				showFeatureNum: false,
				showFeatureList: false,
				minHeight: '',
				projectId: this.$route.params.projectId
			}
		},
		mounted () {
			obj = this;
			let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			this.minHeight = (h - 88) + 'px';
		},
		methods: {
			setStyles (styles) {
				this.showTarget = styles.showTarget;
				this.showFeatureList = styles.showFeatureList;
				this.showFeatureNum = styles.showFeatureNum;
			},
			goToTrain () {
				this.$router.push({
					path: `/main/data/info/${this.projectId}`
				})
			},
			endTask (item) {
				this.$emit('endTask', item);
			}
		},
		computed: {
			filename () {
				return this.$store.state.filename;
			},
			progressItems () {
				return this.$store.state.progressItems;
			},
			modelProgressItems () {
				return this.$store.state.modelProgressItems;
			},
			
			showTargetTips () {
				return this.$store.state.showTargetTips;
				/*return this.$store.state.uploadProgress.status === 2 
					&& this.$store.state.portraitProgress.status === 2 && !this.taskId;*/
			},

			/**
			 * 特征名称
			 */
			featureListName () {
				return this.$store.state.trainObj.featureName;
			},

			/**
			 * 特征数总量
			 */
			featureNum () {
				return this.$store.state.trainObj.featureNum;
			},
			allTrainFinished () {
				return this.$store.state.allTrainFinished;
			},
			allModelFinished () {
				return this.$store.state.allModelFinished;	
			},
			fLId () {
				return this.$store.state.fLId;
			},
			taskId () {
				return this.$store.state.taskId;
			},
			targetId () {
				return this.$store.state.targetId;
			},
			trainObj () {
				return this.$store.state.trainObj;
			},
			targetName () {
				return this.$store.state.trainObj.targetName;
			}
		}
	}
</script>




