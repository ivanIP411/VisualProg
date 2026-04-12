import { useState, useEffect } from 'react';
import BookCard from './assets/BookCard';
import type { Book, BookImage } from './type';
import './App.css';

function App() {
    const [books, setBooks] = useState<BookImage[]>([]);

    useEffect(() => {
        fetch('https://openlibrary.org/search.json?q=russian+literature&limit=12')
            .then(res => res.json())
            .then(async (data) => {
                const booksData: Book[] = data.docs.map((doc: any, index: number) => ({
                    id: index + 1,
                    title: doc.title,
                    isbn: doc.isbn?.[0] || null,
                    pageCount: doc.number_of_pages_median,
                    authors: doc.author_name
                }));
                
                const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
                
                const booksWithImages = [];
                for (const book of booksData) {
                    let thumbnail = '';
                    
                    if (book.isbn) {
                        try {
                            await delay(200);
                            
                            const response = await fetch(
                                `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`
                            );
                            
                            if (response.ok) {
                                const googleData = await response.json();
                                if (googleData.items && googleData.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
                                    thumbnail = googleData.items[0].volumeInfo.imageLinks.thumbnail;
                                }
                            }
                        } catch (err) {
                            console.error('Ошибка загрузки', err);
                        }
                    }
                    
                    booksWithImages.push({ ...book, thumbnail });
                }
                
                setBooks(booksWithImages);
            })
    }, []);

    return (
        <div className="app">
            <h1>Каталог книг</h1>
            <div className="books-grid">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}

export default App;