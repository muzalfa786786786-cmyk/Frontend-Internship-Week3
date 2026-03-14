const API_KEY = 'a0f8b83e4cfaeb293e95d065df0f11d0'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ===== DOM ELEMENTS =====
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorDiv = document.getElementById('errorMsg');
const cityDisplay = document.getElementById('cityDisplay');
const tempDisplay = document.getElementById('tempDisplay');
const conditionDisplay = document.getElementById('conditionDisplay');
const iconDisplay = document.getElementById('iconDisplay');
const humidityDisplay = document.getElementById('humidityDisplay');
const windDisplay = document.getElementById('windDisplay');
const forecastContainer = document.getElementById('forecast');

// ===== HELPER FUNCTIONS =====
const toCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

// Map OpenWeather icon codes to Font Awesome classes
const getIconClass = (iconCode) => {
    const map = {
        '01d': 'fa-sun', '01n': 'fa-moon',
        '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
        '03d': 'fa-cloud', '03n': 'fa-cloud',
        '04d': 'fa-cloud', '04n': 'fa-cloud',
        '09d': 'fa-cloud-rain', '09n': 'fa-cloud-rain',
        '10d': 'fa-cloud-sun-rain', '10n': 'fa-cloud-moon-rain',
        '11d': 'fa-cloud-bolt', '11n': 'fa-cloud-bolt',
        '13d': 'fa-snowflake', '13n': 'fa-snowflake',
        '50d': 'fa-smog', '50n': 'fa-smog'
    };
    return map[iconCode] || 'fa-cloud-sun';
};

// Show/hide error
const showError = (message) => {
    errorDiv.style.display = 'block';
    errorDiv.textContent = message;
};
const hideError = () => {
    errorDiv.style.display = 'none';
};

// ===== FETCH WEATHER DATA =====
async function fetchWeather(city) {
    // Check API key
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
        showError('⚠️ Please set a valid API key in script.js (get one from openweathermap.org)');
        return;
    }

    hideError();

    try {
        // 1. Current weather
        const weatherRes = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`
        );
        if (!weatherRes.ok) {
            if (weatherRes.status === 404) throw new Error('City not found');
            else throw new Error('Failed to fetch weather');
        }
        const weatherData = await weatherRes.json();

        // 2. 5-day forecast (3-hour intervals)
        const forecastRes = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`
        );
        if (!forecastRes.ok) throw new Error('Forecast unavailable');
        const forecastData = await forecastRes.json();

        // Update UI
        updateCurrentWeather(weatherData);
        updateForecast(forecastData.list);
    } catch (err) {
        showError(err.message);
        console.error(err);
    }
}

// ===== UPDATE CURRENT WEATHER UI =====
function updateCurrentWeather(data) {
    const { name, sys, main, weather, wind } = data;
    cityDisplay.textContent = `${name}, ${sys.country}`;
    tempDisplay.textContent = toCelsius(main.temp) + '°C';
    conditionDisplay.textContent = weather[0].description;
    humidityDisplay.textContent = main.humidity + '%';
    // Convert wind speed from m/s to km/h
    windDisplay.textContent = (wind.speed * 3.6).toFixed(1) + ' km/h';

    const iconClass = getIconClass(weather[0].icon);
    iconDisplay.innerHTML = `<i class="fas ${iconClass}"></i>`;
}

// ===== UPDATE 5-DAY FORECAST UI =====
function updateForecast(forecastList) {
    // Group forecast items by date (YYYY-MM-DD)
    const dailyMap = {};
    forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; // "2025-04-07"
        if (!dailyMap[date]) dailyMap[date] = [];
        dailyMap[date].push(item);
    });

    // Get the next 5 days (skip today if you want, but we'll take first 5)
    const dates = Object.keys(dailyMap).sort();
    const fiveDays = dates.slice(0, 5);

    let html = '';
    fiveDays.forEach(date => {
        // Choose forecast closest to 12:00 PM
        const items = dailyMap[date];
        let selected = items[0];
        let minDiff = Infinity;
        items.forEach(item => {
            const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
            const diff = Math.abs(hour - 12);
            if (diff < minDiff) {
                minDiff = diff;
                selected = item;
            }
        });

        const dayName = new Date(selected.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const iconClass = getIconClass(selected.weather[0].icon);
        const temp = toCelsius(selected.main.temp) + '°C';

        html += `
            <div class="forecast-item">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon"><i class="fas ${iconClass}"></i></div>
                <div class="forecast-temp">${temp}</div>
            </div>
        `;
    });

    forecastContainer.innerHTML = html;
}

// ===== EVENT LISTENERS =====
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ===== LOAD DEFAULT CITY ON PAGE START =====
window.addEventListener('load', () => {
    // Only fetch if API key is provided
    if (API_KEY && API_KEY !== 'YOUR_API_KEY') {
        fetchWeather('London');
    } else {
        showError('⚠️ Please set your OpenWeatherMap API key in script.js');
    }
});