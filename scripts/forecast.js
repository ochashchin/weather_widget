const apiKey = "voxQOdjdcj1rEUsO24uExAA2aBMRk4Dr";

//get conditions data
const getConditions = async (code) => {

    const base = "http://dataservice.accuweather.com/currentconditions/v1/";

    const query = `${code}?apikey=${apiKey}`;

    const response = await fetch(base + query);

    return await response.json();
};

//get city data
const getCity = async (city) => {

    const base = "http://dataservice.accuweather.com/locations/v1/cities/search";

    const query = `?apikey=${apiKey}&q=${city}`;

    const response = await fetch(base + query);

    const data = await response.json();

    return data[0];
};



// console.log(getCity("antwerp").then(
//     result => {return getConditions(result.Key)}))

