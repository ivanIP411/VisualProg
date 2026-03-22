import { describe, it, expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers } from './lab6';

describe('DeepReadonly', () => {
    it('Делает все поля readonly', ()=>{
        type Film = {
            producer: string;
            year: number;
            actors: string;
        };
        type result = DeepReadonly<Film>;
        expectTypeOf<result>().toEqualTypeOf<{
            readonly producer: string;
            readonly year: number;
            readonly actors: string;
        }>();
    });
});

describe('PickedByType', () => {
    it('Выбираются string', ()=>{
        type Film = {
            producer: string;
            year: number;
            actors: string;
        };
        type result = PickedByType<Film, string>;
        expectTypeOf<result>().toEqualTypeOf<{
            producer: string;
            actors: string;
        }>();
    });
});

describe('EventHandlers', () => {
    it('Обработчик типа onEvenentName', ()=>{
        type Events = {
            change: string;
            input: {val:string};
        };
        type result = EventHandlers<Events>;
        expectTypeOf<result>().toEqualTypeOf<{
            onEvenentChange: (event: string)=>void;
            onEvenentInput: (event:{val:string})=>void;
        }>();
    });
});