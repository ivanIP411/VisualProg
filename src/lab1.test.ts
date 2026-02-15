// tasks.test.ts
import { describe, it, expect } from 'vitest';
import { createUser, createBook, calculateArea, getStatusColor, capitalizeFirst, trimAndTransform, getFirstElement, findById, type HasId } from './lab1';

describe('1) createUser', () => {
    it('Пользователь с обязательными полями', () => {
        const user = createUser(1, 'Иван');
        
        expect(user).toEqual({
            id: 1,
            name: 'Иван',
            isActive: true
        });
        expect(user.email).toBeUndefined();
    });

    it('Пользователь со всеми полями', () => {
        const user = createUser(2, 'Димас', 'dimas@mail.ru');
        
        expect(user).toEqual({
            id: 2,
            name: 'Димас',
            email: 'dimas@mail.ru',
            isActive: true
        });
    });

    it('isActive = false', () => {
        const user = createUser(3, 'Серега', undefined, false);
        
        expect(user).toEqual({
            id: 3,
            name: 'Серега',
            isActive: false
        });
    });
});

describe('2) createBook', () => {
    it('Книга без года', () => {
        const book = createBook({
            title: 'Авоська',
            author: 'Ибрагим',
            genre: 'fiction'
        });
        
        expect(book).toEqual({
            title: 'Авоська',
            author: 'Ибрагим',
            genre: 'fiction'
        });
        expect(book.year).toBeUndefined();
    });

    it('Книга с годом', () => {
        const book = createBook({
            title: 'Пилигримс',
            author: 'Антон',
            year: 2130,
            genre: 'non-fiction'
        });
        
        expect(book).toEqual({
            title: 'Пилигримс',
            author: 'Антон',
            year: 2130,
            genre: 'non-fiction'
        });
    });
});

describe('3) calculateArea', () => {
    it('Площадь круга', () => {
        expect(calculateArea('circle', 5)).toBeCloseTo(78.5398, 4);
        expect(calculateArea('circle', 0)).toBe(0);
    });

    it('Площадь квадрата', () => {
        expect(calculateArea('square', 4)).toBe(16);
        expect(calculateArea('square', 0)).toBe(0);
        expect(calculateArea('square', 2.5)).toBe(6.25);
    });
});

describe('4) getStatusColor', () => {
    it('green для active', () => {
        expect(getStatusColor('active')).toBe('green');
    });

    it('blue для inactive', () => {
        expect(getStatusColor('inactive')).toBe('blue');
    });

    it('orange для new', () => {
        expect(getStatusColor('new')).toBe('orange');
    });
});

describe('5) StringFormatter', () => {
    describe('capitalizeFirst', () => {
        it('Должен делать первую букву заглавной', () => {
            expect(capitalizeFirst('hello')).toBe('Hello');
        });

        it('Должен обрабатывать пустую строку', () => {
            expect(capitalizeFirst('')).toBe('');
        });
    });

    describe('trimAndTransform', () => {
        it('Должен обрезать пробелы', () => {
            expect(trimAndTransform('  hello  ')).toBe('hello');
        });

        it('Должен приводить к верхнему регистру при uppercase = true', () => {
            expect(trimAndTransform('  hello  ', true)).toBe('HELLO');
        });

        it('Не должен приводить к верхнему регистру при uppercase = false или undefined', () => {
            expect(trimAndTransform('  Hello  ', false)).toBe('Hello');
            expect(trimAndTransform('  Hello  ')).toBe('Hello');
        });
    });
});

describe('6) getFirstElement', () => {
    it('Должен возвращать первый элемент массива чисел', () => {
        expect(getFirstElement([1, 2, 3])).toBe(1);
    });

    it('Должен возвращать первый элемент массива строк', () => {
        expect(getFirstElement(['a', 'b', 'c'])).toBe('a');
    });

    it('Должен возвращать undefined для пустого массива', () => {
        expect(getFirstElement([])).toBeUndefined();
    });
});

describe('7) findById', () => {
    interface TestItem extends HasId {
        name: string;
    }

    const items: TestItem[] = [
        { id: 1, name: 'Item1' },
        { id: 2, name: 'Item2' },
        { id: 3, name: 'Item3' }
    ];

    it('Должен находить объект по id', () => {
        expect(findById(items, 2)).toEqual({ id: 2, name: 'Item2' });
        expect(findById(items, 1)).toEqual({ id: 1, name: 'Item1' });
    });

    it('Должен возвращать undefined для несуществующего id', () => {
        expect(findById(items, 5)).toBeUndefined();
    });

    it('Должен обрабатывать пустой массив', () => {
        expect(findById([], 1)).toBeUndefined();
    });
});