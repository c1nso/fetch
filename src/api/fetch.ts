import * as Qs from 'qs'
import {ContentType, RequestConfig, RequestOption, HttpMethod} from '../interface/fetch.interface'
import {ConfigParams} from "../interface/api.interface";
// const controller = new AbortController();
// const signal = controller.signal;

export class FetchApi {
    public instance;
    public method: string = 'get';
    public requestType: string = 'form';
    public headerParams: object = {};
    private config: RequestConfig = {};
    private readonly _timeout: number = 60000;

    constructor(uri: string, options: RequestOption, data: object, headers:ConfigParams) {
        this.method = options.hasOwnProperty('method') ? options.method : 'get';
        this.requestType = options.hasOwnProperty('requestType') ? options.requestType : 'form';
        if (headers && Reflect.has(headers, 'headers')) this.headerParams = headers.headers;
        this.dynamicInstance(uri, options, data);
    }
    /**
     * 一个可以被reject的promise
     */
    private abort_promise(): any {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Response("timeout", { status: 504, statusText: 'request timeout' }));
            }, this._timeout);
        })
    }

    /**
     * 看谁先超时
     */
    private abortListPromise(timeoutPromise, requestPromise): any {
        const fun1 = timeoutPromise.bind(this);
        const fun2 = requestPromise.bind(this);
        return new Promise((resolve, reject) => {
            Promise.race([
                fun1(),
                fun2()
            ]).then(success => {
                resolve(success);
            }).catch(error => {
                reject(error);
            });
        })
    }


    /**
     * 生成请求头部
     */
    private generatingHeader(): void {
        this.config.headers["Content-Type"] = ContentType[this.requestType];
    }

    /**
     * 生成请求拦截器
     */
    private generatingTransformRequest(data): void {
        switch (this.requestType) {
            case 'json':
                this.config.transformRequest = JSON.stringify(data);
                break;
            case 'form':
                this.config.transformRequest = Qs.stringify({...data});
                break;
            default:
                this.config.transformRequest = data;
        }
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
     * 动态创建api实例
     * @param uri
     * @param options
     * @param data
     */
    private dynamicInstance(uri: string, options: RequestOption, data: object): void {
        this.config.baseURL = uri || '';
        if (this.method === 'post') {
            this.config.credentials = 'include';
            this.generatingHeader();

        }
        if (Object.keys(this.headerParams).length) this.generatingHeaderParams();
        this.generatingTransformRequest(data);
        // this.instance = this.abortListPromise(this.abort_promise, this.processingRequests);
        this.instance = this.processingRequests(uri, options);
    }

    private async processingRequests(url: string, options) {
        let promise: Response;
        switch (options.method) {
            case 'get':
                promise = await fetch(url, {
                    headers: this.config.headers,
                    ...this.config.transformRequest
                });
                break;
            case 'post':
                promise = await fetch(url, {
                    headers: this.config.headers,
                    body: this.config.transformRequest,
                    method: HttpMethod.post
                });
                break;
            default:
                promise = await fetch(url, {
                    headers: this.config.headers,
                    ...this.config.transformRequest,
                    method: options.method
                })
        }
        return this.handleResponse(promise)
    }
    /**
     * 拦截响应
     * @param res
     */
    private async handleResponse(res: any) {
        const parsedRes = await this.parseResponse(res);
        if (res.ok) {
            return parsedRes;
        } else {
            const error = parsedRes;
            throw error
        }
    }

    private async parseResponse(res: any) {
        const contentType = res.headers.get('Content-Type');
        // 判定返回的内容类型，做不同的处理
        if (contentType) {
            if (contentType.includes('json')) {
                return await res.json()
            }
            if (contentType.includes('text')) {
                return await res.text()
            }
            if (contentType.includes('form')) {
                return await res.formData()
            }
            if (contentType.includes('video')) {
                return await res.blob()
            }
        }
        return await res.text()
    }
}
