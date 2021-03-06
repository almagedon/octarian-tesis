import axios from 'axios';
import Cookies from 'js-cookie';

// Simple API wrapper
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "Cookie";

const API_URL = 'https://swapi.co/api';
const BASE_URL ="http://localhost:8000/api/";
// Custom API error to throw
function ApiError(message, data, status) {
  let response = null;
  let isObject = false;

  // We are trying to parse response
  try {
    response = JSON.parse(data);
    isObject = true;
  } catch (e) {
    response = data;
  }

  return {
    response,
    message,
    status,
    toString: () => {
      return `${ this.message }\nResponse:\n${ isObject ? JSON.stringify(this.response, null, 2) : this.response }`;
    },
  };
}

// API wrapper function
const fetchResource = (path, userOptions = {}) => {
  // Define default options
  const defaultOptions = {};

  // Define default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const options = {
    // Merge options
    ...defaultOptions,
    ...userOptions,
    // Merge headers
    headers: {
      ...defaultHeaders,
      ...userOptions.headers,
    },
  };

  // Build Url
  const url = `${ API_URL }/${ path }`;

  // Detect is we are uploading a file
  const isFile = typeof window !== 'undefined' && options.body instanceof File;

  // Stringify JSON data
  // If body is not a file
  if (options.body && typeof options.body === 'object' && !isFile) {
    options.body = JSON.stringify(options.body);
  }

  // Variable which will be used for storing response
  let response = null;

  return fetch(url, options)
    .then(responseObject => {
      // Saving response for later use in lower scopes
      response = responseObject;

      // HTTP unauthorized
      if (response.status === 401) {
        // Handle unauthorized requests
        // Maybe redirect to login page?
      }

      // Check for error HTTP error codes
      if (response.status < 200 || response.status >= 300) {
        // Get response as text
        return response.text();
      }

      // Get response as json
      return response.json();
    })
    // "parsedResponse" will be either text or javascript object depending if
    // "response.text()" or "response.json()" got called in the upper scope
    .then(parsedResponse => {
      // Check for HTTP error codes
      if (response.status < 200 || response.status >= 300) {
        // Throw error
        throw parsedResponse;
      }

      // Request succeeded
      return parsedResponse;
    })
    .catch(error => {
      // Throw custom API error
      // If response exists it means HTTP error occured
      if (response) {
        throw ApiError(`Request failed with status ${ response.status }.`, error, response.status);
      } else {
        throw ApiError(error.toString(), null, 'REQUEST_FAILED');
      }
    });
};

function getPeople() {
  return fetchResource('people/');
}
/*
const axiosConf{
  headers: {
        'X-CSRFToken': Cookies.get(csrftoken),
        'Content-Type': 'application/vnd.api+json'
    }
}
*/
function backendgetAuthToken(url, data = {}, params = {}) {
  return axios(BASE_URL+url, {
    ...params,
    headers: {
        'Accept': "application/vnd.api+json;application/json;ident=4",
        'Content-Type': 'application/vnd.api+json'
    },
    data:{
      data:{
        "type": "User",
        "id": "null",
        "attributes": data,
      },
    }
  });
}
function backendPostProject(url, data = {}, params = {}) {
const csrftoken = Cookies.get('csrftoken');
  console.log(csrftoken)
  return axios(BASE_URL+url, {
    ...params,
    headers: {
        'Accept': "application/vnd.api+json;application/json;ident=4",
        'Content-Type': 'application/vnd.api+json',
        //'Cookie':"csrftoken=kgSLtGOGaWd9sFF4nYxvdfODxEyZGA3fcgRp0vPmnxTaMkVev0WveecsZO4kfTX7; sessionid=03bn0cnva0x34h9f0mrfl3gc6p2q3081; tabstyle=html-tab"
        "X-CSRFTOKEN":csrftoken,
        "X-Requested-With":"XMLHttpRequest"

        //"HTTP_X_CSRFTOKEN":csrftoken,
        //"XCSRF-TOKEN":csrftoken,
    },
    data:{
      data:{
        "type": "Projects",
        "id": "null",
        "attributes": data,
      },
    }
  });
}
function backendGetProjects(url, data = {}, params = {}) {
  return axios(BASE_URL+url, {
    ...params,
    headers: {
        'Accept': "application/vnd.api+json;application/json;ident=4",
        'Content-Type': 'application/vnd.api+json'
    },
    data:{
      data:{
        "type": "ObtainJSONWebToken",
        "id": "null",
        "attributes": data,
      },
    }
  });
}
function backendGetInfo(url, params = {}) {
  return axios(BASE_URL+url, {});
}

export default {
  getPeople,
  backendgetAuthToken,
  backendGetInfo,
  backendPostProject,
};
