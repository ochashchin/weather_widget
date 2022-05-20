const cityForm = document.getElementById("cityForm");
const card = document.getElementById("card");
const details = document.getElementById("details");
const time = document.getElementById("time");
const icon = document.getElementById("icon");

let throttling = true;

const updateUI = (cityObj) => {

    console.log("updateUI")
    console.log(cityObj)

    const cityCode = cityObj.city;
    const weather = cityObj.weather[0];

    console.log("updateUI")
    console.log(cityObj)

    if (card.classList.contains("d-none")) {
        card.classList.remove("d-none");
    }
    if(card.classList.contains("active")){
        card.classList.remove("active");
    }
    card.classList.toggle('active');

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

    console.log("updateCity");
    console.log(city);

    const weather = await getConditions(city.Key);

    console.log("weather");
    console.log(weather);

    return {
        city: city,
        weather: weather
    }
}

cityForm.city.addEventListener("input", e => {
    // e.preventDefault();

    let city = cityForm.city.value.trim();

    runThrottling(city);
});

function runThrottling(city) {

    if (throttling === true) {

        suggestCity(city);

        throttling = false;
        setTimeout(function () {
            throttling = true;
        }, 100)
    }
}

const suggestCity = (city) => {

    getCity(city)
        .then((listCity) => {

            addDropDown(listCity)

        });
}

function removeAutofill() {
    let autofill = document.getElementById("autofill");

    if (document.body.contains(autofill)) {
        autofill.remove();
    }
}

const addDropDown = async (list) => {

    let container = cityForm.parentElement;

    let id = null;

    removeAutofill();

    if (list !== undefined) {
        let ulist = document.createElement('ul');
        ulist.id = 'autofill';
        ulist.style.position = 'absolute';
        ulist.style.left = cityForm.getElementsByTagName("input").offsetLeft;
        ulist.style.top = cityForm.getElementsByTagName("input").offsetTop;
        ulist.style.zIndex = "1";
        ulist.style.width = cityForm.offsetWidth;
        ulist.className = "list-group text-light";

        for (let i = 0; i < list.length; i++) {
            let listItem = document.createElement('li');
            listItem.id = i;
            listItem.className = "list-group-item btn d-flex justify-content-between align-items-center";
            listItem.textContent = `${list[i].AdministrativeArea.LocalizedName}`;
            ulist.appendChild(listItem);
        }

        cityForm.appendChild(ulist);

        ulist.addEventListener("click", (e) => {
            e.preventDefault();
            cityForm.city.value = list[e.target.id].AdministrativeArea.EnglishName;
            removeAutofill();

            getCity(cityForm.city.value)
                .then((listCity) => {

                    finalSearch(listCity[0]);

                });
        });
    }
}

const finalSearch = (city) => {
    console.log("finalSearch")
    console.log(city)

    updateCity(city)
        .then(data => updateUI(data))
        .catch(
            (error) => {
                isError = true
            }
        );
}

const dropDownsSelection = async (ulist) => {
    ulist.addEventListener("click", (e) => {
        removeAutofill();
        return e.target.id;
    });
}

cityForm.addEventListener('submit', e => {
    e.preventDefault();

    let city = cityForm.city.value.trim();

    removeAutofill();

    cityForm.reset();

    updateCity(city)
        .then(data => updateUI(data))
        .catch(
            (error) => {
                isError = true
            }
        );

    if (localStorage.getItem("city") === null) {
        localStorage.setItem("city", city);
    } else {
        if (isError === false) {
            localStorage.setItem("city", city);
        }
    }
});

const readCity = () => {
    let city;

    if (localStorage.getItem("city") !== null) {
        city = localStorage.getItem("city", city);

        updateCity(city)
            .then(data => updateUI(data));

        if (card.classList.contains("d-none")) {
            card.classList.remove("d-none");
        }
        if(card.classList.contains("active")){
            card.classList.remove("active");
        }
        card.classList.toggle('active');
    }
};

readCity();
