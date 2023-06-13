import axios from 'axios';
const AXIOS = {
    fire: async (baseURL,route, params, data, method) => {
      const response = await axios({
        // signal: await newAbortSignal(),
        url: route,
        method: method, // default
        baseURL: baseURL,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        params: params,
        data: data,
        // timeout: 1000,
        responseType: 'json',
        // onUploadProgress: function (progressEvent) {},
        // onDownloadProgress: function (progressEvent) {},
        validateStatus: function (status) {
          return status >= 200 && status < 300; // default
        },
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
      return response.data;
    },
}



export default AXIOS;
