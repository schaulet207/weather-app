// Function to fetch weather data for any given location using the targetLocation variable
async function getWeatherData(targetLocation) {
    const apiKey = '5caa1bdd43874892b9b190358231308';
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${targetLocation}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      return null;
    }
  }
  
  // Log weather data
  function logWeatherData(weatherData) {
    if (!weatherData) {
      console.log('No data available.');
      return;
    }
  
    console.log('All Available Weather Data:', weatherData);
    console.log('Wind Direction:', weatherData.current.wind_dir);
  }
  
  // Example using London as the targetLocation variable
  const targetLocation = 'london';
  getWeatherData(targetLocation)
    .then(weatherData => {
      logWeatherData(weatherData);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  