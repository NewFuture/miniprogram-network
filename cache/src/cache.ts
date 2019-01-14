/** 缓存管理 */
export class Cache<T> {
    private readonly map: Map<string, [T, number]> = new Map();
    public set(key: string, value: T, expire: number) {
        this.map.set(key, [value, expire > 0 ? Date.now() + expire : 0]);
    }
    public get(key: string): T | undefined {
        if (this.map.has(key)) {
            const [value, expire_time] = this.map.get(key)!;
            if (expire_time >= Date.now()) {
                return value;
            } else {
                this.map.delete(key);
            }
        }
        return undefined;
    }
    public delete(key: string): boolean {
        return this.map.delete(key);
    }
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
