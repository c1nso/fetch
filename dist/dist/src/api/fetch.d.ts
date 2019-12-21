import { RequestOption } from '../interface/fetch.interface';
import { ConfigParams } from "../interface/api.interface";
export declare class FetchApi {
    instance: any;
    method: string;
    requestType: string;
    headerParams: object;
    private config;
    private readonly _timeout;
    constructor(uri: string, options: RequestOption, data: object, headers: ConfigParams);
    /**
     * 一个可以被reject的promise
     */
    private abort_promise;
    /**
     * 看谁先超时
     */
    private abortListPromise;
    /**
     * 生成请求头部
     */
    private generatingHeader;
    /**
     * 生成请求拦截器
     */
    private generatingTransformRequest;
    /**
     * 头部传参
     */
    private generatingHeaderParams;
    /**
     * 动态创建api实例
     * @param uri
     * @param options
     * @param data
     */
    private dynamicInstance;
    private processingRequests;
    /**
     * 拦截响应
     * @param res
     */
    private handleResponse;
    private parseResponse;
}
