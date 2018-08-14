/* eslint-disable no-undef */
function getSummary(cb) {
    return baseGet('/api/summary').then(cb);
}

function baseGet(url) {
  return base(url, "", "GET");
}

function basePost(url, data) {
  return base(url, data, "POST");
}

function baseDelete(url) {
  return base(url, "", "DELETE");
}

function base(url, data, method) {
  let content = {
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Accept': "application/json",
      'Csrf-Token': "nocheck"
    },
    method: method
  };

  if (method != 'GET') {
    content.body = JSON.stringify(data);
  }

  return fetch(url, content)
    .then(checkStatus)
    .then(parseJSON)
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  let msg = response.statusText;
  const error = new Error(`HTTP Error ${msg}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function getDatabases(cb) {
  return baseGet('/api/databases').then(cb);
}

function mapDatabase(data, cb) {
  return basePost('/api/mapDatabase', data).then(cb);
}

function unmapDatabase(databaseName, cb) {
  return baseDelete('/api/databases/' + databaseName).then(cb);
}

function mapTable(data, cb) {
  return basePost('/api/mapTable', data).then(cb);
}

function unmapTable(databaseName, tableName, cb) {
  return baseDelete('/api/databases/' + databaseName + "/tables/" + tableName).then(cb);
}

const Client = { getSummary, getDatabases, mapDatabase, unmapDatabase, mapTable, unmapTable};
export default Client;
