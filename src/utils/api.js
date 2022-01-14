
const devURL = 'http://localhost:5000'
const liveURL = 'https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev'
const baseURL = liveURL;

const get = async (path, token=null) => {
  const headers = {};
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(baseURL+path, {
    headers: headers
  });
  const data = await response.json();
  return data;
}

const post = async (path, body, token=null) => {
  const headers = {
    'content-type': 'application/json'
  };
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(baseURL+path, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return data;
}

export {
  get,
  post
}
