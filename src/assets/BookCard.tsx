import type { BookImage } from '../type';

type BookCardProps = {
    book: BookImage;
};

function BookCard({ book }: BookCardProps) {
    return (
        <div className="book-card">
            {book.thumbnail && (
                <img 
                    src={book.thumbnail} 
                    alt={book.title} 
                    className="book-cover"
                />
            )}
            {!book.thumbnail && (
                <div className="book-cover no-image">
                    😭
                </div>
            )}
            <h3 className="book-title">{book.title}</h3>
            <p className="book-authors">{book.authors?.join(', ')}</p>
        </div>
    );
}

export default BookCard;