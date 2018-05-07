import Login from '@/pages/Login'
import Main from '@/pages/Main'
import Regist from '@/pages/Regist'
import DataDeal from '@/components/DataDeal'
import DataUpload from '@/components/DataUpload'
import Loading from '@/components/Loading'
import DataInfo from '@/components/DataInfo'
import TrainInfo from '@/components/TrainInfo'
import ProManagement from '@/components/ProManagement'
import Model from '@/components/Model'

import Chart from '@/components/Chart'
import UploadView from '@/components/UploadView'
import ResultView from '@/components/ResultView'
import ModelJobListView from '@/components/ModelJobListView'
import ModelList from '@/components/ModelList'
import Help from '@/components/Help'
import FileSelectView from '@/components/FileSelectView'
import DataCheckView from '@/components/DataCheckView'
import TrainingView from '@/components/TrainingView'
import DataView from '@/components/DataView'
import PredictView from '@/components/PredictView'
import ModelDetail from '@/components/ModelDetail'
import Result from '@/components/Result'
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
                    { path: 'train/:projectId/:taskId/:featureListId/:targetId', component: TrainInfo, name: '训练任务'}
                ]
            },
            { path: 'project', component: ProManagement, name: '任务管理'},
            { path: 'chart', component: Chart, name: '图表'},
            { path: '/main/model/:projectId', component: Model, name: '模型' },
            { path: '/main/algorithm-lib', component: ModelList, name: '算法库' },
            
            { path: '/main/modelList', component: ModelList, name: '模型列表' },
            { path: '/main/modelJobListView/:projectId', component: ModelJobListView, name: 'job列表' },
            { path: '/main/result/:projectId', component: Result, name: '结果表' },
            { path: '/main/fileSelectView/:projectId', component: FileSelectView, name: '选择文件' },
            { path: '/main/dataCheckView/:projectId/:jobId/:sequence', component: DataCheckView, name: '数据检测页' },
            { path: '/main/trainingView/:projectId/:jobId/:sequence', component: TrainingView, name: '训练页' },
            { path: '/main/modelDetail/:projectId/:jobId/:sequence/:state', component: ModelDetail, name: '模型详情' },
            { path: '/main/resultView/:projectId/:jobId/:sequence/:fileId', component: ResultView, name: '模型结果' },
            { path: '/main/uploadView/:projectId/:jobId/:sequence/:name/:progress', component: UploadView, name: '文件上传' },
            { path: '/main/predictView/:projectId/:jobId/:sequence/:algorithm', component: PredictView, name: '文件上传' },
            { path: '/main/help', component: Help, name: '帮助' },
            { path: '/main/dataView', component: DataView, name: '帮助' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;