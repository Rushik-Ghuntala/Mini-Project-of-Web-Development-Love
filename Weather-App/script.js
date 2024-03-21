
// console.log('Hello Jee Babbar')

// const APIkey = `3f92af6fd40eaf17c5abf3a226eb150a`;


// async function fetchWeatherDetails(){

//     try{
//         let city = 'surat';

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`);

//         const data = await response.json();

//         console.log("Weather Data: -> " ,data)

//         // let newPara = document.createElement('p')

//         // newPara.textContent = `${data?.main?.temp.toFixed(2)} C`;
//         // document.body.appendChild(newPara)
//     }
//     catch(err){
//         //handle the error
//         console.log('Error Throw: -> ', err)
//     }
// }


const userTab = document.querySelector('[data-userWeather]')
const searchTab = document.querySelector('[data-searchWeather]')
const userContainer = document.querySelector('.weather-contaier')

const grantAccessContainer = document.querySelector('.grant-location-container')

const searchForm = document.querySelector('[data-searchForm]')

const loadingScreen = document.querySelector('.loading-container')

const userInfoContainer = document.querySelector('.user-info-container')

const errorMsg = document.querySelector('[data-error]')


// By Default Application is opened in Your Weather Tab
let currentTab = userTab;
const APIkey = `3f92af6fd40eaf17c5abf3a226eb150a`;

currentTab.classList.add('current-tab');
getFromSessionStorage();


// Switching between userTab and SearchTab

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active')){
            //kya search from vala container invisible, then make it visible 
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('avtive');
            searchForm.classList.add('active');
        }
        else{
            // i am oe searchWeather Tab now visible the Your Weather Tab...
            searchForm.classList.remove('active')
            userInfoContainer.classList.remove('active')
            //ab me your weather tab me aa gaya hu, to weather ko display karna padega
            //so let's check local storage first for coordinates, if we are saved they them
            getFromSessionStorage();
        }
    }
}


userTab.addEventListener('click', () => {
    //paased clicked tab parameter
    switchTab(userTab);
})

searchTab.addEventListener('click', () => {
    //paased clicked tab parameter
    switchTab(searchTab);
})


//checked if oordinates arealready present in session storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        //agr local coordintaed nai mile
        grantAccessContainer.classList.add('active')
    }
    else{
        //agr local coordinated pade hue hain
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove('active')
    //make loader screen active
    loadingScreen.classList.add('active')

    //call API
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
        );
        const data = await response.json();
        
        loadingScreen.classList.remove('active')
        userInfoContainer.classList.add('active')

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove('active')
        //HW
        console.log("Location Spelling Not right")
    }
}


function renderWeatherInfo(weatherInfo){
    //first, we have to fetch the elements.... 

    const cityName = document.querySelector('[data-cityname]')
    const countryIcon = document.querySelector('[data-countryIcon]')
    const desc = document.querySelector('[data-weatherDesc]')
    const weatherIcon = document.querySelector('[data-weatherIcon]')
    const temo = document.querySelector('[data-temp]')
    const windSpeed = document.querySelector('[data-windSpeed]')
    const humidity = document.querySelector('[data-humidity]')
    const cloud = document.querySelector('[data-cloud]')

    //fetch values from weatherInfo object and put in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temo.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloud.innerText = `${weatherInfo?.clouds?.all} %`;

}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HW -> show and alert for no geoLocation support
        console.log("Location Geolocation not support")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    //session storage me store kardo is item ko
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}



const grantAccessButton = document.querySelector('[data-grantAccess')
grantAccessButton.addEventListener('click', getLocation);


const searchInput = document.querySelector('[data-searchInput')

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
         return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active')
    userInfoContainer.classList.remove('active')
    grantAccessContainer.classList.remove('active')

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`
        );

        if (!response.ok) {
            loadingScreen.classList.remove('active')
            errorMsg.classList.add('active')
            throw new Error(`HTTP error! status: ${response.status}`);

            // City not found or other error occurred
            // throw new Error('City not found');
        }

        const data = await response.json();

        loadingScreen.classList.remove('active')
        userInfoContainer.classList.add('active')
        renderWeatherInfo(data)
    }
    catch(err){
        console.error('Error fetching weather data:', err);
    }
}

