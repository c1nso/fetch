import { ApiConfigOption, Driver, Method, RequestDateType } from "../interface/types";
export default class FetchDriver implements Driver {
    instance: any;
    readonly method: Method;
    readonly requestType: RequestDateType;
    private config;
    private readonly data;
    constructor(uri: string, option: ApiConfigOption, data?: object);
    /**
     * 动态创建api实例
     */
    _dynamicInstance(): void;
    /**
     * 生成请求拦截器
     */
    _generatingTransformRequest(): void;
    _interceptorForResponse(): Promise<any>;
    /**
     * 拦截响应
     * @param res
     */
    private handleResponse;
    private parseResponse;
}
