//TS 类型推断
import { Request } from '../index';

interface Item {
    id: number,
    name: string
}

// 泛型 then的参数值类型为 Item[]
Request.get<Item[]>('/items')
    .then(list => list.forEach(i => console.log(i.id + i.name)))

