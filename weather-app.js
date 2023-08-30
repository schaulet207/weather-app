// Declare variables globally
var city;
var dayTime;
var forecast;
var sunset;
var sunrise;
var maxTemp;
var conditionStatus;
var humidity;
var byHour;
var unprocessedTime;
var currentHour;
var hourlyConditionsGlobal = [];
var hourlyTempsGlobal = [];
var clockFormat;
var amPm;
var forecastHour;
var area;
var localRegion;
var regularTemp;
var regularCondition;
var formattedTime;

// Daily forecast variables
var dayForecast = 0;
var tomorrowTemp;
var tomorrowCondition;
var tomorrowSunrise;
var tomorrowSunset;
var tomorrowHumidity;
var tomorrowMaxtemp;
var hour1;
var hour1Condition;
var hour2;
var hour2Condition;
var hour3;
var hour3Condition;
var hour4;
var hour4Condition;
var hour5;
var hour5Condition;
var hour6;
var hour6Condition;
var hour7;
var hour7Condition;
var dayAfterTemp;
var dayAfterCondition;
var dayAfterSunrise;
var dayAfterSunset;
var dayAfterHumidity;
var dayAfterMaxTemp;
var dayAfterHour1;
var dayAfterHour1Condition;
var dayAfterHour2;
var dayAfterHour2Condition;
var dayAfterHour3;
var dayAfterHour3Condition;
var dayAfterHour4;
var dayAfterHour4Condition;
var dayAfterHour5;
var dayAfterHour5Condition;
var dayAfterHour6;
var dayAfterHour6Condition;
var dayAfterHour7;
var dayAfterHour7Condition;

// Variables for HTML elements to allow searching cities
var locationInput = document.getElementById("location");
var weatherDataContainer = document.getElementById("weatherData");
weatherDataContainer.innerHTML = "<p>Loading...</p>"; // Display loading message

