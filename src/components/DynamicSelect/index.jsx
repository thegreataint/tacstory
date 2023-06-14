import React, { useState, useEffect, useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import AXIOS from './Helper/axios';

const createOption = (label) => ({
  label,
  value: label,
});

export default function DynamicSelect({ baseUrl, route, params, filterBy = 'name', placeholder, ...props }) {
  const paramsRef = useRef(params);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState({ page: 1 });
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const scrollProduct = () => {
    if (page.page < lastPage) {
      setPage((prevPage) => ({ ...prevPage, page: prevPage.page + 1 }));
    }
  };

  useEffect(() => {
    const newParams = { ...paramsRef.current, ...{ page: page.page + 1 } };
    AXIOS.fire(baseUrl, route, newParams, undefined, 'get')
      .then(async (response) => {
        setData((prevData) => [
          ...prevData,
          ...response.data.map((item) => ({
            value: item.id,
            label: item[filterBy],
          })),
        ]);
        setLastPage(response.meta.last_page);
      })
      .catch((error) => {
        // Handle error
      });
  }, [page, baseUrl, route, filterBy]);

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        createNewOption(inputValue);
        setInputValue('');
        event.preventDefault();
        break;
      default:
        // Handle other key events here if needed
        break;
    }
  };

  const createNewOption = (newOption) => {
    const tempData = [...data];
    setIsLoading(true);
    const newCreateData = {
      [filterBy]: newOption,
    };
    AXIOS.fire(baseUrl, route, undefined, newCreateData, 'post')
      .then(async (response) => {
        const newOptionData = { value: response.data.id, label: response.data[filterBy] };
        setData([...tempData, newOptionData]);
        setValue((prevValue) => [...prevValue, createOption(newOption)]);
      })
      .catch((error) => {
        // Handle error
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {placeholder && (
        <CreatableSelect
          inputValue={inputValue}
          isClearable
          isMulti
          options={data}
          onCreateOption={createNewOption}
          isSearchable={true}
          onMenuScrollToBottom={scrollProduct}
          hideSelectedOptions={true}
          onChange={setValue}
          onInputChange={setInputValue}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          value={value}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
