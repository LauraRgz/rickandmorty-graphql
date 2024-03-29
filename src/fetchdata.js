import request from 'request'
import fs from 'fs'

const fetchData = (callback, url, data) => {

  if (!data) data = [];
  
  try {

    data = JSON.parse(fs.readFileSync('characters.json').toString());
    callback(data);

  } catch (e) {

    request({ url, json: true }, (error, response) => {

      console.log(`Fetching data...`);
      if (response.body) {
        data = [...data, ...response.body.results];
      }
      if (response.body.info.next !== '') {
        fetchData(callback, response.body.info.next, data);
      } 
      else {
        fs.writeFileSync('characters.json', JSON.stringify(data));
        callback(data);
      }

    })

  }

};

export { fetchData };
