import { Promise } from "es6-promise";
export declare type Method = 'get' | 'post';
export declare type RequestType = 'json' | 'form' | 'formData';
export declare enum ContentType {
    json = "application/json;charset=UTF-8",
    form = "application/x-www-form-urlencoded; charset=UTF-8",
    formData = "multipart/form-data;charset=UTF-8"
}
export interface ApiTransformer {
    (data: any, headers?: any): any;
}
export interface RequestOption {
    url: string;
    method?: Method;
    requestType?: RequestType;
    urlParams?: string[];
}
export interface RequestConfig {
    baseURL?: string;
    withCredentials?: boolean;
    headers?: any;
    transformRequest?: ApiTransformer | ApiTransformer[];
    transformResponse?: ApiTransformer | ApiTransformer[];
}
export interface RequestApiConfig {
    uri: string;
    content: RequestOption;
}
export interface ApiResponse<T = any> {
    Code?: string;
    Data?: T;
    IsDemo?: number;
    IsLogin?: number;
    Msg?: string;
    Time?: number;
}
export interface RemoteApiInstance {
    <T = any>(uri: string, params: object, option?: any): Promise<ApiResponse<T>>;
}
export interface ConfigParams {
    headers: HeadersOption;
}
export interface HeadersOption {
    [propName: string]: any;
}
