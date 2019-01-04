import JsonP from 'jsonp'
import axios from 'axios'
import {Modal} from 'antd'
import qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default class Axios {
    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }

    static http(options) {
        const baseApi = 'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api';
        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: options.method || 'GET',
                baseURL: baseApi,
                timeout: 500,
                params: options.params || '',
                data: qs.stringify(options.data) || ''
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.code == 0) {
                        resolve(res.data)
                    } else {
                        Modal.info({
                            title: "提示",
                            content: res.data.msg
                        });
                        reject(res.data)
                    }
                }
            }).catch(() => {
                reject(false)
            })
        })
    }

    static ajax(options) {
        let loading;
        if (options.data && options.data.isShowLoading !== false) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = 'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api';
        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: 'get',
                baseURL: baseApi,
                timeout: 5000,
                params: (options.data && options.data.params) || ''
            }).then((response) => {
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status === '200') {
                    let res = response.data;
                    if (res.code === '0') {
                        resolve(res);
                    } else {
                        Modal.info({
                            title: "提示",
                            content: res.msg
                        })
                    }
                } else {
                    reject(response.data);
                }
            })
        });
    }
}
