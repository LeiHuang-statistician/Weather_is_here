

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