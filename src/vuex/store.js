import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    projectId:'',
    projectName: '未命名项目',
    projectStatus: false
}

// 定义所需的 mutations
const mutations = {
    SET_PROJECT_ID (state,projectId){
        state.projectId = projectId;
    },
    setProjectName (state, projectName) {
    	state.projectName = projectName;
    },
    setProjectStatus (state, projectStatus) {
    	state.projectStatus = projectStatus;
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})