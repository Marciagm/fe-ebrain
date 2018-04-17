<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
html,body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;*/
	/*background-size: cover;*/
	// background: #1F2D3D;
	font-family: MicrosoftYaHei,Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
	height: 100%;
}
a {
	text-decoration: none;
}
#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	height: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
.el-upload-dragger {
		width: 1400px;
		height: 686px;
		border: 2px dashed #ccc;
	}
	.data-deal {
		background: #fff;
	}
	.data-con { 
		padding-top: 60px;
		height: 686px;
		text-align: center;
		img {
			margin-top: 38px;
			width: 306px;
			height: 296px;
			margin-bottom: 55px;
		}
		button {
			border: 0;
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
			margin-right: 110px;
		}
		.data-deal-button {
			text-align: center;
		}
	}
</style>