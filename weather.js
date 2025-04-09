// API Configuration
const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; // Replace with your API Key

// DOM Elements
const cityInput = $('#city-input');
const cityName = $('#city-name');
const dateElement = $('#date');
const weatherIcon = $('#weather-icon');
const temperature = $('#temperature');
const description = $('#description');
const windSpeed = $('#wind-speed');
const humidity = $('#humidity');
const pressure = $('#pressure');
const weatherInfo = $('#weather-info');

// Initialize with default city
$(document).ready(function() {
    getWeather('Pune');
    
    // Add event listener for Enter key
    cityInput.keypress(function(e) {
        if (e.which === 13) {
            getWeather();
        }
    });
});

// Main weather function
async function getWeather(city) {
    const cityName = city || cityInput.val().trim();
    
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    
    const apiUrl = `${url}?q=${cityName}&appid=${apiKey}&units=metric`;
    
    try {
        showLoading();
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (response.ok) {
            displayWeather(data);
        } else {
            showError(data.message || 'City not found. Please try again.');
        }
    } catch (error) {
        showError('Failed to fetch weather data. Please check your connection.');
        console.error('Error:', error);
    }
}

// Display weather data
function displayWeather(data) {
    // Main info
    cityName.text(data.name + ', ' + data.sys.country);
    dateElement.text(moment().format('dddd, MMMM Do YYYY | h:mm A'));
    temperature.html(`${Math.round(data.main.temp)}<span>°C</span>`);
    description.text(data.weather[0].description);
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.attr('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
    weatherIcon.attr('alt', data.weather[0].main);
    
    // Additional details
    windSpeed.text(`${data.wind.speed} m/s`);
    humidity.text(`${data.main.humidity}%`);
    pressure.text(`${data.main.pressure} hPa`);
    
    // Change background based on weather
    updateBackground(data.weather[0].main);
    
    // Show weather info
    weatherInfo.fadeIn();
}

// Show loading state
function showLoading() {
    weatherInfo.hide();
    // You could add a loading spinner here
}

// Show error message
function showError(message) {
    alert(message);
    weatherInfo.hide();
}

// Update background based on weather condition
function updateBackground(weatherCondition) {
    const body = $('body');
    let gradient;
    
    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            gradient = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            break;
        case 'clouds':
            gradient = 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
            break;
        case 'rain':
            gradient = 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)';
            break;
        case 'snow':
            gradient = 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)';
            break;
        case 'drizzle':
            gradient = 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            gradient = 'linear-gradient(135deg, #bdc3c7 0%, #cfd9df 100%)';
            break;
        default:
            gradient = 'linear-gradient(135deg, #4361ee 0%, #3f37c9 50%, #4cc9f0 100%)';
    }
    
    body.css('background', gradient);
}