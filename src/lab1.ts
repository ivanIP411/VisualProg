export interface User {
    id: number,
    name: string,
    email?: string,
    isActive: boolean
}

export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return { id, name, email, isActive };
}


export type Genre = 'fiction' | 'non-fiction';

export interface Book {
    title: string,
    author: string,
    year?: number,
    genre: Genre
}

export function createBook(book: Book): Book {
    return book;
}



export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;
export function calculateArea(shape: 'circle' | 'square', param: number): number {
    if(shape == 'circle') {
        return Math.PI * param * param;
    } else {
        return param * param;
    }
}



export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
    switch(status) {
        case 'active':
            return 'green';
        case 'inactive':
            return 'blue';
        case 'new':
            return 'orange';
    }
}



export type StringFormatter = (str: string, uppercase?: boolean) => string;

export const firstUp: StringFormatter = (str: string) => {
    if(str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
};

export const trim: StringFormatter = (str: string, uppercase: boolean = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};



export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}



export interface HasId {
    id: number
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}