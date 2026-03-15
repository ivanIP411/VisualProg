import { describe, it, expect } from 'vitest';
import { where, sort, groupby, having, query } from './lab4';

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