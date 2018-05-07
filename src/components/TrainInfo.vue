<template>
	<left-right>
		<div slot="left">
			<core-data></core-data>
		</div>
	</left-right>
</template>
<style lang="scss">
	tr {
		background: red;
	}
	input[type="checkbox"] {
		disabled: true;
	}
</style>
<script>
	import leftRight from '@/components/LeftRight.vue'
	import { poll, getFeatureData, getFeatureList } from '@/api/api'
	import coreData from '@/components/CoreData'

	export default {
		components: {
			leftRight,
			coreData
		},
		data () {
			return {
				fListId: this.$route.params.featureListId,
				targetId: this.$route.params.targetId,
				projectId: this.$route.params.projectId,
				taskId: this.$route.params.taskId
			}
		},
		methods: {
			init (featureListId, params) {
				this.getFeatureData(featureListId, params);
				/*getFeatureList({ project_id: this.projectId }).then(data => {
					let { feature_lists } = data;
					this.featureList.length = 0;
					for (let i = 0; i < feature_lists.length; i++) {
						const item = feature_lists[i];
						this.featureList.push({
							name: item.name || '全部特征',
							id: item.feature_list_id
						})
					}
				})*/
			},

			/**
			 * 获取特征列表数据
			 */
			getFeatureData (featureListId, params) {
				this.isListNameShow = false;

				const timeTypeList = [];

				getFeatureData(featureListId, params).then(data => {
					console.log('featureNum');
					console.log(data);
					let { error, feature_list } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					if (!feature_list) {
						this.$store.commit('SET_EIGEN_DATA', []);
						return;
					}
					let { features } = feature_list;
					this.$store.commit('SET_EIGEN_DATA', features);
					return;

					if (!feature_list && !features) {
						this.$store.commit('SET_EIGEN_DATA', []);
						return;
					}
					// this.queryList.length = 0;
					const len = features.length;
					//timeTypeList.length = 0;
					for (let i = 0; i < len; i++) {
						const item = features[i];
						item.showTip = false;
						item.typeValue = values[item.type];
						if (item.type == 3) {
							timeTypeList.push({name: item.name, id: item.feature_id});	
						}
						item.order = i;
						// this.queryList.push({value: item.name, id: item.feature_id})
					}

					this.$store.commit('SET_TYPE_LIST', timeTypeList);
					console.log(this.$store.state.timeTypeList);
					this.$store.commit('SET_QUERY_LIST', this.queryList);
					//this.eigenData = features;
					//this.curFeatureObj.name = feature_list.name || '全部特征';
					//this.curFeatureObj.id = featureListId;
					const trainObj = this.$store.state.trainObj;
					trainObj.featureName = feature_list.name || '全部特征';
					trainObj.featureNum = len;
					trainObj.featureListId = featureListId;

					
				})
			},
			/**
			 * 
			 */
			pollTrainTask (projectId,  interval) {
				const progressItems = this.$store.state.progressItems;
				
				const timer = setInterval ( () => {
					progressItems.length = 0;
					poll(projectId).then(data => {
						console.log(data);
						let { error, training_task } = data;
						if (error) {
							this.$message.error('');
							return;
						}
						const trainingTask = training_task;
						if (trainingTask && trainingTask.stages) {
							const stages = trainingTask.stages;
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
						}
						const status = trainingTask.status;
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
								clearInterval(timer);
								break;
							case 5: 
								clearInterval(timer);
								
							break;
								break;
						}
					}).catch((error) => {
						console.log(error);
						clearInterval(timer);
					})
				}, interval);
			},

			/**
			 * 获取特征列表数据
			 */
			/*getFeatureData (featureListId, params) {
				getFeatureData(featureListId, params).then(data => {
					const { error, feature_list } = data;
					if (error) {
						this.$message.error(error.desc);
						return;
					}
					console.log(data);
				}).catch (error => {
					console.log(error);
				})
			}*/
		},
		mounted () {
			this.$store.state.progressItems.length = 0;
			this.pollTrainTask(this.projectId, 500);
			const params = {
				project_id: this.projectId
			};

			this.init(-1, params);
		}
	}
</script>



