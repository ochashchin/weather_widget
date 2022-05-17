const cityForm = document.getElementById("cityForm");
const card = document.getElementById("card");
const details = document.getElementById("details");
const time = document.getElementById("time");
const icon = document.getElementById("icon");


const updateUI = (data) => {

    const cityCode = data.cityCode;
    const weather = data.weather[0];

    if (card.classList.contains("d-none")) {
        card.classList.remove("d-none");
    }

    //update icon
    let weatherIcon = `https://raw.githubusercontent.com/iamshaunjp/modern-javascript/4fa8460583b40f180fbb42126cb2c35c628dc629/weather_app/img/icons/${weather.WeatherIcon}.svg`;
    icon.setAttribute("src", weatherIcon);

    //update background 
    let dayOrNightBackground = `https://raw.githubusercontent.com/iamshaunjp/modern-javascript/4fa8460583b40f180fbb42126cb2c35c628dc629/weather_app/img/${weather.IsDayTime ? "day" : "night"}.svg`;
    time.setAttribute("src", dayOrNightBackground);

    //update text
    details.innerHTML = `
    <h5 class="my-3">${cityCode.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
    <div class="display-4 my-4">
        <span>${weather.Temperature.Metric.Value}</span>
        <span>&deg;</span>
    </div>
    `;
};

const updateCity = async (city) => {

    let cityCode = await getCity(city);

    const weather = await getConditions(cityCode.Key);

    // return {
    //     cityCode: cityCode,
    //     weather: weather
    // }

    // shorthand notation
    return {
        cityCode, weather
    }
}


cityForm.addEventListener('submit', e => {
    e.preventDefault();

    let city = cityForm.city.value.trim();

    cityForm.reset();

    updateCity(city)
        .then(data => updateUI(data));
});