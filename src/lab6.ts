export type DeepReadonly<T> ={
    readonly[p in keyof T]:T[p] extends object ? DeepReadonly<T[p]>:T[p];
};

export type PickedByType<T, U> ={
    [p in keyof T as T[p] extends U ? p : never]:T[p];
};

export type EventHandlers<T> ={
    [p in keyof T as `onEvenent${Capitalize<string & p>}`]:(event: T[p])=>void;
};