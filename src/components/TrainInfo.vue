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
	import { poll } from '@/api/api'
	import coreData from '@/components/CoreData'

	export default {
		components: {
			leftRight,
			coreData
		},
		data () {
			return {
				projectId: this.$route.params.projectId,
				taskId: this.$route.params.taskId
			}
		},
		methods: {

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
			}
		},
		mounted () {
			this.$store.state.progressItems.length = 0;
			this.pollTrainTask(this.projectId, 500);
		}
	}
</script>



