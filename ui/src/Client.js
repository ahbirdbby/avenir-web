/* eslint-disable no-undef */
function getSummary(cb) {
    return baseGet('/api/summary').then(cb);
}

function baseGet(url) {
  return fetch(url, {
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Client = { getSummary };
export default Client;
