export type Transform<T> = (arr: T[]) => T[];
export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;
export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;
export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};
export type GroupBy<T> = <K extends keyof T>(key: K) => (arr: T[]) => Group<T, K>[];
export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];
export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;


export function where<T>(): Where<T> {
    return (key, value) => (arr) => arr.filter(item => item[key] === value);
}

export function sort<T>(): Sort<T> {
    return (key) => (arr) => [...arr].sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });
}

export function groupby<T>(): GroupBy<T> {
    return (key) => (arr) => {
        const groups: Record<string, Group<T, typeof key>> = {};
        for(let i = 0; i<arr.length; i++){
            const item = arr[i];
            const gKey = String(item[key]);
            if (!groups[gKey]) {
                groups[gKey] = {key: item[key], items: []};
            }
            groups[gKey].items.push(item);
        }
        return Object.values(groups);
    };
}

export function having<T>(): Having<T> {
    return (predicate) => (groups) => groups.filter(predicate);
}


type Op<T> = {
    run: (arr: any) => any;
    tag: 'where' | 'groupby' | 'having' | 'sort'
};

export function w<T>() {
    const fn = where<T>();
    return (key: any, val: any): Op<T> => ({run: fn(key, val), tag: 'where'});
}

export function g<T>() {
    const fn = groupby<T>();
    return (key: any): Op<T> => ({ run: fn(key), tag: 'groupby' });
}

export function h<T>() {
    const fn = having<T>();
    return (pred: any): Op<T> => ({ run: fn(pred), tag: 'having' });
}

export function s<T>() {
    const fn = sort<T>();
    return (key: any): Op<T> => ({ run: fn(key), tag: 'sort' });
}

type Check<O extends Op<any>[]> = 
    O extends [] ? true :
    O extends [infer A] ? true :
    O extends [infer A, infer B, ...infer R] ?
        A extends Op<any> ? B extends Op<any> ? R extends Op<any>[] ?
            [A['tag'], B['tag']] extends ['where', 'having'] ? false :
            [A['tag'], B['tag']] extends ['where', 'sort'] ? false :
            [A['tag'], B['tag']] extends ['groupby', 'where'] ? false :
            [A['tag'], B['tag']] extends ['groupby', 'sort'] ? false :
            [A['tag'], B['tag']] extends ['having', 'where'] ? false :
            [A['tag'], B['tag']] extends ['having', 'groupby'] ? false :
            [A['tag'], B['tag']] extends ['sort', 'where'] ? false :
            [A['tag'], B['tag']] extends ['sort', 'groupby'] ? false :
            [A['tag'], B['tag']] extends ['sort', 'having'] ? false :
            Check<[B, ...R]>
        : false : false : false
    : true;

export function query<T, K extends keyof T = any>(...steps: Array<Transform<T> | ((arr: T[]) => Group<T, K>[]) | GroupTransform<T, K>>): Transform<T> {
    return (arr) => {
        let result: any = arr;
        for(let i = 0; i<steps.length; i++){
            result = steps[i](result);
        }
        return result;
    };
}

export function queryT<T, O extends Op<any>[]>(...ops: O & (Check<O> extends true ? O : never)) {
    return (arr: T[]) => {
        let res: any = arr;
        for (let op of ops) res = op.run(res);
        return res;
    };
}
