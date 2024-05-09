const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const locationContainer = document.getElementById("location-container");
const fiveDayForecastContainer = document.getElementById("five-day-forecast");
const weatherIcons = {
    '01d': '01d.png',
    '01n': '02n.png',
    '02d': '02d.png',
    '02n': '02n.png',
    '03d': '03d.png',
    '03n': '03n.png',
    '04d': '04d.png',
    '04n': '04n.png',
    '05d': '05d.png',
    '05n': '05n.png',
    '06d': '06d.png',
    '06n': '06n.png',
    '07d': '07d.png',
    '07n': '07n.png',
}

// Fetch OpenWeather API Data
searchButton.addEventListener("click", function() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        alert("Please enter a city name");
        return;
    }
    
    const apiKey = 'c6021cca7cb97529c866b57c8cbba654';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=imperial`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${apiKey}&units=imperial`;

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

// Retrieve Location Card Forecast Data
function displayWeatherData(weatherData) {
    const cityName = weatherData.name;
    const temperature = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const weatherIconCode = weatherData.weather[0].icon;

    let storedData = {
        cityName: cityName,
        temperature: temperature,
        windSpeed: windSpeed,
        humidity: humidity,
        weatherIconCode: weatherIconCode
    }

    const weatherDataJSON = JSON.stringify(storedData);

    localStorage.setItem(cityName, weatherDataJSON)

    // Console test
    console.log(`City: ${cityName}`);
    console.log(`Temperature: ${temperature}°F`);
    console.log(`Wind Speed: ${windSpeed} mph`);
    console.log(`Humidity: ${humidity}%`);

    const weatherIconUrl = `https://openweathermap.org/img/w/${weatherIconCode}.png`

    createLocationCard(cityName, temperature, windSpeed, humidity, weatherIconUrl);
    createSearchHistoryCard(cityName);
}

// Retrieve Five Day Forecast Card Data
function displayFiveDayCards(forecastData, cityName) {
    const forecasts = forecastData.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
    const weatherIconCode = forecasts[0].weather[0].icon;
    console.log(forecastData);
    const weatherIconUrl = `https://openweathermap.org/img/w/${weatherIconCode}.png`

    let storedFiveDayData = {
        forecasts: forecasts,
        weatherIconCode: weatherIconCode
    }

    const weatherFiveDayDataJSON = JSON.stringify(storedFiveDayData);

    localStorage.setItem(cityName, weatherFiveDayDataJSON)

    fiveDayForecastContainer.innerHTML = '';

    forecasts.slice(0, 5).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        createForecastCard(date,temperature, windSpeed, humidity, weatherIconUrl);
    });
}

// Create Location Card
function createLocationCard(cityName, temperature, windSpeed, humidity, weatherIconUrl) {
    let existingCard = document.getElementById('location-card');
    let date = new Date()
    let month = date.getMonth() +1;
    let day = date.getDate();
    let year = date.getFullYear();
    let currentDate = `${month}/${day}/${year}`;

    if (existingCard) {
        existingCard.innerHTML = `
            <div class="location-header">
                <h3>${cityName} (${currentDate})</h3>
                <img src="${weatherIconUrl}" alt="Weather Icon">
            </div>
            <p>Temperature: ${temperature}°F</p>
            <p>Wind Speed: ${windSpeed} mph</p>
            <p>Humidity: ${humidity}%</p>
        `;
    } else {
        let locationCard = document.createElement('div');
        locationCard.id = 'location-card';
        locationCard.classList.add('location-card');
        locationCard.innerHTML = `
        <div class="location-header">
            <h3>${cityName} (${currentDate})</h3>
            <img src="${weatherIconUrl}" alt="Weather Icon">
        </div>
        <p>Temperature: ${temperature}°F</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <p>Humidity: ${humidity}%</p>
        `;

        locationContainer.appendChild(locationCard);
    };
}

// Create Five Day Forecast Cards
function createForecastCard(date, temperature, windSpeed, humidity, weatherIconUrl) {
    let gapContainer = document.createElement('div');
    gapContainer.classList.add('gap-container');

    let forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
        <h3>${date.toLocaleDateString()}</h3>
        <img src="${weatherIconUrl}" alt="Weather Icon">
        <p>Temperature: ${temperature}°F</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <p>Humidity: ${humidity}%</p>
    `;
    gapContainer.appendChild(forecastCard);
    fiveDayForecastContainer.appendChild(gapContainer);
}

// Create Search History Cards
function createSearchHistoryCard(cityName) {
    let searchCard = document.createElement('div')
    searchCard.classList.add('search-card');

    let searchHistoryContent = document.createElement('h3');
    searchHistoryContent.textContent = cityName;

    searchCard.appendChild(searchHistoryContent);
    document.getElementById('search-history').appendChild(searchCard);
}