import Helps from "../helps";

const CookiesStorage = {
    isEnabled(): boolean {
        let cookieEnabled = Boolean(navigator.cookieEnabled);
        if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled){
            document.cookie= 'test';
            cookieEnabled = document.cookie.indexOf("test") !== -1;
        }
        return cookieEnabled;
    },

    /**
     * 设置cookie
     * @param name
     * @param value
     * @param expires
     * @param path
     * @param domain
     * @param secure
     */
    setCookie(name: string, value: any, expires?: number, path: string = '/', domain?: string, secure?: boolean): void {
        let cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));
        if (Helps.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toUTCString());
        }
        if (Helps.isString(path)) cookie.push('path=' + path);
        if (Helps.isString(domain)) cookie.push('domain=' + domain);
        if (secure === true) cookie.push('secure');
        document.cookie = cookie.join('; ');
    },

    /**
     * 获取cookie
     * @param name
     */
    getCookie(name: string): string {
        let match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
    },

    /**
     * 清楚cookie
     * @param name
     */
    removeCookie(name: string): void {
        this.setCookie(name, '', Date.now() - 86400000);
    }
};
export default CookiesStorage;
