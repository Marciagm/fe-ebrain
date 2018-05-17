<template>
	<div>
		<top-part ref="top" v-on:getStatus="init"></top-part>
		<left-right ref="leftRight">
			<div slot="left" class="train-left">
				<core-data ref="coreData" :isEigenActive="true"></core-data>
			</div>
		</left-right>
	</div>
</template>
<style lang="scss">
	input[type="checkbox"] {
		disabled: true;
	}
	.train-left {
		margin-top: 20px;
	}
</style>
<script>
	import topPart from '@/components/Top.vue'
	import leftRight from '@/components/LeftRight.vue'
	import { poll, getFeatureData, getFeatureList } from '@/api/api'
	import coreData from '@/components/CoreData'
	const values = ['未知', '连续', '离散', '时间'];

	export default {
		components: {
			topPart,
			leftRight,
			coreData
		},
		data () {
			return {
				fLId: '',
				targetId: '',
				taskId: '',
				projectId: this.$route.params.projectId
			}
		},
		methods: {
			/**
			 * 轮询任务
			 *
			 * @param {string} projectId 任务id
			 * @param {number} interval 间隔
			 */
			pollTrainTask (projectId,  interval) {
				const progressItems = this.$store.state.progressItems;
				let dataLoaded = false;
				let initCoreData = false;
				window.trainTimer = null;
				clearInterval(window.trainTimer);
				window.trainTimer = setInterval ( () => {
					progressItems.length = 0;
					poll(projectId).then(data => {
						let { error, preprocessing_task, target_feature_id, target_feature_name } = data;
						if (error) {
							this.$message.error(error.desc);
							clearInterval(trainTimer);
							return;
						}
						// 请去info页面
						if (!preprocessing_task) {
							this.$router.push(`/main/data/info/${this.projectId}`);
							clearInterval(trainTimer);
							return;
						}

						const preProcessingTask = preprocessing_task;
						const { stages, preprocess_info } = preProcessingTask;
						
						this.fLId = preprocess_info.feature_list_id;
						this.targetId = target_feature_id;
						this.taskId = preProcessingTask.task_id;

						if (!initCoreData) {
							this.$refs.coreData.initCoreData({
								taskId: this.taskId,
								targetId: this.targetId,
								fLId: this.fLId
							});
							initCoreData = true;
						}
						
						progressItems.length = 0;
						for (let i = 0, len = stages.length; i < len; i++) {
							progressItems.push({
								name: (i + 1) + '.' + stages[i].stage_name,
								percent: stages[i].percentage + '%',
    							status: stages[i].percentage == 100 ? 2 : 1,
    							duration: '2.5s',
    							failReason: ''
							})
						}
						// 下一步
						progressItems.push({
							name: '准备中...',
							status: 0
						})
						const status = preProcessingTask.status;
						const uploadProgress = this.$store.state.uploadProgress;
						
						// 上传数据
						switch (status) {
							case 0:
								break; 
							case 1:
								break;
							case 2:
								break; 
							case 3:
								
								break;
							// 训练任务结束
							case 4: 
								progressItems.pop();
								this.$refs.top.setColors(['#1b7bdd', '#666', '#666']);
								// 模型也可以点击了
								if (this.$store.state.curStatus == 4) {
									this.$store.commit('SET_CUR_STATUS', 5);
								}
								else {
									this.$store.commit('SET_CUR_STATUS', 4);
								}
								// 特征重要性已经出来了
								if (preprocess_info && !dataLoaded) {
									const params = {
										project_id: this.projectId,
										train_task_id: this.taskId
									};
									if (!dataLoaded) {
										this.$refs.coreData.init(preprocess_info.feature_list_id, params);
										this.$refs.coreData.showImportance();
										dataLoaded = true;
									}
									
								}
								this.$store.commit('SET_MODEL_STATUS', true);
								clearInterval(trainTimer);
								break;
							case 5: 
								clearInterval(trainTimer);
							break;
								break;
						}
					}).catch((error) => {
						console.log(error);
						clearInterval(trainTimer);
					})
				}, interval);
			},
			init () {
				this.$refs.leftRight.setStyles({
					showTarget: true,
					showFeatureNum: true,
					showFeatureList: true
				});
				if (this.curStatus > 3) {
					this.$refs.top.setColors(['#1b7bdd', '#666', '#666']);
				}
				else {
					this.$refs.top.setColors(['#1b7bdd', '#ccc', '#666']);
				}
				
				this.pollTrainTask(this.projectId, 1000);
				this.$store.commit('SET_TARGET_TIPS', false);
				this.$store.state.progressItems.length = 0;
				this.$store.commit('SET_TRAIN_STATUS', false);
				this.$refs.coreData.setEigenActive(true);
			}
		},
		mounted () {
			console.log('in train: ' + this.curStatus);
		},
		computed: {
			curStatus () {
				return this.$store.state.curStatus;
			}
		}
	}
</script>



