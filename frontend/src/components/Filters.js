import React from 'react';

const Filters = ({ diet, onDietChange }) => (
  <div style={{ margin: '16px 0' }}>
    <h2>Фильтры</h2>
    <select value={diet} onChange={e => onDietChange(e.target.value)}>
      <option value="">Любая диета</option>
      <option value="vegetarian">Вегетарианская</option>
      <option value="vegan">Веганская</option>
      <option value="gluten free">Без глютена</option>
      <option value="ketogenic">Кетогенная</option>
    </select>
  </div>
);

export default Filters; 