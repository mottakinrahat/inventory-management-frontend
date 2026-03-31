// components/CategoryForm.tsx
import React, { useState } from 'react';

interface Props {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryForm: React.FC<Props> = ({ categories, setCategories }) => {
  const [categoryName, setCategoryName] = useState<string>('');

  const addCategory = () => {
    const trimmedName = categoryName.trim();
    if (trimmedName && !categories.includes(trimmedName)) {
      setCategories([...categories, trimmedName]);
      setCategoryName('');
    }
  };

  return (
    <div>
      <h2>Create Category</h2>
      <input
        type="text"
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <button onClick={addCategory}>Add Category</button>
      <ul>
        {categories.map((cat, index) => (
          <li key={index}>{cat}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryForm;