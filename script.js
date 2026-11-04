cityInput = document.getElementById('cityInput');
searchButton = document.getElementById('searchButton');
weatherDisplay = document.getElementById('weatherDisplay'); 
statusMessage = document.getElementById('statusMessage');
locationName = document.getElementById('locationName');
temperatureDisplay = document.getElementById('temperatureDisplay');
conditionDisplay = document.getElementById('conditionDisplay');
windDisplay = document.getElementById('windDisplay');
humidityDisplay = document.getElementById('humidityDisplay');

searchButton.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
async function handleSearch(){
    const cityName = cityInput.value.trim();
    if(cityName === ""){
        alert("Please enter a city name.");
        return;
    }

    try{
        showStatus("Fetching data...");

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City location not found.");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Weather data not found.");
        }
        const weatherData = weatherResponse.json();

        if (!weatherData || !weatherData.current) {
            throw new Error("Weather data is incomplete.");
        }

        // Step 3: Manipulate DOM and trigger visual adjustments
        updateDOM(name, country || '', weatherData.current);

    } catch (error) {
        showStatus(error.message || "An unexpected network error occurred.");
        weatherDisplay.classList.add('hidden');
    }
}

function updateDOM(city, country, weather) {
    statusMessage.classList.add("hidden");
    weatherDisplay.classList.remove("hidden");

    locationName.textContent = `${city}, ${country}`;
    temperatureDisplay.textContent = `${weather.temperature_2m} °C`;
    conditionDisplay.textContent = `Condition: ${weather.weather_code}`;
    windDisplay.textContent = `Wind Speed: ${weather.wind_speed_10m} m/s`;
    humidityDisplay.textContent = `Humidity: ${weather.relative_humidity_2m} %`;
}

function showStatus(message) {
    statusMessage.textContent = message;
    statusMessage.classList.remove("hidden");
}


