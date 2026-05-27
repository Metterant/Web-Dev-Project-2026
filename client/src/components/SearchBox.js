import './SearchBox.css'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchBox({ onSearch, children }) {
  const [keywordValue, setKeywordValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params on mount
  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setKeywordValue(keyword);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newParams = new URLSearchParams(searchParams);
    
    for (let [key, value] of formData.entries()) {
      if (!value || !value.trim()) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.trim());
      }
    }

    newParams.set('page', '1');
    
    setSearchParams(newParams);
    onSearch(Object.fromEntries(newParams)); // Pass new params to parent
  }

  return (
    <div className="list-search-box">
      <form onSubmit={handleSubmit}>
        <div className="list-search-box-input">
          <input className="list-search-box-input__input"
            name="keyword"
            type="search"
            placeholder="Enter keyword..."
            value={keywordValue}
            onChange={(e) => setKeywordValue(e.target.value)}
          />
        </div>
        <div className="list-search-box-selects">
          {children}
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
}