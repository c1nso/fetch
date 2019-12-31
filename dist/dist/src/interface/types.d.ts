export declare type Method = "get" | "post";
export declare type RequestDateType = "json" | "form" | "formData";
export declare enum ContentType {
    json = "application/json;charset=UTF-8",
    form = "application/x-www-form-urlencoded; charset=UTF-8",
    formData = "multipart/form-data;charset=UTF-8"
}
export interface ApiConfig {
    url: string;
    method?: Method;
    requestType?: RequestDateType;
    urlParams?: string[];
}
export interface ApiConfigMap {
    [propName: string]: ApiConfig;
}
export interface ApiConfigCollection {
    prefix: string;
    maps: ApiConfigMap;
}
export interface ApiConfigOption {
    prefix: string;
    config: ApiConfig;
    headers?: object;
}
export interface ApiResponse {
    [propName: string]: any;
}
export interface ApiTransformer {
    (data: any, headers?: any): any;
}
export interface DriverConfig {
    baseURL?: string;
    credentials?: string;
    withCredentials?: boolean;
    headers?: any;
    data?: any;
    transformRequest?: any;
    transformResponse?: ApiTransformer | ApiTransformer[];
}
export declare abstract class Api {
    readonly configs: ApiConfigCollection[];
    protected constructor(configs: ApiConfigCollection[]);
    abstract request(uri: string, data: object, headers?: object): Promise<ApiResponse>;
}
export interface Driver {
    instance: any;
    readonly method: Method;
    _generatingTransformRequest(): void;
    _interceptorForResponse(): void;
    _dynamicInstance(): void;
}
