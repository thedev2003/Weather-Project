// Get the button element
const button = document.querySelector('button');
button.addEventListener('click', getWeather);

// add keydown eventListener on button to enable Enter key usage
const input = document.querySelector('input');
input.addEventListener('keydown', function (event) {
	if (event.key === 'Enter') getWeather();
});


// adjusting cursor position
// function setCursorPosition(inputElement, position) {
// 	if (inputElement.setSelectionRange) {
// 		// Modern browsers
// 		inputElement.focus();
// 		inputElement.setSelectionRange(position, position);
// 	} else if (inputElement.createTextRange) {
// 		// Older versions of Internet Explorer
// 		var range = inputElement.createTextRange();
// 		range.move('character', position);
// 		range.select();
// 	}
// }
// const inputField = document.querySelector('input');

// // Set cursor position to 5 when the input field gains focus
// inputField.addEventListener('focus', function() {
// 	setCursorPosition(inputField, 15);
// });



function getWeather() 
{
	const apiKey = '8c1508420f027b0272a1e3e6afe8760e';
	const city = document.getElementById('city').value;

	if (!city) {
		alert('Please enter a city');
		return;
	}

	const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
	const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

	fetch(currentWeatherUrl)
		.then(response => response.json())  // response in JSON format
		.then(data => {  // data in JavaScipt object format
			displayWeather(data); // if promise is resolved, call function to display weather
		}).catch(error => {
			console.error('Error fetching current weather data:', error);
			alert('Error fetching current weather data. Please try again.');
		});

	fetch(forecastUrl)
		.then(response => response.json())
		.then(data => {
			displayHourlyForecast(data.list); // if promise is resolved, call function to display weather
		}).catch(error => {
			console.error('Error fetching hourly forecast data:', error);
			alert('Error fetching hourly forecast data. Please try again.');
		});
}



function displayWeather(data)   // takes weather data object as input to display weather
{
	const tempDivInfo = document.getElementById('tempDiv');
	const weatherInfoDiv = document.getElementById('weatherInfo');
	const weatherIcon = document.getElementById('weatherIcon');
	const hourForecastDiv = document.getElementById('hourForecast');


	// Clear previous content
	weatherInfoDiv.innerHTML = '';
	hourForecastDiv.innerHTML = '';
	tempDivInfo.innerHTML = '';

	if (data.cod === '404') weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
	else {
		const cityName = data.name;
		const description = data.weather[0].description;
		weatherIcon.alt = description;
		const weatherHTML = `
			<p>${cityName}</p>
			<p>${description}</p>
		`;
		weatherInfoDiv.innerHTML = weatherHTML;
		


		const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
		const temperatureHTML = `
            <p>${temperature}°C</p>
		`;
		tempDivInfo.innerHTML = temperatureHTML;



		const iconCode = data.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
		weatherIcon.src = iconUrl;

		showImage();
	}
}

function showImage() 
{
	const weatherIcon = document.getElementById('weatherIcon');
	weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}


function displayHourlyForecast(hourData) 
{
	const hourForecastDiv = document.getElementById('hourForecast');

	const next24Hours = hourData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

	next24Hours.forEach(item => {
		const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
		const hour = dateTime.getHours();
		const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
		const iconCode = item.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

		const hourlyItemHtml = `
            <div class="hourItem">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

		hourForecastDiv.innerHTML += hourlyItemHtml;
	});
}