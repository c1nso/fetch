import { RemoteApiInstance } from '../interface/api.interface';
declare class SingularityApi {
    private token;
    private url;
    private params;
    private urlParams;
    private readonly isSupportFetch;
    constructor();
    private init;
    /**
     * 加载api配置
     * @param uri
     */
    private loadingApiConfig;
    /**
     * 生成请求地址
     */
    private generatingUrl;
    /**
     * 生成请求头
     */
    private generateHeader;
    /**
     * 请求实例
     * @param uri
     * @param params
     * @param config
     */
    private requestInstance;
    /**
     * 创建一个请求实例
     */
    request: RemoteApiInstance;
}
declare const _default: SingularityApi;
export default _default;
