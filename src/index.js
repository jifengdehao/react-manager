import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router'
import {Provider} from 'react-redux'
import configureStore from './redux/store/configureStore';
import registerServiceWorker from './registerServiceWorker';

// 国际化 - 中文
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

// Redux Store对象，管理所有的Redux状态
const store = configureStore();
ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <Provider store={store}>
            <Router/>
        </Provider>
    </LocaleProvider>,
    document.getElementById('root')
);
registerServiceWorker();