// Hide historical weather data by default
hideYesterday();

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
    hourlyForecasts: Array.from(weatherData.forecast.forecastday, day => day.hour),
    timeData: weatherData.location.localtime,
  };

  // Set the variables needed globally
  dayTime = processedData.dayTime;
  forecast = weatherData.forecast.forecastday;
  sunset = weatherData.forecast.forecastday[0].astro.sunset;
  sunrise = weatherData.forecast.forecastday[0].astro.sunrise;
  conditionStatus = weatherData.current.condition.text;
  maxTemp = weatherData.forecast.forecastday[0].day.maxtemp_f,
  humidity = weatherData.current.humidity;
  byHour = processedData.hourlyForecasts;
  timeData = weatherData.location.localtime;
  regularTemp = weatherData.current.temp_f,
  formattedTime = processedData.currentTime;
  currentHour = getHour(timeData);
  getHourlyForecast(currentHour);
  displayHour = parseInt(currentHour);
  convertTo12Hour(displayHour);
  area = weatherData.location.name;
  localRegion = weatherData.location.region;
  // Tomorrow forecast variables
  tomorrowTemp = weatherData.forecast.forecastday[1].hour[12].temp_f;
  tomorrowCondition = weatherData.forecast.forecastday[1].hour[12].condition.text;
  tomorrowSunrise = weatherData.forecast.forecastday[1].astro.sunrise;
  tomorrowSunset = weatherData.forecast.forecastday[1].astro.sunset;
  tomorrowHumidity = weatherData.forecast.forecastday[1].hour[12].humidity;
  tomorrowMaxtemp = weatherData.forecast.forecastday[1].day.maxtemp_f;
  hour1 = weatherData.forecast.forecastday[1].hour[10].temp_f;
  hour1Condition = weatherData.forecast.forecastday[1].hour[10].condition.text;
  hour2 = weatherData.forecast.forecastday[1].hour[11].temp_f;
  hour2Condition = weatherData.forecast.forecastday[1].hour[11].condition.text;
  hour3 = weatherData.forecast.forecastday[1].hour[12].temp_f;
  hour3Condition = weatherData.forecast.forecastday[1].hour[12].condition.text;
  hour4 = weatherData.forecast.forecastday[1].hour[13].temp_f;
  hour4Condition = weatherData.forecast.forecastday[1].hour[13].condition.text;
  hour5 = weatherData.forecast.forecastday[1].hour[14].temp_f;
  hour5Condition = weatherData.forecast.forecastday[1].hour[14].condition.text;
  hour6 = weatherData.forecast.forecastday[1].hour[15].temp_f;
  hour6Condition = weatherData.forecast.forecastday[1].hour[15].condition.text;
  hour7 = weatherData.forecast.forecastday[1].hour[16].temp_f;
  hour7Condition = weatherData.forecast.forecastday[1].hour[16].condition.text;
  // Day after forecast variables
  dayAfterTemp = weatherData.forecast.forecastday[2].hour[12].temp_f;
  dayAfterCondition = weatherData.forecast.forecastday[2].hour[12].condition.text;
  dayAfterSunrise = weatherData.forecast.forecastday[2].astro.sunrise;
  dayAfterSunset = weatherData.forecast.forecastday[2].astro.sunset;
  dayAfterHumidity = weatherData.forecast.forecastday[2].hour[12].humidity;
  dayAfterMaxTemp = weatherData.forecast.forecastday[2].day.maxtemp_f;
  hour1DayAfter = weatherData.forecast.forecastday[2].hour[10].temp_f;
  hour1ConditionDayAfter = weatherData.forecast.forecastday[2].hour[10].condition.text;
  hour2DayAfter = weatherData.forecast.forecastday[2].hour[11].temp_f;
  hour2ConditionDayAfter = weatherData.forecast.forecastday[2].hour[11].condition.text;
  hour3DayAfter = weatherData.forecast.forecastday[2].hour[12].temp_f;
  hour3ConditionDayAfter = weatherData.forecast.forecastday[2].hour[12].condition.text;
  hour4DayAfter = weatherData.forecast.forecastday[2].hour[13].temp_f;
  hour4ConditionDayAfter = weatherData.forecast.forecastday[2].hour[13].condition.text;
  hour5DayAfter = weatherData.forecast.forecastday[2].hour[14].temp_f;
  hour5ConditionDayAfter = weatherData.forecast.forecastday[2].hour[14].condition.text;
  hour6DayAfter = weatherData.forecast.forecastday[2].hour[15].temp_f;
  hour6ConditionDayAfter = weatherData.forecast.forecastday[2].hour[15].condition.text;
  hour7DayAfter = weatherData.forecast.forecastday[2].hour[16].temp_f;
  hour7ConditionDayAfter = weatherData.forecast.forecastday[2].hour[16].condition.text;


  weatherDataContainer.innerHTML = `
    <h1 id="local">${weatherData.location.name}, ${weatherData.location.region}</h1>
    <div id="time">
      <h3>${processedData.currentTime}</h3>
      <img id="dayNightImage" src="" alt="Day/Night Image">
    </div>
    <div id="tempAndConditions">
      <div id="temp">
        <h1 id="degrees">${weatherData.current.temp_f}°F</h1>
        <img id="thermometer" src="" alt="Thermometer Image">
      </div>
      <div id="conditions">
        <h1 id="condition0">${weatherData.current.condition.text}</h1>
        <img id="conditionImage0" src="" alt="Weather Condition Image">
      </div>
    </div>
    <div class="lrData">
      <h2>Sunrise: </h2><h2 class="purp">${sunrise}</h2>
      <h2>Sunset: </h2><h2 class="purp">${sunset}</h2>
    </div>
    <div class="lrData">
      <h2>High of: </h2><h2 class="purp">${maxTemp}°F</h2>
      <h2>Humidity: </h2><h2 class="purp">${humidity}%</h2>
    </div>
    <div id="hourly">
      <div class="hour">
        <h2 class="purp" id="hour1">${clockFormat + 1}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[1]}</h3>
        <img id="conditionImage1" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[1]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour2">${clockFormat + 2}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[2]}</h3>
        <img id="conditionImage2" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[2]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour3">${clockFormat + 3}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[3]}</h3>
        <img id="conditionImage3" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[3]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour4">${clockFormat + 4}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[4]}</h3>
        <img id="conditionImage4" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[4]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour5">${clockFormat + 5}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[5]}</h3>
        <img id="conditionImage5" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[5]}°F</h3>
        </div>
      <div class="hour">
        <h2 class="purp" id="hour6">${clockFormat + 6}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[6]}</h3>
        <img id="conditionImage6" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[6]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour7">${clockFormat + 7}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[7]}</h3>
        <img id="conditionImage7" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[7]}°F</h3>
      </div>
    </div>

  `;
  // Update images
  dayNight(dayTime);
  conditionImage(conditionStatus);
  forecastImage(hourlyConditionsGlobal);
  updateHour();
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
  const conditionImage = document.getElementById(`conditionImage0`);
  switch (conditionStatus) {
    case "Clear":
    case "Sunny":
    case "Fair":
      conditionImage.src = "/weather-app/img/sun.svg";
      break;
    case "Partly cloudy":
    case "Mostly cloudy":
    case "Cloudy":
    case "Overcast":
      conditionImage.src = "/weather-app/img/cloud.svg";
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
      break;
    case "Mist":
    case "Fog":
    case "Haze":
      conditionImage.src = "/weather-app/img/impaired.svg";
      break;
    default:
      conditionImage.src = "";
  }
}

