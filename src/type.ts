export type Book ={
    id: number;
    title: string;
    isbn: string;
    pageCount: number;
    authors: string[];
};

export type BookImage = Book & {
    thumbnail: string;
};