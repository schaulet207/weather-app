// Declare city globally
var city;

// Fetch weather data using targetLocation
async function getWeatherData(targetLocation) {
  const apiKey = "5caa1bdd43874892b9b190358231308";
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${targetLocation}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Weather data not available");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
}

// Process weather data from weatherapi.com
function processWeatherData(weatherData) {
  if (!weatherData) {
    return null;
  }

  const processedData = {
    allData: weatherData,
    location: weatherData.location.name,
    temperature: weatherData.current.temp_c,
    condition: weatherData.current.condition.text,
    currentTime: weatherData.location.localtime,
  };

  return processedData;
}

// Use browser locations to find the user's city
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      // Fetch city information using OpenStreetMap Nominatim API
      var apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet ||
            "Unknown";
          console.log("City: " + city);
          
          // Call getWeatherData() here after obtaining the city
          getWeatherData(city)
            .then((weatherData) => {
              const processedData = processWeatherData(weatherData);
              console.log("Processed Weather Data:", processedData);
            })
            .catch((error) => {
              console.error("Error:", error.message);
            });
        })
        .catch((error) => {
          console.log("Error fetching city information: " + error);
        });
    },
    function (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          break;
      }
    }
  );
} else {
  console.log("Geolocation is not available in this browser.");
}
