import config from "../appConfig.js";

async function _fetch(link, header = {}) {
  try {
    let response = await fetch(link, header);
    let responseJson = await response.json();
    if (response.status === 200) {
      return {
        status: true,
        ...responseJson,
      };
    } else {
      return {
        ...responseJson,
        status: false,
      };
    }
  } catch (error) {
    return {
      status: false,
      data: [],
      results: {
        code: [3001],
      },
      error,
    };
  }
}

async function getJson(link, data = {}, key = config.token) {
  let header = {
    method: "GET",
    headers: {
      [config.token_name]: key,
    },
  };

  if(Object.keys(data).length) {
    link = link + '?' + new URLSearchParams(data).toString();
  }

  const response = await _fetch(link, header);
  return response;
}

async function postJson(link, data, key = config.token) {

  var formdata = new FormData();

  var urlencoded = new URLSearchParams();

  const ObjectFile =  Object.keys(data).filter((key) => data[key] && typeof data[key] === "object");

  if (ObjectFile.length) {
    Object.keys(data).map((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formdata.append(key, data[key]);
      }
      return true;
    });
  } else {
    Object.keys(data).map((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        urlencoded.append(key, data[key]);
      }
      return true;
    });
  }

  let header = {
    method: "POST",
    headers: {
      [config.token_name]: key,
    },
    body: ObjectFile.length ? formdata : urlencoded,
  };

  const response = await _fetch(link, header);
  return response;
}


export { getJson, postJson, _fetch };
