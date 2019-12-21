import * as Qs from 'qs'
import {Driver} from './driver'
import {FetchApi} from './fetch'
import Deploy from '../config/deploy.config'
import ApiConfig from '../config/api.config'
import {RequestApiConfig, ApiResponse, RemoteApiInstance, ConfigParams} from '../interface/api.interface'
import {Promise} from 'es6-promise'
import {cloneDeep} from 'lodash'


class SingularityApi {
    private token: string;
    private url: string;
    private params: object = {};
    private urlParams: object = {};
    private readonly isSupportFetch: boolean;

    constructor(){
        this.isSupportFetch = !!window.fetch;
    }

    private init(): void {
        this.token = '';
        this.url = '';
        this.params = {};
        this.urlParams = {};
    }

    /**
     * 加载api配置
     * @param uri
     */
    private loadingApiConfig(uri: string): RequestApiConfig {
        let config: RequestApiConfig;
        for (let i in ApiConfig) {
            let key = Object.keys(ApiConfig[i]).filter(i => i === uri).shift();
            if (typeof key === 'string') {
                config = {uri: i, content: ApiConfig[i][key]}
            }
        }
        return config;
    }

    /**
     * 生成请求地址
     */
    private generatingUrl(): void {
        for (let i in this.params) {
            if (i !== 'params' && this.params.hasOwnProperty(i)) {
                this.urlParams[i] = this.params[i];
                delete this.params[i];
            }
        }
        if (Object.keys(this.urlParams).length > 0) {
            this.url += `?${Qs.stringify(this.urlParams)}`;
        }
    }

    /**
     * 生成请求头
     */
    private generateHeader(config): ConfigParams {
        let headParams:ConfigParams = {
            headers: {}
        };
        if (config) {
            headParams["headers"] = {...config["headers"]};
        }
        return headParams;
    }

    /**
     * 请求实例
     * @param uri
     * @param params
     * @param config
     */
    private requestInstance<T = any>(uri: string, params: object = {}, config?: any): Promise<ApiResponse<T>> {
        const apiConfig = this.loadingApiConfig(uri);
        this.init();
        this.params = cloneDeep(params);
        this.url = apiConfig.content.url;
        this.generatingUrl();
        const headParams = this.generateHeader(config);
        const api =  this.isSupportFetch
            ? new FetchApi(`${Deploy[apiConfig.uri]}${this.url}`, apiConfig.content, this.params, headParams)
            : new Driver(Deploy[apiConfig.uri], apiConfig.content, headParams);
        return new Promise((resolve, reject) => {
            if (this.isSupportFetch) {
                api.instance.then(
                success => {
                    if (success['Code'] !== '1101') return reject(success);
                    return resolve(success);
                },
                error => reject(typeof error['Code'] === 'undefined' ? '网络异常! 请稍后重试' : error)
                );
            } else {
                api.instance[api.method](
                    this.url,
                    this.params.hasOwnProperty('params') ? this.params['params'] : {}
                ).then(
                    success => {
                        if (success.status !== 200) return reject(success.data);
                        return resolve(success.data);
                    },
                    error => reject(typeof error['Code'] === 'undefined' ? '网络异常! 请稍后重试' : error)
                );
            }
        })
    }

    /**
     * 创建一个请求实例
     */
    public request: RemoteApiInstance = this.requestInstance;
}
export default new SingularityApi();
