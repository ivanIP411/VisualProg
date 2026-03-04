import { describe, it, expect, vi, beforeEach } from 'vitest';
import { csvToJSON, formatCSVFileToJSONFile } from './lab3';
import { readFile, writeFile } from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
    writeFile: vi.fn()
}));

describe('csvToJSON', () => {
    it('Правильные данные', () => {
        let input: string[] = ['p1;p2;p3;p4', '1;A;b;c', '2;B;v;d'];
        let res: object[] = csvToJSON(input, ';');
        
        expect(res).toEqual([
            { p1: '1', p2: 'A', p3: 'b', p4: 'c' },
            { p1: '2', p2: 'B', p3: 'v', p4: 'd' }
        ]);
    });

    it('Пустой массив', () => {
        expect(() => csvToJSON([], ';')).toThrow('Массив пустой');
    });

    it('Ошибка в строке', () => {
        let input: string[] = ['p1;p2;p3', '1;A'];
        expect(() => csvToJSON(input, ';')).toThrow('Ошибка в строке 2');
    });
});

describe('formatCSVFileToJSONFile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Читает и записывает файл', async () => {
        (readFile as any).mockResolvedValue('name,age\nИван,25\nМария,30');
        
        await formatCSVFileToJSONFile('test.csv', 'test.json', ',');
        
        expect(readFile).toHaveBeenCalledWith('test.csv', 'utf-8');
        
        let json: string = JSON.stringify([
            { name: 'Иван', age: '25' },
            { name: 'Мария', age: '30' }
        ], null, 2);
        
        expect(writeFile).toHaveBeenCalledWith('test.json', json, 'utf-8');
    });

    it('Пустой файл', async () => {
        (readFile as any).mockResolvedValue('');
        
        try {
            await formatCSVFileToJSONFile('test.csv', 'test.json', ',');
            expect(true).toBe(false);
        } catch (e: any) {
            expect(e.message).toBe('Файл пуст');
        }
    });
});