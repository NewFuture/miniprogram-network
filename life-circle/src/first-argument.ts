/**
 * 获取函数第一个参数类型 
 */
export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any;