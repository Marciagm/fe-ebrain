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
	width: 100%;
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
</style>