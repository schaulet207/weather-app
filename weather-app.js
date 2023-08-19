// Declare variables globally
var city;
var dayTime;
var forecast;
var sunset;
var sunrise;
var maxTemp;
var conditionStatus;
var humidity;

// Variables for HTML elements to allow searching cities
var locationInput = document.getElementById("location");
var weatherDataContainer = document.getElementById("weatherData");
weatherDataContainer.innerHTML = "<p>Loading...</p>"; // Display loading message

// Fetch weather data using targetLocation
async function getWeatherData(targetLocation) {
  const apiKey = "5caa1bdd43874892b9b190358231308";
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${targetLocation}&days=3&aqi=no&alerts=no`;

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

// Change the date-time string returned from weatherData.location.localtime to a more readable format
function formatDate(apiDateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = new Date(apiDateString);

  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  const formattedDate = `${dayOfWeek}, ${month} ${day}${getDaySuffix(
    day
  )} ${year} ${formattedHours}:${padZero(minutes)}${period}`;

  return formattedDate;
}

// Process weather data from weatherapi.com
function processWeatherData(weatherData) {
  if (!weatherData) {
    return null;
  }

  const processedData = {
    allData: weatherData,
    location: weatherData.location.name,
    temperature: weatherData.current.temp_f,
    condition: weatherData.current.condition.text,
    currentTime: formatDate(weatherData.location.localtime), // Format the current time
    dayTime: weatherData.current.is_day === 1 ? "day" : "night", // Determine if day or night
    maxTemp: weatherData.forecast.forecastday[0].day.maxtemp_f,
    humidity: weatherData.current.humidity,
  };

  // Set the variables needed globally
  dayTime = processedData.dayTime;
  forecast = weatherData.forecast.forecastday;
  sunset = weatherData.forecast.forecastday[0].astro.sunset;
  sunrise = weatherData.forecast.forecastday[0].astro.sunrise;
  conditionStatus = weatherData.current.condition.text;
  maxTemp = weatherData.forecast.forecastday[0].day.maxtemp_f,
  humidity = weatherData.current.humidity;

  weatherDataContainer.innerHTML = `
    <h1 id="local">${weatherData.location.name}, ${weatherData.location.region}</h1>
    <div id="time">
      <h3>${processedData.currentTime}</h3>
      <img id="dayNightImage" src="" alt="Day/Night Image">
    </div>
    <div id="temp">
      <h1 id="degrees">${weatherData.current.temp_f}°F</h1>
      <img id="thermometer" src="" alt="Thermometer Image">
    </div>
    <img id="conditionImage" src="" alt="Weather Condition Image">
      <h2>${weatherData.current.condition.text}</h2>
    <div class="lrData">
      <p>Sunrise: ${sunrise}</p>
      <p>Sunset: ${sunset}</p>
    </div>
    <div class="lrData">
      <p>High of: ${maxTemp}°F</p>
      <p>Humidity: ${humidity}%</p>
    </div>
  `;
  // Update day/night image
  dayNight(dayTime);
  conditionImage(conditionStatus);
  // Add the thermometer image
  const thermometer = document.getElementById("thermometer");
  thermometer.src = "/weather-app/img/thermometer.svg";

  return processedData;
}

// Update the day/night image based on dayTime
function dayNight(dayTime) {
  const dayNightImage = document.getElementById("dayNightImage");
  if (dayTime === "day") {
    dayNightImage.src = "/weather-app/img/sun.svg";
  } else {
    dayNightImage.src = "/weather-app/img/moon.svg";
  }
}

// Update the conditions image based on condition
function conditionImage(conditionStatus) {
  const conditionImage = document.getElementById("conditionImage");
  switch (conditionStatus) {
    case "Clear":
    case "Sunny":
    case "Fair":
      conditionImage.src = "/weather-app/img/sun.svg";
      console.log("1");
      break;
    case "Partly cloudy":
    case "Mostly cloudy":
    case "Cloudy":
    case "Overcast":
      conditionImage.src = "/weather-app/img/cloud.svg";
      console.log("2");
      break;
    case "Light rain":
    case "Patchy rain possible":
    case "Patchy light rain":
    case "Moderate rain at times":
    case "Light freezing rain":
    case "Moderate or heavy freezing rain":
    case "Light rain shower":
    case "Moderate or heavy rain shower":
    case "Torrential rain shower":
    case "Moderate rain":
    case "Heavy rain":
    case "Showers":
      conditionImage.src = "/weather-app/img/rain.svg";
      console.log("3");
      break;
    case "Light snow":
    case "Light sleet":
    case "Moderate snow":
    case "Heavy snow":
    case "Flurries":
    case "Blizzard":
    case "Patchy snow possible":
    case "Patchy sleet possible":
    case "Patchy freezing drizzle possible":
    case "Blowing snow":
    case "Light snow showers":
    case "Patchy snow possible":
      conditionImage.src = "/weather-app/img/snow.svg";
      console.log("4");
      break;
    case "Mist":
    case "Fog":
    case "Haze":
      conditionImage.src = "/weather-app/img/impaired.svg";
      console.log("5");
      break;
    default:
      conditionImage.src = "";
  }
}

// Helper function to format date and time
function formatDate(apiDateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = new Date(apiDateString);

  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  const formattedDate = `${dayOfWeek}, ${month} ${day}${getDaySuffix(
    day
  )} ${year} | ${formattedHours}:${padZero(minutes)}${period}`;

  return formattedDate;
}

// Helper function to get day suffix (st, nd, rd, th)
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Helper function to pad numbers with leading zero
function padZero(num) {
  return num < 10 ? `0${num}` : num;
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

// City search bar function
function citySearch() {
  city = locationInput.value;
  if (city) {
    weatherDataContainer.innerHTML = "<p>Loading...</p>";
    getWeatherData(city)
      .then((weatherData) => {
        const processedData = processWeatherData(weatherData);
        console.log("Processed Weather Data:", processedData);

        // Update the weatherDataContainer with the searched cities data
        if (processedData) {
          weatherDataContainer.innerHTML = `
            <h1 id="local">${weatherData.location.name}, ${weatherData.location.region}</h1>
            <div id="time">
              <h3>${processedData.currentTime}</h3>
              <img id="dayNightImage" src="" alt="Day/Night Image">
            </div>
            <div id="temp">
              <h1 id="degrees">${weatherData.current.temp_f}°F</h1>
              <img id="thermometer" src="" alt="Thermometer Image">
            </div>
            <img id="conditionImage" src="" alt="Weather Condition Image">
              <h2>${weatherData.current.condition.text}</h2>
            <div class="lrData">
              <p>Sunrise: ${sunrise}</p>
              <p>Sunset: ${sunset}</p>
            </div>
            <div class="lrData">
              <p>High of: ${maxTemp}°F</p>
              <p>Humidity: ${humidity}%</p>
            </div>
  `;
        // Update day/night image
        dayNight(dayTime);
        conditionImage(conditionStatus);
        // Add the thermometer image
        const thermometer = document.getElementById("thermometer");
        thermometer.src = "/weather-app/img/thermometer.svg";
        } else {
          weatherDataContainer.innerHTML = "Weather data not available.";
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        weatherDataContainer.innerHTML = "Error fetching weather data.";
      });
  } else {
    console.log("Please enter a location.");
  }
}

// Search button click event
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", citySearch);

// Event listener for locationInput enter
locationInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    citySearch();
  }
});

// Remove placeholder text when the input is focused
locationInput.addEventListener("focus", function () {
  locationInput.removeAttribute("placeholder");
});

// Restore placeholder text when the input loses focus and is empty
locationInput.addEventListener("blur", function () {
  if (locationInput.value === "") {
    locationInput.setAttribute("placeholder", "Search by city or coordinates");
  }
});


