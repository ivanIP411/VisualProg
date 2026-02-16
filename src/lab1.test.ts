import { describe, it, expect } from 'vitest';
import { createUser, createBook, calculateArea, getStatusColor, firstUp, trim, getFirstElement, findById, type HasId } from './lab1';

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
    describe('firstUp', () => {
        it('Первая буква заглавная', () => {
            expect(firstUp('hello')).toBe('Hello');
        });

        it('Обработка пустой строки', () => {
            expect(firstUp('')).toBe('');
        });
    });

    describe('trim', () => {
        it('Обрезает пробелы', () => {
            expect(trim('  hello  ')).toBe('hello');
        });

        it('Верхний регистр при uppercase = true', () => {
            expect(trim('  hello  ', true)).toBe('HELLO');
        });

        it('Не делает верхний регистр при uppercase = false или undefined', () => {
            expect(trim('  Hello  ', false)).toBe('Hello');
            expect(trim('  Hello  ')).toBe('Hello');
        });
    });
});

describe('6) getFirstElement', () => {
    it('Возвращает первый элемент массива', () => {
        expect(getFirstElement([1, 2, 3])).toBe(1);
    });

    it('Возвращает первый элемент массива', () => {
        expect(getFirstElement(['a', 'b', 'c'])).toBe('a');
    });

    it('Возвращает undefined для пустого массива', () => {
        expect(getFirstElement([])).toBeUndefined();
    });
});

describe('7) findById', () => {
    interface TestItem extends HasId {
        name: string;
    }

    const items: TestItem[] = [ { id: 1, name: 'Item1' }, { id: 2, name: 'Item2' }, { id: 3, name: 'Item3' } ];

    it('Находит объект по id', () => {
        expect(findById(items, 2)).toEqual({ id: 2, name: 'Item2' });
        expect(findById(items, 1)).toEqual({ id: 1, name: 'Item1' });
    });

    it('Возвращает undefined если нет такого id', () => {
        expect(findById(items, 5)).toBeUndefined();
    });

    it('Обрабатывает пустой массив', () => {
        expect(findById([], 1)).toBeUndefined();
    });
});