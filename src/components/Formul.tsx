import React, { useState, useEffect, useRef } from 'react';

interface FormulProps {
  value: string;
  onChange: (val: string) => void;
  onEnter: () => void;
}
function Formul({ value, onChange, onEnter }: FormulProps) {
  const [localValue, setLocalValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
      onEnter();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(localValue);
      onEnter();
    }
  };
  return (
    <div className="formula-bar">
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Введите значение или =формулу"
      />
    </div>
  );
}
export default Formul;