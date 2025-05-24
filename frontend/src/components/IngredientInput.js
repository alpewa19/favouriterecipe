import React, { useState } from 'react';
import { analyzeImage } from '../services/api';

const IngredientInput = ({ onIngredientsChange }) => {
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyzeImage(file);
      setIngredients(res);
      onIngredientsChange(res);
    } catch (err) {
      setError('Ошибка при анализе изображения. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualInput = (e) => {
    const value = e.target.value;
    setIngredients(value);
    onIngredientsChange(value);
  };

  return (
    <div>
      <h2>Введите ингредиенты</h2>
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {isLoading && <p>Анализируем изображение...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <textarea
          value={ingredients}
          onChange={handleManualInput}
          placeholder="Введите ингредиенты через запятую"
          rows="4"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default IngredientInput; 