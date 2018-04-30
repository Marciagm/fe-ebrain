<template>
	<div id="tablePart">
		<div id="eigenPart" :class="[isEigenActive ? active : notActive]">
			<div class="eigen-label" @click="tab('detail')">
				<img src="../images/All-features.png">
				<span>特征详情</span>
			</div>
			<el-autocomplete
		      v-model="state1"
		      :fetch-suggestions="querySearch"
		      placeholder="搜索"
		      @select="search"
		      style="height: 15px; border: 0; text-align: center; font-size: 12px;"
		    ></el-autocomplete>	
			<el-dropdown style="cursor: pointer;" @command="getList">
				<span class="el-dropdown-link">
				    <span>全部特征</span>
				    <span style="color: #666; font-size: 10px;">(特征列表)</span>
				    <i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
				    <el-dropdown-item v-for="(item, index) in featureList" :divided="index==1" :command="item">
				    	{{ item.name }}
				    </el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<div class="eigen-list" v-if="isListNameShow"> 
				<input placeholder="新建特征列表" class="eigen-list-input" v-model="listName" />
				<button class="eigen-list-button" @click="setList">确定</button>
			</div>
		</div>

		<div id="originalPart" :class="[isEigenActive ? originalNotActive : originalActive]" :style="{width: originalPartwidth + 'px'}" @click="tab('original')">
			<div class="original-label" >
				<img src="../images/Original-data.png" style="margin-right: 5px;" >
				原始数据
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	
</style>
<script>
	export default {
		data () {
			return {
				isEigenActive: false
			}
		},
		methods: {

		}
	}
</script>