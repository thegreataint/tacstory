import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import AXIOS from './Helper/axios';


const createOption = (label) => ({
  label,
  value: label,
});


export const DynamicSelect = ({ baseUrl, route, params, filterBy = 'name', placeholder, ...props }) => {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState({ page: 1 });
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // const [params, setParams] = useState
  const scrollProduct = () => {
    // console.log('scrollProduct')
      if (page.page < lastPage) {
          setPage({ ...page, ...{ page: page.page + 1} });
      }
  }
  useEffect(() => {
    // console.log(placeholder)

        params = { ...params, ...{ page: page.page + 1}}
        AXIOS.fire(baseUrl, route, params, undefined, 'get').then(async response => {
            const allData = data;
            response.data.map((item) => {
                allData.push({
                    'value': item.id,
                    'label': item[filterBy],
                });
            })
            setLastPage(response.meta.last_page)
            setData(allData)
          }).catch(error => {

          })
    }, [page,baseUrl,route])

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        // setValue((prev) => [...prev, createOption(inputValue)]);
        createNewOption(inputValue);
        // console.log(inputValue);
        setInputValue('');
        event.preventDefault();
    }
  };
  
  const createNewOption = (newOption) => {
    console.log(newOption)
    const tempData = data;
    setData([]);
    setIsLoading(true);
    const newCreateData = {
      [filterBy]: newOption 
    }
    console.log(newCreateData)
    AXIOS.fire(baseUrl, route, undefined, newCreateData, 'post').then(async response => {
        const allData = data;
        // setData((data) => [...tempData, tempData]);
        setData((data) => [...tempData, {value:response.data.id, label:response.data[filterBy]}]);
        setValue((prev) => [...prev, createOption(newOption)]);
        // setData(allData)
      }).catch(error => {
      setIsLoading(false);

      })
      
    
  }
  return (
    <>
      {placeholder &&
        <CreatableSelect
          inputValue={inputValue}
          isClearable
          isMulti
          options={data}
          // menuIsOpen={true}
          onCreateOption={(newOption) => createNewOption(newOption)}
          isSearchable={true}
          onMenuScrollToBottom={scrollProduct}
          hideSelectedOptions={true}
          onChange={(newValue) => setValue(newValue)}
          onInputChange={(newValue) => setInputValue(newValue)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          value={value}
          isLoading={isLoading}
          // menuIsOpen={isLoading}
        />
      }
    </>
  );
};
