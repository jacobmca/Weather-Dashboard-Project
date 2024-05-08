const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const locationContainer = document.getElementById("location-container");
const fiveDayForecastContainer = document.getElementById("five-day-forecast");

searchButton.addEventListener("click", function() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        alert("Please enter a city name");
        return;
    }
    
    const apiKey = 'c6021cca7cb97529c866b57c8cbba654';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${apiKey}&units=metric`;

    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to fetch weather data');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            alert('Error fetching weather data');
            console.error(error);
        });

    fetch(forecastApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to fetch forecast data');
            }
            return response.json();
        })
        .then(data => {
            displayFiveDayCards(data);
        })
        .catch(error => {
            alert('Error fetching forecast data');
            console.error(error);
        });
});

function displayWeatherData(weatherData) {
    const cityName = weatherData.name;
    const temperature = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;

    //Console test - delete later
    console.log(`City: ${cityName}`);
    console.log(`Temperature: ${temperature}°C`);
    console.log(`Wind Speed: ${windSpeed} m/s`);
    console.log(`Humidity: ${humidity}%`);

    createLocationCard(cityName, temperature, windSpeed, humidity);
    createSearchHistoryCard(cityName);
}

//Create Five Day Forecast
function displayFiveDayCards(forecastData) {
    const forecasts = forecastData.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    fiveDayForecastContainer.innerHTML = '';

    forecasts.slice(0, 5).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        createForecastCard(date,temperature, windSpeed, humidity);
    });
}

//Use this to create a location card on the left hand side
function createLocationCard(cityName, temperature, windSpeed, humidity) {
    let existingCard = document.getElementById('location-card');

    if (existingCard) {
        existingCard.innerHTML = `
            <h3>${cityName}</h3>
            <p>Temperature: ${temperature}°C</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;
    } else {
        let locationCard = document.createElement('div');
        locationCard.id = 'location-card';
        locationCard.classList.add('location-card');
        locationCard.innerHTML = `
        <h3>${cityName}</h3>
        <p>Temperature: ${temperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
        `;

        locationContainer.appendChild(locationCard);
    };
}

function createForecastCard(date, temperature, windSpeed, humidity) {
    let forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
        <h3>${date.toLocaleDateString()}</h3>
        <p>Temperature: ${temperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
    `;
    fiveDayForecastContainer.appendChild(forecastCard);
}

// Create Search History Cards
function createSearchHistoryCard(cityName) {
    let searchHistoryCard = document.createElement('div');
    searchHistoryCard.classList.add('search-history');
    searchHistoryCard.innerHTML = `
        <h3>${cityName}</h3>
    `;
    document.getElementById('search-history').appendChild(searchHistoryCard);
}

