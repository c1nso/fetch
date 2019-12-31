// 请求模式
export type Method = "get" | "post";

// 请求数据格式
export type RequestDateType = "json" | "form" | "formData";

// 请求数据类型
export enum ContentType {
    json = "application/json;charset=UTF-8",
    form = "application/x-www-form-urlencoded; charset=UTF-8",
    formData = "multipart/form-data;charset=UTF-8"
}

// 单个Api配置项
export interface ApiConfig {
    url: string;                    // api地址
    method?: Method;                 // 请求模式
    requestType?: RequestDateType;   // 请求数据类型
    urlParams?: string[];            // url参数列表
}

// Api的配置Map
export interface ApiConfigMap {
    [propName: string]: ApiConfig;
}

// Api配置集合
export interface ApiConfigCollection {
    prefix: string;
    maps: ApiConfigMap;
}

// Api配置选项
export interface ApiConfigOption {
    prefix: string;
    config: ApiConfig;
    headers?: object;
}

// api 响应格式
export interface ApiResponse {
    [propName: string]: any;
}

// Api变压器
export interface ApiTransformer {
    (data: any, headers?: any): any;
}

// 请求配置
export interface DriverConfig {
    baseURL?: string;
    credentials?: string;
    withCredentials?: boolean;
    headers?: any;
    data?: any;
    transformRequest?: any;
    transformResponse?: ApiTransformer | ApiTransformer[]
}


export abstract class Api {
    readonly configs: ApiConfigCollection[];

    protected constructor(configs: ApiConfigCollection[]) {
        this.configs = configs
    }

    abstract request(uri: string, data: object, headers?: object): Promise<ApiResponse>
}

export interface Driver {
    instance: any;
    readonly method: Method
    _generatingTransformRequest(): void

    _interceptorForResponse(): void

    _dynamicInstance(): void
}
