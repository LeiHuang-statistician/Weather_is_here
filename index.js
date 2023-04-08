const express = require('express');
const Datastore = require('nedb');
//const fetch = require('node-fetch');
require('dotenv').config();
// console.log(process.env)


const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json({
    status:'success',
    timestamp:timestamp,
    latitude:request.body.lat,
    logitude: request.body.lon,
    weather:request.body.weather,
    air:request.body.air
});
});

 

    app.get('/weather/:latlon', async (request, response) => {
        console.log(request.params);
        const latlon = request.params.latlon.split(',');
        console.log(latlon);
        const lat = latlon[0];
        const lon = latlon[1];
        console.log(lat, lon);
     
        api_key=process.env.API_KEY
       const weather_url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`
       //const weather_url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c7ab8885177a89aa3c12ac7798cc8a74&units=imperial`
        var weather_response=await fetch(weather_url) 
      const weather_json = await weather_response.json();


      const aq_url=`https://api.openaq.org//v2/latest?coordinates=${lat},${lon}`
      var aq_response=await fetch(aq_url) 
      const aq_json = await aq_response.json();

      const data = {
        weather: weather_json,
        air_quality: aq_json
      };
      response.json(data);
      //console.log(data)
    })