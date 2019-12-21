import axios from 'axios'
import * as Qs from 'qs'
import {RequestOption, RequestConfig, ContentType} from '../interface/api.interface'
import {Promise} from 'es6-promise'

export class Driver {
    public instance;
    public method: string = 'get';
    public requestType: string = 'form';
    public headerParams: object = {};
    private config: RequestConfig = {};

    constructor(uri: string, options: RequestOption, headerConfig?: any) {
        this.method = options.hasOwnProperty('method') ? options.method : 'get';
        this.requestType = options.hasOwnProperty('requestType') ? options.requestType : 'form';
        if (headerConfig && Reflect.has(headerConfig, 'headers')) this.headerParams = headerConfig.headers;
        this.dynamicInstance(uri);
    }

    /**
     * 生成请求头部
     */
    private generatingHeader(): void {
        this.config.headers["Content-Type"] = ContentType[this.requestType];
    }

    /**
     * 头部传参
     */
    private generatingHeaderParams(): void {
        this.config.headers = {
            ...this.config.headers,
            ...this.headerParams
        }
    }

    /**
     * 生成请求拦截器
     */
    private generatingTransformRequest(): void {
        this.config.transformRequest = [
            data => {
                switch (this.requestType) {
                    case 'json':
                        return JSON.stringify(data);
                    case 'form':
                        return Qs.stringify({...data});
                    default:
                        return data;
                }
            }
        ]
    }

    /**
     * 响应拦截器
     */
    private interceptorForResponse(): void {
        this.instance.interceptors.response.use(
            success => success,
            error => {
                let timeoutMessage = `请求错误，请稍后重试.`;
                if (error.status) timeoutMessage = `${timeoutMessage} 错误码：${error.status}`;
                return Promise.reject(timeoutMessage);
            }
        )
    }

    /**
     * 动态创建api实例
     * @param uri
     */
    private dynamicInstance(uri: string): void {
        this.config.baseURL = uri || '';
        if (this.method === 'post') {
            this.config.withCredentials = true;
            this.generatingHeader();
            this.generatingTransformRequest();
        }
        if (Object.keys(this.headerParams).length) this.generatingHeaderParams();
        this.instance = axios.create(this.config);
        this.interceptorForResponse();
    }
}
