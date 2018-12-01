/**
 * 合并配置
 * @param customize 自定义配置，未定义的将被默认配置覆盖
 * @param defaults 默认值
 */
export function mergerConfig<T1 extends T2, T2>(customize: T1, defaults: T2): T1 {
    Object.keys(defaults).forEach(key => {
        if (!customize.hasOwnProperty(key)) {
            customize[key] = defaults[key]
        }
    })
    return customize;
}