import React from 'react';
import './DietFilter.css';

const DietFilter = ({ onDietSelect }) => {
  const dietOptions = [
    { value: null, label: '🍽️ No restrictions' },
    { value: 'vegetarian', label: '🥬 Vegetarian' },
    { value: 'vegan', label: '🌱 Vegan' },
    { value: 'gluten free', label: '🌾 Gluten-free' },
    { value: 'ketogenic', label: '🥩 Ketogenic' }
  ];

  return (
    <div className="diet-filter-chat">
      <div className="diet-options">
        {dietOptions.map(option => (
          <button
            key={option.value || 'none'}
            className="diet-option-button"
            onClick={() => onDietSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DietFilter; 