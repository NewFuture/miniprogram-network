/**
 * 键值对
 */
export interface KeyBasicValuePair {
    [key: string]: string | number | boolean;
};

/**
 * 构建url参数
 * /users/{id} ==> /users/123
 * @param url url
 * @param params 替换的参数列表
 */
export function buildParams(url: string, params?: KeyBasicValuePair): string {
    if (params) {
        for (let key in params) {
            url = url.replace(new RegExp('{' + key + '}', 'g'), params[key] as string);
        }
    }
    return url;
}
