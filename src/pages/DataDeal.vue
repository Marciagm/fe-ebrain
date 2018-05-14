<template>
	<div class="data-deal">
		<transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
	</div>	
</template>
<style lang="scss">
	.data-deal {
		background: #fff;
	}
</style>