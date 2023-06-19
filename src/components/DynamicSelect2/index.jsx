import React, { useState, useEffect, useRef } from 'react';
import './Assets/style.css';
import AXIOS from './Helper/axios';

DynamicSelect2.defaultProps = {
  options: [],
  isMultiple: false,
  url: { 
    baseUrl: 'https://api.lacasa.tacverse.com/v1/', 
    route: 'users', 
    hasPagination: true 
  },
  filter: {
    filterBy: 'name',
    serverSide: true,
    enabled: true
  },
};

export default function DynamicSelect2({ options, isMultiple, url, filter}) {
  // 
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef(null);
  const [data, setData] = useState([]);
  const listRef = useRef(null);
  const [lastPage, setLastPage] = useState(0);
  const [filterParams, setFilterParams] = useState({page: 1, find: {name: ''}});
  const [resetFilter, setResetFilter] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const abortControllerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  function getInitialData(params) {
    
    if(options && options.length > 0)
    {
      return Promise.resolve(options); // Return the options directly as the initial data
    }
    if (url.baseUrl.length > 0 && url.route.length > 0) {
      
      if (abortControllerRef.current) {
       abortControllerRef.current.abort(); // Cancel previous request
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      setIsLoading(resetFilter ? true : false);
      return AXIOS.fire(url.baseUrl, url.route, params, undefined, 'get', abortController.signal)
        .then((response) => {
          const prepareData = [
            ...resetFilter ? [] : data,
            ...response.data.map((item) => ({
              value: item.id,
              label: item[filter.filterBy],
            })),
          ];
          setLastPage(response.meta.last_page);
          setResetFilter(false)
          setIsLoading(false)
          return prepareData;
        })  .catch((error) => {
          // Handle error
          
          return [];
        });
    }
    return Promise.resolve([]); // Return an empty array as the default value
  }
  useEffect(() => {
    getInitialData().then((initialData) => {
      setData(initialData);
      // setIsLoading(false)
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
    
  
  }, []);
  
  
  useEffect(() => {
  function handleScroll() {
    const list = listRef.current;
    const scrollTop = list.scrollTop;
    const scrollHeight = list.scrollHeight;
    const clientHeight = list.clientHeight;

    // Check if scrolled to the bottom
    if (scrollTop + clientHeight === scrollHeight) {
      // Call your function here
      handleScrollToBottom();
    }
  }

  if (listRef.current) {
    const list = listRef.current;
    list.addEventListener('scroll', handleScroll);
    return () => {
      list.removeEventListener('scroll', handleScroll);
    };
  }
}, [listRef.current]);
  useEffect(() => {
    getInitialData(filterParams).then((newData) => {
      // 
      if(newData.length === 0 && searchQuery.length > 0)
      {
        
        setShowCreate(true)
      }else{
        setShowCreate(false)
      }
      setData(newData);
    });
}, [filterParams]);

  function handleScrollToBottom() {
    
    console.log('Scroll to bottom')
     if(filterParams.page < lastPage)
     {
        setResetFilter(false)
        setFilterParams((prevParams) => ({ ...prevParams, page: prevParams.page + 1 }));
     }
 }
 
  const handleInputChange = (event) => {
    setIsOpen(true)
    if(filter.serverSide) {
      setResetFilter(true)
      setFilterParams((prevParams) => ({ page: 1,    find: { ...prevParams.find, [filter.filterBy]: event.target.value } }));
    }
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
  };

  const filteredOptions = data.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedOptions.includes(item)
  );
  const handleCreateClick = (query) => {
    console.log(query)
  }

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
        {(selectedOptions.length === 0 || isMultiple) && filter.enabled && 
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
        <ul className="options-list"  ref={listRef}>
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`option ${selectedOptions.some((selectedOption) => selectedOption.value === option.value) ? 'selected' : ''}`}
            >
              {option.label}
            </li>
          ))}
          {filteredOptions.length === 0 && showCreate === false && isLoading === false && (
            <li
              key={`no-options`}
              disabled={'disabled'}
              className={`option`}
            >
              No options available.
            </li>
          )}
          {isLoading && 
            <li
            key={`no-options`}
            disabled={'disabled'}
            className={`option`}
            > Loading 
            </li>
          }
          {showCreate && isLoading === false && (
            <li
              key={`no-options`}
              disabled={'disabled'}
              onClick={() => handleCreateClick(searchQuery)}
              className={`option`}
            >
              Create {searchQuery}.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