// Now update the forecast conditions image based on condition
function forecastImage(hourlyConditionsGlobal) {
  let loopIndex = 1;
    for (i = 1; i < 8; i++) {
    let conditionImage = document.getElementById(`conditionImage${i}`);
    switch (hourlyConditionsGlobal[i]) {
      case "Clear":
      case "Sunny":
      case "Fair":
        conditionImage.src = "/weather-app/img/sun.svg";
        break;
      case "Partly cloudy":
      case "Mostly cloudy":
      case "Cloudy":
      case "Overcast":
        conditionImage.src = "/weather-app/img/cloud.svg";
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
        break;
      case "Mist":
      case "Fog":
      case "Haze":
        conditionImage.src = "/weather-app/img/impaired.svg";
        break;
      default:
        conditionImage.src = "";
    }
    }
}

// Function to get the forecast for condition and temperature for the next eight hours based on the current time, across more than one day
function getHourlyForecast(currentHour) {
  const hourlyConditions = [];
  const hourlyTemps = [];
  let forecastIndex = 0;

  for (let hour = currentHour + 1; hour <= currentHour + 8; hour++) {
    const adjustedHour = hour % 24; // Adjust hour to be within 0-23 range
    const condition = forecast[forecastIndex].hour[adjustedHour].condition.text;
    const temperature = forecast[forecastIndex].hour[adjustedHour].temp_f;

    hourlyConditions.push(condition);
    hourlyTemps.push(temperature);

    if (adjustedHour < currentHour && forecastIndex === 0) {
      forecastIndex = 1;
    }
  }

    hourlyConditionsGlobal = hourlyConditions;
    hourlyTempsGlobal = hourlyTemps;
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

// Helper function to convert forecast time from 24-hour to 12-hour format for displaying
function convertTo12Hour(displayHour) {
  if (displayHour === 0) {
    clockFormat = 12;
    amPm = "am";
  }
  else if (displayHour > 12) {
    clockFormat = displayHour - 12;
    amPm = "pm";
  }
  else {
    clockFormat = displayHour;
    amPm = "am";
    return;
  }
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
    <div id="tempAndConditions">
      <div id="temp">
        <h1 id="degrees">${weatherData.current.temp_f}°F</h1>
        <img id="thermometer" src="" alt="Thermometer Image">
      </div>
      <div id="conditions">
        <h1 id="condition0">${weatherData.current.condition.text}</h1>
        <img id="conditionImage0" src="" alt="Weather Condition Image">
      </div>
    </div>
    <div class="lrData">
      <h2>Sunrise: </h2><h2 class="purp">${sunrise}</h2>
      <h2>Sunset: </h2><h2 class="purp">${sunset}</h2>
    </div>
    <div class="lrData">
      <h2>High of: </h2><h2 class="purp">${maxTemp}°F</h2>
      <h2>Humidity: </h2><h2 class="purp">${humidity}%</h2>
    </div>
    <div id="hourly">
      <div class="hour">
        <h2 class="purp" id="hour1">${clockFormat + 1}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[1]}</h3>
        <img id="conditionImage1" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[1]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour2">${clockFormat + 2}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[2]}</h3>
        <img id="conditionImage2" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[2]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour3">${clockFormat + 3}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[3]}</h3>
        <img id="conditionImage3" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[3]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour4">${clockFormat + 4}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[4]}</h3>
        <img id="conditionImage4" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[4]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour5">${clockFormat + 5}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[5]}</h3>
        <img id="conditionImage5" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[5]}°F</h3>
        </div>
      <div class="hour">
        <h2 class="purp" id="hour6">${clockFormat + 6}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[6]}</h3>
        <img id="conditionImage6" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[6]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour7">${clockFormat + 7}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[7]}</h3>
        <img id="conditionImage7" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[7]}°F</h3>
      </div>
    </div>

  `;
          // Update images
          dayNight(dayTime);
          conditionImage(conditionStatus);
          forecastImage(hourlyConditionsGlobal);
          updateHour();
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

// Function to get the hour from localtime in order to forecast based on current time
function getHour(timeData) {
  // Split the time string into an array of strings
  const timeParts = timeData.split(" ");

  // Get the hour string
  const hourString = timeParts[1];

  // Convert the hour string to an integer
  const hour = parseInt(hourString, 10);

  // Return the hour
  return hour;
}

// Functions to hide the arrows if forecasts for those days are not available
function hideYesterday() {
  const element = document.querySelector(".arrowL");
  element.style.visibility = "hidden";
}

function showYesterday() {
  const element = document.querySelector(".arrowL");
  element.style.visibility = "visible";
}

function hideTomorrow() {
  const element = document.querySelector(".arrowR");
  element.style.display = "hidden";
}

function showTomorrow() {
  const element = document.querySelector(".arrowR");
  element.style.visibility = "visible";
}

// Function to determine whether or not to hide the yesterday button
function hideYesterdayButton(dayForecast) {
  if (dayForecast === 0) {
    hideYesterday();
  } else {
    showYesterday();
  }
}

// Function to determine whether or not to hide the tomorrow button
function hideTomorrowButton(dayForecast) {
  if (dayForecast === 2) {
    hideTomorrow();
  } else {
    showTomorrow();
  }
}

// Function to show forecast data for the following day
function forecastData(dayForecast) {
  if (dayForecast === 1) {
    weatherDataContainer.innerHTML = `
      <h1 id="local">${area}, ${localRegion}</h1>
      <div id="time">
        <h3>12:00pm</h3>
        <img id="dayNightImage" src="/weather-app/img/sun.svg" alt="Day/Night Image">
      </div>
      <div id="tempAndConditions">
        <div id="temp">
          <h1 id="degrees">${tomorrowTemp} °F</h1>
          <img id="thermometer" src="" alt="Thermometer Image">
        </div>
        <div id="conditions">
          <h1 id="condition0">${tomorrowCondition}</h1>
          <img id="conditionImage0" src="" alt="Weather Condition Image">
        </div>
      </div>
      <div class="lrData">
        <h2>Sunrise: </h2><h2 class="purp">${tomorrowSunrise}</h2>
        <h2>Sunset: </h2><h2 class="purp">${tomorrowSunset}</h2>
      </div>
      <div class="lrData">
        <h2>High of: </h2><h2 class="purp">${tomorrowMaxtemp}°F</h2>
        <h2>Humidity: </h2><h2 class="purp">${tomorrowHumidity}%</h2>
      </div>
      <div id="hourly">
        <div class="hour">
          <h2 class="purp">10am</h2>
          <h3 id="condition1">${hour1Condition}</h3>
          <img id="conditionImage1" src="" alt="Forecast Condition Image">
          <h3>${hour1}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">11am</h2>
          <h3 id="condition2">${hour2Condition}</h3>
          <img id="conditionImage2" src="" alt="Forecast Condition Image">
          <h3>${hour2}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">12pm</h2>
          <h3 id="condition3">${hour3Condition}</h3>
          <img id="conditionImage3" src="" alt="Forecast Condition Image">
          <h3>${hour3}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">1pm</h2>
          <h3 id="condition4">${hour4Condition}</h3>
          <img id="conditionImage4" src="" alt="Forecast Condition Image">
          <h3>${hour4}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">2pm</h2>
          <h3 id="condition5">${hour5Condition}</h3>
          <img id="conditionImage5" src="" alt="Forecast Condition Image">
          <h3>${hour5}°F</h3>
          </div>
        <div class="hour">
          <h2 class="purp">3pm</h2>
          <h3 id="condition6">${hour6Condition}</h3>
          <img id="conditionImage6" src="" alt="Forecast Condition Image">
          <h3>${hour6}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">4pm</h2>
          <h3 id="condition7">${hour7Condition}</h3>
          <img id="conditionImage7" src="" alt="Forecast Condition Image">
          <h3>${hour7}°F</h3>
        </div>
      </div>

    `;
    // Add the thermometer image
    const thermometer = document.getElementById("thermometer");
    thermometer.src = "/weather-app/img/thermometer.svg";
    // Update conditions
    updateConditions();
  }
  else if (dayForecast === 2) {
    weatherDataContainer.innerHTML = `
      <h1 id="local">${area}, ${localRegion}</h1>
      <div id="time">
        <h3>12:00pm</h3>
        <img id="dayNightImage" src="/weather-app/img/sun.svg" alt="Day/Night Image">
      </div>
      <div id="tempAndConditions">
        <div id="temp">
          <h1 id="degrees">${dayAfterTemp} °F</h1>
          <img id="thermometer" src="" alt="Thermometer Image">
        </div>
        <div id="conditions">
          <h1 id="condition0">${dayAfterCondition}</h1>
          <img id="conditionImage0" src="" alt="Weather Condition Image">
        </div>
      </div>
      <div class="lrData">
        <h2>Sunrise: </h2><h2 class="purp">${dayAfterSunrise}</h2>
        <h2>Sunset: </h2><h2 class="purp">${dayAfterSunset}</h2>
      </div>
      <div class="lrData">
        <h2>High of: </h2><h2 class="purp">${dayAfterMaxTemp}°F</h2>
        <h2>Humidity: </h2><h2 class="purp">${dayAfterHumidity}%</h2>
      </div>
      <div id="hourly">
        <div class="hour">
          <h2 class="purp">10am</h2>
          <h3 id="condition1">${hour1ConditionDayAfter}</h3>
          <img id="conditionImage1" src="" alt="Forecast Condition Image">
          <h3>${hour1DayAfter}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">11am</h2>
          <h3 id="condition2">${hour2ConditionDayAfter}</h3>
          <img id="conditionImage2" src="" alt="Forecast Condition Image">
          <h3>${hour2DayAfter}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">12pm</h2>
          <h3 id="condition3">${hour3ConditionDayAfter}</h3>
          <img id="conditionImage3" src="" alt="Forecast Condition Image">
          <h3>${hour3DayAfter}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">1pm</h2>
          <h3 id="condition4">${hour4ConditionDayAfter}</h3>
          <img id="conditionImage4" src="" alt="Forecast Condition Image">
          <h3>${hour4DayAfter}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">2pm</h2>
          <h3 id="condition5">${hour5ConditionDayAfter}</h3>
          <img id="conditionImage5" src="" alt="Forecast Condition Image">
          <h3>${hour5DayAfter}°F</h3>
          </div>
        <div class="hour">
          <h2 class="purp">3pm</h2>
          <h3 id="condition6">${hour6ConditionDayAfter}</h3>
          <img id="conditionImage6" src="" alt="Forecast Condition Image">
          <h3>${hour6DayAfter}°F</h3>
        </div>
        <div class="hour">
          <h2 class="purp">4pm</h2>
          <h3 id="condition7">${hour7ConditionDayAfter}</h3>
          <img id="conditionImage7" src="" alt="Forecast Condition Image">
          <h3>${hour7DayAfter}°F</h3>
        </div>
      </div>

    `;
    // Add the thermometer image
    const thermometer = document.getElementById("thermometer");
    thermometer.src = "/weather-app/img/thermometer.svg";
    // Update conditions
    updateConditions();
  }
  else if (dayForecast === 0) {
    weatherDataContainer.innerHTML = `
    <h1 id="local">${city}, ${localRegion}</h1>
    <div id="time">
      <h3>${formattedTime}</h3>
      <img id="dayNightImage" src="" alt="Day/Night Image">
    </div>
    <div id="tempAndConditions">
      <div id="temp">
        <h1 id="degrees">${regularTemp}°F</h1>
        <img id="thermometer" src="" alt="Thermometer Image">
      </div>
      <div id="conditions">
        <h1 id="condition0">${conditionStatus}</h1>
        <img id="conditionImage0" src="" alt="Weather Condition Image">
      </div>
    </div>
    <div class="lrData">
      <h2>Sunrise: </h2><h2 class="purp">${sunrise}</h2>
      <h2>Sunset: </h2><h2 class="purp">${sunset}</h2>
    </div>
    <div class="lrData">
      <h2>High of: </h2><h2 class="purp">${maxTemp}°F</h2>
      <h2>Humidity: </h2><h2 class="purp">${humidity}%</h2>
    </div>
    <div id="hourly">
      <div class="hour">
        <h2 class="purp" id="hour1">${clockFormat + 1}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[1]}</h3>
        <img id="conditionImage1" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[1]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour2">${clockFormat + 2}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[2]}</h3>
        <img id="conditionImage2" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[2]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour3">${clockFormat + 3}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[3]}</h3>
        <img id="conditionImage3" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[3]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour4">${clockFormat + 4}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[4]}</h3>
        <img id="conditionImage4" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[4]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour5">${clockFormat + 5}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[5]}</h3>
        <img id="conditionImage5" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[5]}°F</h3>
        </div>
      <div class="hour">
        <h2 class="purp" id="hour6">${clockFormat + 6}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[6]}</h3>
        <img id="conditionImage6" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[6]}°F</h3>
      </div>
      <div class="hour">
        <h2 class="purp" id="hour7">${clockFormat + 7}${amPm}</h2>
        <h3>${hourlyConditionsGlobal[7]}</h3>
        <img id="conditionImage7" src="" alt="Forecast Condition Image">
        <h3>${hourlyTempsGlobal[7]}°F</h3>
      </div>
    </div>

  `;
  // Update images
  dayNight(dayTime);
  conditionImage(conditionStatus);
  forecastImage(hourlyConditionsGlobal);
  updateHour();
  // Add the thermometer image
  const thermometer = document.getElementById("thermometer");
  thermometer.src = "/weather-app/img/thermometer.svg";
  }
}

// Add event listeners to arrow buttons
// Add event listeners to arrow buttons
document.getElementById("yesterday").addEventListener("click", function () {
  if (dayForecast > 0) {
    dayForecast--; // Decrement dayForecast
    forecastData(dayForecast);
    hideYesterdayButton(dayForecast);
    hideTomorrowButton(dayForecast);
  }
});

document.getElementById("tomorrow").addEventListener("click", function () {
  if (dayForecast < 2) {
    dayForecast++;
    forecastData(dayForecast);
    hideYesterdayButton(dayForecast);
    hideTomorrowButton(dayForecast);
  }
});

// A new version of updating the forecast conditions images based on the innerHTML text
function updateConditions() {
    for (i = 0; i < 8; i++) {
    let conditionImage = document.getElementById(`conditionImage${i}`);
    let conditionText = document.getElementById(`condition${i}`).innerHTML;
    switch (conditionText) {
      case "Clear":
      case "Sunny":
      case "Fair":
        conditionImage.src = "/weather-app/img/sun.svg";
        break;
      case "Partly cloudy":
      case "Mostly cloudy":
      case "Cloudy":
      case "Overcast":
        conditionImage.src = "/weather-app/img/cloud.svg";
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
        break;
      case "Mist":
      case "Fog":
      case "Haze":
        conditionImage.src = "/weather-app/img/impaired.svg";
        break;
      default:
        conditionImage.src = "";
    }
    }
}

// A function where if the element with id="hour1" has innerHTML of 13, then the innerHTML changes to 1
function updateHour() {
  for (i = 1; i < 8; i++) {
    let hour = document.getElementById(`hour${i}`);
    if (hour.innerHTML == "13pm") {
      hour.innerHTML = "1am";
    } else if (hour.innerHTML == "14pm") {
      hour.innerHTML = "2am";
    } else if (hour.innerHTML == "15pm") {
      hour.innerHTML = "3am";
    } else if (hour.innerHTML == "16pm") {
      hour.innerHTML = "4am";
    } else if (hour.innerHTML == "17pm") {
      hour.innerHTML = "5am";
    } else if (hour.innerHTML == "18pm") {
      hour.innerHTML = "6am";
    } else if (hour.innerHTML == "19pm") {
      hour.innerHTML = "7am";
    } else if (hour.innerHTML == "20pm") {
      hour.innerHTML = "8am";
    } else if (hour.innerHTML == "21pm") {
      hour.innerHTML = "9am";
    } else if (hour.innerHTML == "22pm") {
      hour.innerHTML = "10am";
    } else if (hour.innerHTML == "23pm") {
      hour.innerHTML = "11am";
    } else if (hour.innerHTML == "24pm") {
      hour.innerHTML = "12am";
    } else if (hour.innerHTML == '13am') {
      hour.innerHTML = "1pm";
    } else if (hour.innerHTML == '14am') {
      hour.innerHTML = "2pm";
    } else if (hour.innerHTML == '15am') {
      hour.innerHTML = "3pm";
    } else if (hour.innerHTML == '16am') {
      hour.innerHTML = "4pm";
    } else if (hour.innerHTML == '17am') {
      hour.innerHTML = "5pm";
    } else if (hour.innerHTML == '18am') {
      hour.innerHTML = "6pm";
    } else if (hour.innerHTML == '19am') {
      hour.innerHTML = "7pm";
    }
  }
}