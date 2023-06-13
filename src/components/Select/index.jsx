import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import Select from 'react-select';

export const SelectOptions = ({api,params})=>{

  const [data, setData] = useState(null);
  const [page,setPage] = useState(params)
  
  const url = api ? new URL(api) : null;
  if(page){
    url.search = new URLSearchParams(page).toString();
  }

  const fetchData = async () => {
    try {
      const response = await fetch( !params ? api : url);
      console.log(response)
      const responseJSON = await response.json();
      const actionOptionsArray = [];
      responseJSON.data.map((item) => {
        actionOptionsArray.push({
          'value': item.id,
          'label': item.name,
        });[]
      })
      setData(actionOptionsArray)
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    console.log(url)
    setPage(params)

    fetchData();
  }, [api,params,page]);

  const filterData = (inputValue) => {
    return data.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  
  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterData(inputValue));
    }, 1000);
  };

  const handleMenuScrollToBottom = () => {
    setPage((prevState) => ({
      ...prevState,
      page: page.page + 1,
    }));
  };

  console.log(page)
  
  return(
    <>
   <Select cacheOptions  options={data}  api={api} params={params} onMenuScrollToBottom={handleMenuScrollToBottom}/>
    </>
  )
}

Select.PropTypes = {
url : PropTypes.string,
params: PropTypes.object
}