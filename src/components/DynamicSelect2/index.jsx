import React, { useState, useEffect, useRef } from 'react';
import './Assets/style.css';
export default function DynamicSelect2({ options = [], isMultiple = false }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef(null);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOptionClick = (option) => {
    const isSelected = selectedOptions.find((selectedOption) => selectedOption.value === option.value);
    let updatedSelectedOptions = [];

    if (isSelected) {
      updatedSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption.value !== option.value);
    } else {
      updatedSelectedOptions = isMultiple ? [...selectedOptions, option] : [option];
    }

    setSelectedOptions(updatedSelectedOptions);
    setSearchQuery('');
    // setSearchQuery(option.label);
  };

  const buildSearchQuery = (selectedOptions) => {
    if (!isMultiple && selectedOptions.length > 0) {
      console.log(selectedOptions)
      return selectedOptions[0].label;
    }

    return selectedOptions.map((option) => option.label).join(', ');
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedOptions.includes(option)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`custom-select ${isOpen ? 'open' : ''}`} ref={componentRef}>
    {console.log(searchQuery)}
      <div className="select-input" onClick={() => setIsOpen(!isOpen)}>
        {selectedOptions.length > 0 && (
          <div className="selected-options">
            {selectedOptions.map((option) => (
              <div key={option.value} className="selected-option">
                {option.label}
                <span className="remove-option" onClick={() => handleOptionClick(option)}>
                  &times;
                </span>
              </div>
            ))}
          </div>
        )}
        {!isMultiple && selectedOptions.length === 0 &&
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search..."
            onClick={() => setIsOpen(true)}
          />
        }
        <span className="caret" />
      </div>
      {isOpen && (
        <ul className="options-list">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`option ${selectedOptions.some((selectedOption) => selectedOption.value === option.value) ? 'selected' : ''}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {filteredOptions.length === 0 && (
        <div className="no-options">No options available.</div>
      )}
    </div>
  );
}
