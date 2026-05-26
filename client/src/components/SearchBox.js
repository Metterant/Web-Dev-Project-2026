import { Children, cloneElement, useEffect, useState } from "react";
import './SearchBox.css'

export default function SearchBox({ onSearch, placeHolderMessage, children }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  }

  const handleChildChange = (childOnChange) => (e) => {
    if (typeof childOnChange === 'function') {
      childOnChange(e);
    }

    onSearch(query);
  };

  return (
    <div className="list-search-box">
      <form onSubmit={handleSubmit}>
        <div className="list-search-box-input">
          <input className="list-search-box-input__input"
            type="search"
            placeholder={placeHolderMessage}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="list-search-box-selects">
          {Children.map(children, (child) => {
            if (!child) return null;

            return cloneElement(child, {
              ...child.props,
              onChange: handleChildChange(child.props.onChange),
            });
          })}
        </div>
      </form>
    </div>
  );
}