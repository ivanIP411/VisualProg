import { useState } from 'react';

function CitySelector({ onSelect }: { onSelect: (city: string) => void }) {
    const [input, setInput] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) onSelect(input.trim());
    };
    
    return (
        <form className="city-form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Поиск"
                value={input} 
                onChange={e => setInput(e.target.value)}
            />
            <button type="submit">🔍</button>
        </form>
    );
}

export default CitySelector;