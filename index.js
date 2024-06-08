const container = document.querySelector(".container");
const forecastContainer = document.querySelector(".forecast-container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const currentTimeElement = document.getElementById("current-time");
const currentDateElement = document.getElementById("current-date");


function updateTimeAndDate() {
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  currentTimeElement.textContent = time;
  currentDateElement.textContent = date;
}


setInterval(updateTimeAndDate, 1000);
updateTimeAndDate();

search.addEventListener("click", () => {
  const APIKey = "2a3752ce4cc25f17c071393f51af7201";
  const city = document.querySelector(".search-box input").value;

  if (city === "") {
    forecastContainer.style.display = "none"; 
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.cod === "404") {
        container.style.height = "400px";
        weatherBox.classList.remove("active");
        weatherDetails.classList.remove("active");
        error404.classList.add("active");
        forecastContainer.style.display = "none"; 
        return;
      }

      container.style.height = "auto";
      weatherBox.classList.add("active");
      weatherDetails.classList.add("active");
      error404.classList.remove("active");
      forecastContainer.style.display = "block"; 

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");

      switch (json.weather[0].main) {
        case "Clear":
          image.src = "images/clear.png";
          break;
        case "Rain":
          image.src = "images/rain.png";
          break;
        case "Snow":
          image.src = "images/snow.png";
          break;
        case "Clouds":
          image.src = "images/cloud.png";
          break;
        case "Haze":
          image.src = "images/mist.png";
          break;
        case "Mist":
          image.src = "images/mist.png";
          break;
        default:
          image.src = "images/cloud.png";
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`
      )
        .then((response) => response.json())
        .then((forecastJson) => {
          const forecastDays = document.querySelectorAll(".forecast-day");

          forecastDays.forEach((element, index) => {
            if (index < 5) {
              const forecastData = forecastJson.list[index * 8]; 
              const date = new Date(forecastData.dt * 1000);
              element.querySelector(".day").textContent =
                date.toLocaleDateString([], { weekday: "long" });

              switch (forecastData.weather[0].main) {
                case "Clear":
                  element.querySelector("img").src = "images/clear.png";
                  break;
                case "Rain":
                  element.querySelector("img").src = "images/rain.png";
                  break;
                case "Snow":
                  element.querySelector("img").src = "images/snow.png";
                  break;
                case "Clouds":
                  element.querySelector("img").src = "images/cloud.png";
                  break;
                case "Haze":
                  element.querySelector("img").src = "images/mist.png";
                  break;
                case "Mist":
                  element.querySelector("img").src = "images/mist.png";
                  break;
                default:
                  element.querySelector("img").src = "images/cloud.png";
              }

              element.querySelector(
                ".temperature"
              ).innerHTML = `Temperature: ${parseInt(
                forecastData.main.temp
              )}<span>°C</span>`;
              element.querySelector(
                ".humidity"
              ).innerHTML = `Humidity: ${forecastData.main.humidity}%`;
              element.querySelector(
                ".wind-speed"
              ).innerHTML = `Wind Speed: ${parseInt(
                forecastData.wind.speed
              )} Km/h`;
            }
          });
        });
    });
});
