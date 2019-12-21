import { RequestOption } from '../interface/api.interface';
export declare class Driver {
    instance: any;
    method: string;
    requestType: string;
    headerParams: object;
    private config;
    constructor(uri: string, options: RequestOption, headerConfig?: any);
    /**
     * 生成请求头部
     */
    private generatingHeader;
    /**
     * 头部传参
     */
    private generatingHeaderParams;
    /**
     * 生成请求拦截器
     */
    private generatingTransformRequest;
    /**
     * 响应拦截器
     */
    private interceptorForResponse;
    /**
     * 动态创建api实例
     * @param uri
     */
    private dynamicInstance;
}
