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

function handleSearch(){
    const cityName = cityInput.value.trim();
    if(cityName === ""){
        alert("Please enter a city name.");
        return;
    }
    showStatus("Fetching weather data...");

    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

    fetch(geoURL)
        .then((response) => response.json())
        .then((geoData) => {

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("City location not found.");
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

            return fetch(weatherURL)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Weather data not found.");
                    }
                    return response.json();
                })
                .then((weatherData) => {

                    if (!weatherData.current) {
                        throw new Error("Weather data is incomplete.");
                    }
            updateDOM(name, country || '', weatherData.current);

                });
        })
        .catch((error) => {
            showStatus(error.message || "An unexpected network error occurred.");
            weatherDisplay.classList.add('hidden');
        });

}

function updateDOM(city, country, weather) {
    statusMessage.classList.add("hidden");
    weatherDisplay.classList.remove("hidden");

    locationName.textContent = `Current Location: ${city}, ${country}`;
    temperatureDisplay.textContent = `Current temperature: ${weather.temperature_2m} °C`;
    conditionDisplay.textContent = `Condition: ${weather.weather_code}`;
    windDisplay.textContent = `Wind Speed: ${weather.wind_speed_10m} m/s`;
    humidityDisplay.textContent = `Humidity: ${weather.relative_humidity_2m} %`;
    statusMessage.textContent = "Location and weather data fetched successfully.";
}

function showStatus(message) {
    statusMessage.textContent = message;
    statusMessage.classList.remove("hidden");
}


