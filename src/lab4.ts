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

export function query<T, K extends keyof T = any>(...steps: Array<Transform<T> | ((arr: T[]) => Group<T, K>[]) | GroupTransform<T, K>>): Transform<T> {
    return (arr) => {
        let result: any = arr;
        for(let i = 0; i<steps.length; i++){
            result = steps[i](result);
        }
        return result;
    };
}