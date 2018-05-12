import Login from '@/pages/Login'
import Main from '@/pages/Main'
import Regist from '@/pages/Regist'
import Model from '@/pages/Model'
import AlgorithmLib from '@/pages/AlgorithmLib'
import DataDeal from '@/pages/DataDeal'
import DataUpload from '@/pages/DataUpload'
import Loading from '@/pages/Loading'
import DataInfo from '@/pages/DataInfo'
import TrainInfo from '@/pages/TrainInfo'
import ProManagement from '@/components/ProManagement'

import NotFound from '@/components/404.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/regist',
        component: Regist,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Main,
        redirect: '/main',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    {
        path: '/main',
        component: Main,
        redirect: '/main/data',
        children: [
            { 
                path: 'data', 
                component: DataDeal,
                redirect: '/main/data/upload',
                name: '数据',
                children: [
                    { path: 'upload', component: DataUpload, name: '数据上传'},
                    { path: 'loading', component: Loading, name: '数据上传中'},
                    { path: 'info/:projectId', component: DataInfo, name: '数据画像'},
                    { path: 'train/:projectId', component: TrainInfo, name: '训练任务'}
                    //{ path: 'train/:projectId/:taskId/:featureListId/:targetId', component: TrainInfo, name: '训练任务'}
                ]
            },
            { path: 'project/:projectId', component: ProManagement, name: '任务管理'},
            //{ path: 'chart', component: Chart, name: '图表'},
            //{ path: '/main/model/:projectId', component: Model, name: '模型' },
            { path: '/main/model/:projectId', component: Model, name: '模型' },
            { path: '/main/algorithm-lib', component: AlgorithmLib, name: '算法库' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;