//require('dotenv').config();
// console.log(process.env)

if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, weather, air;
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);

      const api_url = `weather/${lat},${lon}`;
      const response = await fetch(api_url);
      const json = await response.json();
      //console.log(json)
    //   const  today = Date.now();
    //   //api_key='c7ab8885177a89aa3c12ac7798cc8a74'
    //   api_key=process.env.API_KEY
    //    const weather_url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`
    //    //const weather_url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c7ab8885177a89aa3c12ac7798cc8a74&units=imperial`
    //     var response=await fetch(weather_url) 
    //   const weather_json = await response.json();


    //   const aq_url=`https://api.openaq.org//v2/latest?coordinates=${lat},${lon}`
    //   response=await fetch(aq_url) 
    //   const aq_json = await response.json();
    const weather_json=json.weather
    const aq_json=json.air_quality
     
      weather=weather_json.main;
      weather.summary=weather_json.weather[0]['description'].toUpperCase()
      console.log('weather',weather)
      air=aq_json.results[0].measurements[0];

      console.log('air',air)
   
      document.getElementById('summary').textContent =weather_json.weather[0]['description'].toUpperCase()
      document.getElementById('temp').textContent = weather_json.main['temp'];
      document.getElementById('aq_parameter').textContent = air.parameter;
      document.getElementById('aq_value').textContent = air.value;
      document.getElementById('aq_units').textContent = air.unit;
      document.getElementById('aq_date').textContent = air.lastUpdated;


     } catch (error) {
      console.error(error);
      air = { value: -1 };
      document.getElementById('aq_value').textContent = 'NO READING';
    }

    
    const data = { lat, lon,air, weather};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();
    //console.log('db',db_json);
  });
} else {
  console.log('geolocation not available');
}