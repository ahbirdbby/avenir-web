/* eslint-disable no-undef */
function getSummary(cb) {
    return baseGet('/api/summary', cb);
}

function baseGet(url, cb) {
  return base(url, "", "GET", cb);
}

function basePost(url, data, cb) {
  return base(url, data, "POST", cb);
}

function baseDelete(url, cb) {
  return base(url, "", "DELETE", cb);
}

function base(url, data, method, cb) {
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

  return fetch(url, content, cb)
    .then(checkStatus)
    .then(parseJSON).then(cb).catch( error => {
      let msg = error.status;
      let response = error.response;
      let jsonType = response.headers.get("content-type").indexOf("application/json") !== -1
      if (response && jsonType) {
        response.json().then(json => {
          if (json != undefined) {
            if (typeof json.error == 'string') {
              msg = json.error;
            } else if (typeof json.error == 'object') {
              msg = JSON.stringify(json.error);
            }
            let notification = window.notification;
            notification.error(msg);
          }
        })
      } else {
        let notification = window.notification;
        notification.error(msg);
      }
      
    })
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  let msg = response.statusText;
  const error = new Error(`HTTP Error ${msg}`);
  error.status = response.statusText;
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function getDatabases(cb) {
  return baseGet('/api/databases', cb);
}

function mapDatabase(data, cb) {
  return basePost('/api/mapDatabase', data, cb);
}

function unmapDatabase(databaseName, cb) {
  return baseDelete('/api/databases/' + databaseName, cb);
}

function mapTable(data, cb) {
  return basePost('/api/mapTable', data, cb);
}

function unmapTable(databaseName, tableName, cb) {
  return baseDelete('/api/databases/' + databaseName + "/tables/" + tableName, cb);
}

function runQuery(sql, cb) {
  return basePost('/api/runQuery', {"sql": sql}, cb);
}

function getColumns(databaseName, tableName, remote, cb) {
  return baseGet('/api/' + databaseName + '/' + tableName + '/columns?remote=' + remote, cb);
}

const Client = { getSummary, getDatabases, mapDatabase, unmapDatabase, mapTable, unmapTable, runQuery, getColumns};
export default Client;
