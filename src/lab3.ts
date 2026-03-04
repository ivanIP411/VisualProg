import { readFile, writeFile } from 'node:fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
    if (input.length === 0) {
        throw new Error('Массив пустой');
    }

    let headers = input[0].split(delimiter);
    let result = [];

    for (let i: number = 1; i < input.length; i++) {
        let line = input[i];
        if (line === '') continue;

        let values = line.split(delimiter);
        if (values.length !== headers.length) {
            throw new Error('Ошибка в строке ' + (i + 1));
        }

        let obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j];
        }
        result.push(obj);
    }

    return result;
}

export async function formatCSVFileToJSONFile(input: string, output: string, delimiter: string): Promise<void> {
    let data = await readFile(input, 'utf-8');
    let lines = data.split('\n').filter((line) => line !== '');
    
    if (lines.length === 0) {
        throw new Error('Файл пуст');
    }

    let json = csvToJSON(lines, delimiter);
    await writeFile(output, JSON.stringify(json, null, 2), 'utf-8');
}