import {ApiConfigOption, ContentType, Driver, DriverConfig, Method, RequestDateType} from "../interface/types";
import * as Qs from "qs";
// const controller = new AbortController();
// const signal = controller.signal;

export default class FetchDriver implements Driver{
    instance: any;
    readonly method: Method = 'get';
    readonly requestType: RequestDateType = 'form';
    private config: DriverConfig = {};
    private readonly data: object = {}

    constructor(uri: string, option: ApiConfigOption, data?: object) {
        this.config.baseURL = uri || "";
        this.method = option.config.hasOwnProperty("method") ? option.config.method : "get";
        this.requestType = option.config.hasOwnProperty("requestType") ? option.config.requestType : "form";
        this.data = data;
        if (option.headers !== undefined && Object.keys(option.headers).length > 0) {
            this.config.headers = {...option.headers}
        } else {
            this.config.headers = {};
        }
        this._dynamicInstance();
    }

    /**
     * 动态创建api实例
     */
    _dynamicInstance(): void {
        if (this.method === 'post') {
            this.config.credentials = 'include';
            this.config.headers["Content-Type"] = ContentType[this.requestType];
            this._generatingTransformRequest();

        }
        // this.instance = this.abortListPromise(this.abort_promise, this.processingRequests);
        this.instance = this._interceptorForResponse();
    }

    /**
     * 生成请求拦截器
     */
    _generatingTransformRequest(): void {
        switch (this.requestType) {
            case 'json':
                this.config.transformRequest = JSON.stringify(this.data);
                break;
            case 'form':
                this.config.transformRequest = Qs.stringify({...this.data});
                break;
            default:
                this.config.transformRequest = this.data;
        }
    }



    async _interceptorForResponse() {
        let promise: Response;
        switch (this.method) {
            case 'get':
                promise = await fetch(this.config.baseURL, {
                    headers: this.config.headers,
                    ...this.config.transformRequest
                });
                break;
            case 'post':
                promise = await fetch(this.config.baseURL, {
                    headers: this.config.headers,
                    body: this.config.transformRequest,
                    method: 'POST'
                });
                break;
            default:
                promise = await fetch(this.config.baseURL, {
                    headers: this.config.headers,
                    ...this.config.transformRequest,
                    method: this.method
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
        if (res.ok) return parsedRes;
        throw parsedRes
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
