import { describe, it, expect, expectTypeOf } from 'vitest';
import { where, sort, groupby, having, query, w, g, h, s, queryT } from './lab5';

type User = {
    id: number; 
    name: string; 
    surname: string; 
    age: number; 
    city: string;
};

const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

describe('query', () => {
    it('Фильтрация и сортировка', () => {
        const result = query<User, keyof User>(
            where<User>()('name', 'John'),
            where<User>()('surname', 'Doe'),
            sort<User>()('age')
        )(users);
        
        expect(result).toEqual([
            { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
            { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
            { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" }
        ]);
    });

    it('Группировка', () => {
        const result = query<User>(
            groupby<User>()('city')
        )(users);
        
        expect(result).toEqual([
            { key: "NY", items: [users[0], users[1]] },
            { key: "LA", items: [users[2], users[3]] }
        ]);
    });

    it('Фильтрация групп', () => {
        const result = query<User>(
            groupby<User>()('city'),
            having<User>()((group) => group.items.length > 1)
        )(users);
        
        expect(result).toEqual([
            { key: "NY", items: [users[0], users[1]] },
            { key: "LA", items: [users[2], users[3]] }
        ]);
    });

    it('Комбинированный конвейер', () => {
        const result = query<User>(
            where<User>()('surname', 'Doe'),
            groupby<User>()('city'),
            having<User>()((group) => group.items.some((u) => u.age > 34))
        )(users);
        
        expect(result).toEqual([
            { key: "LA", items: [users[2], users[3]] }
        ]);
    });
});

describe('lab5', () => {
    it('where -> where -> groupBy -> having -> sort', () => {
        const q = queryT(
            w<User>()('name', 'John'),
            w<User>()('surname', 'Doe'),
            g<User>()('city'),
            h<User>()(gr => gr.items.length > 1),
            s<User>()('age')
        );
        expectTypeOf(q).toBeFunction();
        q(users);
    });

    it('несколько where', () => {
        const q = queryT(
            w<User>()('name', 'John'),
            w<User>()('age', 25)
        );
        expectTypeOf(q).toBeFunction();
    });

    it('несколько sort', () => {
        const q = queryT(
            s<User>()('age'),
            s<User>()('name')
        );
        expectTypeOf(q).toBeFunction();
    });

    it('groupby -> having', () => {
        const q = queryT(
            g<User>()('city'),
            h<User>()(gr => gr.items.length > 0)
        );
        expectTypeOf(q).toBeFunction();
    });

    it('пустой запрос', () => {
        const q = queryT();
        expectTypeOf(q).toBeFunction();
    });

    it('groupBy перед where', () => {
        queryT(
            g<User>()('city'),
            w<User>()('name', 'John')
        );
    });

    it('having перед groupBy', () => {
        queryT(
            h<User>()(gr => true),
            g<User>()('city')
        );
    });

    it('sort перед having', () => {
        queryT(
            s<User>()('age'),
            h<User>()(gr => true)
        );
    });

    it('sort перед groupBy', () => {
        queryT(
            s<User>()('age'),
            g<User>()('city')
        );
    });

    it('sort перед where', () => {
        queryT(
            s<User>()('age'),
            w<User>()('name', 'John')
        );
    });

    it('having перед where', () => {
        queryT(
            h<User>()(gr => true),
            w<User>()('name', 'John')
        );
    });
});