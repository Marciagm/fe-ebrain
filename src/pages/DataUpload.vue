<template>
	<div>
		<top-part v-on:uploadInit="init"></top-part>
		<div id="uploadPart" v-show="inUpload">
			<div class="data-upload">
				<el-upload
				  ref="upload"
				  class="data-con"
				  drag
				  :data="formData"
				  :show-file-list=false
				  :headers="apiHeader"
				  :before-upload="beforeUpload"
				  :on-progress="onUploadProgress"
				  :on-success="handleUploadSuccess"
				  :on-error="handleUploadError"
				  :action="uploadApi"
				>
				  <img src="../images/Upload-data1.png">
				  <el-row>
						<el-col :span="20" :offset="2">
							<div>
								<button>本地数据</button>
								<!-- <button @click.stop="goHDFS">HDFS</button>
								<button @click.stop="goODBC" style="margin-right: 0;">ODBC</button> -->
							</div>
						</el-col>
					</el-row>
					<div class="data-upload-tips">
						可直接拖拽文件至主界面,支持逗号分隔的文本文件，建议UTF-8格式编码
					</div>
				</el-upload>
			</div>
		</div>

		<div v-show="!inUpload">
			<left-right>
				<div slot="left" class="uploading-left">
					<img class="uploadig-img" src="../images/Upload-data2.png">
				</div>
			</left-right>
		</div>
	</div>
</template>
<style lang="scss">
	.data-upload {
		min-width: 880px;
		width: 100%;
		text-align: center;
		.data-con {
			margin-left: 10%;
			width: 80%;
			padding-top: 60px;
			height: 586px;
			text-align: center;
			img {
				margin-top: 38px;
				width: 306px;
				height: 296px;
				margin-bottom: 55px;
			}
			button {
				cursor: pointer;
				outline: none;
				width: 116px;
				height: 47px;
				background-image: linear-gradient(90deg, 
					#0d65be 0%, 
					#1978d9 45%, 
					#248bf4 100%), 
				linear-gradient(
					#cccccc, 
					#cccccc);
				border-radius: 4px;
				color: #ffffff;
				font-size: 16px;
				/* margin-right: 109px; */
				&:hover {
					opacity: 0.7;
				}
				&:active {
					opacity: 1;
				}
			}
			.el-upload {
				width: 80%;
			}
			.el-upload-dragger {
				width: 100%; 
				height: 586px;
				border: 2px dashed #ccc;
			}
			.data-upload-tips {
				margin-top: 50px;
				font-size: 16px;
				letter-spacing: 1px;
				color: #cccccc;
			}
		}
	}
	.uploading-left {
		height: 100%;
		position: relative;
		background: #fff;
		flex: 4;
		margin-right: 20px;
		border-radius: 0px 8px 0px 0px;
		text-align: center;
		.uploadig-img {
			margin-top: 206px;
		}
	}
</style>
<script>
	import topPart from '@/components/Top.vue'
	import leftRight from '@/components/LeftRight.vue'

    import { createProject, uploadFile } from '../api/api';

    function initUploadProgress (progress) {
		progress.percent = '0%';
		progress.status = 1;
		return progress;
	}
	export default {
		components: {
			topPart,
			leftRight
		},
		data () {
			var token = localStorage.getItem('token');
			return {
				inUpload: true,
				projectId: '',
				apiHeader: {
					Authorization: 'Bearer ' +  token
				},
				uploadApi: uploadFile,
				formData: {
					type: 1
				}
			}
		},
		methods: {
			goHDFS () {
				alert('goHDFS');
			},
			goODBC () {
				alert('goODBC');
			},
			startLoading () {
				this.$store.commit('SET_CUR_STATUS', 1);
				const uploadProgress = this.$store.state.uploadProgress;
			
				uploadProgress.status = 1;
				uploadProgress.percent = '0%';
				const portraitProgress = this.$store.state.portraitProgress;
				// 
				portraitProgress.status = 0;

				// 上传数据进度开始
				this.$store.state.progressItems.length = 0;
				this.$store.state.progressItems.push(uploadProgress, portraitProgress);
				console.log('in mounted');	
			},
			beforeUpload (file) {
				this.$refs.upload.abort();
				this.$store.commit('SET_FILE_NAME', file.name);
				this.inUpload = false;
				this.startLoading();
				//this.$router.push('/main/data/loading');
			},
			onUploadProgress (event, file, fileList) {
				this.$store.state.uploadProgress.percent = Math.floor((event.percent - 0.1) / 1.1) + '%';
			},
			handleUploadSuccess (response, file, fileList) {
				this.$store.state.uploadProgress.percent = Math.floor(Math.random() * 10 + 90) + '%';
				if (response.error) {
					this.$message.error(response.error);
					return;
				}
				let { task } = response;
				const projectId = task.project_id;
				this.$store.commit('SET_PROJECT_ID', projectId);
				if (this.isFileAbort) {
					return;
				}
				else {
					this.$router.push(`/main/data/info/${projectId}`);
				}
			},
			// @TODO 考虑失败的情况
			handleUploadError (err, file, fileList) {
				console.log('fail');
				this.$store.state.uploadProgress.percent = '0%';
				this.$store.state.uploadProgress.status = -1;
				this.$store.state.uploadProgress.failReason = '上传失败';
				this.$store.commit('SET_PROGRESS_OK', false);
			},
			init () {
				this.$refs.upload.abort();
				this.inUpload = true; 
				this.$store.commit('SET_PROJECT_STATUS', false);
				this.$store.commit('SET_PROJECT_NAME', '未命名任务');
				this.$store.commit('initTrainObj');
				this.$store.commit('SET_TARGET_TIPS', false);
				this.$store.commit('SET_EIGEN_DATA', []);
				this.$store.commit('initTimer');
				this.$store.commit('initProgress');
				this.$store.commit('initStatus');
			}
		},
		mounted () {
			// init
			this.init();
			/*if (this.$store.state.projectId) {
				this.$router.push('/main/data/info/' + this.$store.state.projectId);
			}*/
		},
		deactivated () {
			console.log('deactivated');
		},
		computed: {
			isFileAbort () {
				return this.$store.state.isFileAbort;
			}
		}
	}
</script>










