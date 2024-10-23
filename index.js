// Function to fetch and display weather data
function fetchWeather(city = 'Chennai') {
  const apikey = 'ac73eb7595344fcd99643605242110';
  const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&days=7&aqi=yes&alerts=no`;

  fetch(apiUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('City not found');
      }
    })
    .then(data => {
      document.getElementById('city').textContent = ` ${data.location.name}, ${data.location.region}, ${data.location.country}`;
      document.getElementById('condition').textContent = `Condition: ${data.current.condition.text}`;
      document.getElementById('temp').textContent = `${data.current.temp_c} °C`;
      document.getElementById('forecast').textContent = ` ${data.current.feelslike_c} °C`;
      document.getElementById('humidity').textContent = ` ${data.current.humidity} %`;
      document.getElementById('wind').textContent = `${data.current.wind_kph} km/h`;
      document.getElementById('uv').textContent = `${data.current.uv}`;
      document.getElementById('icon').src = data.current.condition.icon;

      document.getElementById('max-temp').textContent = `Max: ${data.forecast.forecastday[0].day.maxtemp_c} °C / `;
      document.getElementById('min-temp').textContent = ` Min: ${data.forecast.forecastday[0].day.mintemp_c} °C`;

      const carouselContainer = document.querySelector('.hours-card-crousel');
      carouselContainer.innerHTML = '';
      if (!carouselContainer) {
        console.error("Carousel container not found!");
        return;
      }

      data.forecast.forecastday[0].hour.forEach(hourData => {
        const time = hourData.time.split(' ')[1]; // Extracting only the hour part
        const temp = hourData.temp_c;
        const icon = hourData.condition.icon;

        // Generate HTML for the current hour card and append it to the carousel container
        carouselContainer.innerHTML += generateHourCard(time, icon, temp);
      });

      function generateHourCard(time, icon, temp) {
        return `
          <div>
            <p>${time}</p>
            <img src="${icon}" alt="Weather icon">
            <p>${temp}°C</p>
          </div>
        `;
      }

      const forecastDays = data.forecast.forecastday;
      const forecastContainer = document.getElementById('forecast-container');

      forecastContainer.innerHTML = '';

      forecastDays.forEach(day => {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.day.condition.icon;

        const forecastHTML = `
          <div class="forecast-day">
            <div class="day">${date}</div>
            <div class="temp">${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</div>
            <div class="weather">
              <img src="${icon}" alt="icon">
            </div>
          </div>
        `;

        forecastContainer.innerHTML += forecastHTML;
      });

    })
    .catch(error => {
      console.error(error);
      alert('Error fetching data. Please try again.');
    });
}

// Fetch weather data for Chennai on page load
window.addEventListener('load', function () {
  fetchWeather(); // Default to Chennai on load
});

 
document.getElementById('submit').addEventListener('click', function () {
  const city = document.getElementById('search').value || 'Chennai'; // Default to Chennai if input is empty
  fetchWeather(city);
});

// Add event listener for Enter key
document.getElementById('search').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const city = document.getElementById('search').value || 'Chennai'; // Default to Chennai if input is empty
    fetchWeather(city);
  }
});

