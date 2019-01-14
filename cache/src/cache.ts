/** 缓存管理 */
export class Cache<T> {
    private readonly map: Map<string, [T, number]> = new Map();
    /**
     * 设置缓存
     * @param key - 键
     * @param value - 值
     * @param expire - 有效期(毫秒)
     */
    // tslint:disable-next-line: no-reserved-keywords
    public set(key: string, value: T, expire: number) {
        this.map.set(key, [value, expire > 0 ? Date.now() + expire : 0]);
    }
    /**
     * 获取缓存，不存在返回undefined
     * @param key - 键
     */
    // tslint:disable-next-line: no-reserved-keywords
    public get(key: string): T | undefined {
        if (this.map.has(key)) {
            const [value, expireTime] = this.map.get(key)!;
            if (expireTime >= Date.now()) {
                return value;
            } else {
                this.map.delete(key);
            }
        }
        return undefined;
    }
    /**
     * 删除缓存，返回是否删除成功
     * @param key - 键
     */
    // tslint:disable-next-line: no-reserved-keywords
    public delete(key: string): boolean {
        return this.map.delete(key);
    }
    /**
     * 缓存是否存在
     * @param key - 键
     */
    public has(key: string): boolean {
        if (this.map.has(key)) {
            if (this.map.get(key)![1] > Date.now()) {
                return true;
            }
            this.map.delete(key);
        }
        return false;
    }
}
