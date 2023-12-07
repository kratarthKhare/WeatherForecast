
const userWeather = document.querySelector('.btn1');
const searchWeather = document.querySelector('.btn2');
const locationScreen = document.querySelector('.grant-location');
const loadingScreen = document.querySelector('.loading-container');
const weatherInfo = document.querySelector('.UserWeather');
const searchInp = document.querySelector('.searchWeather');
const grantAcess = document.querySelector('[data-grantAcess]');
const searchButton = document.querySelector('[data-searchButton]');
const errorBox = document.querySelector('.errorBox');
const inpBox = document.querySelector('.cityInp');

var API = "f2e37ab2feff1e806bebc1d68258be97";

var current = userWeather;
current.classList.add('clicked');
fetchStorage();

[userWeather,searchWeather].forEach((button) => { 
     button.addEventListener('click',buttonClicked);
});

grantAcess.addEventListener('click', getCoords);

searchButton.addEventListener('click', getData);

inpBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
          getData();
    }
  });

function buttonClicked(event)
{
    var newButton = event.target;

    if(current !== newButton)
    {
        errorBox.classList.remove('active');

        current.classList.remove('clicked');
        newButton.classList.add('clicked');
        current = newButton;

        if(searchWeather.classList.contains('clicked'))
        {
            locationScreen.classList.remove('active');
            weatherInfo.classList.remove('active');
            searchInp.classList.add('active');
        }

        else
        {
            searchInp.classList.remove('active');
            weatherInfo.classList.remove('active');
            fetchStorage();
        }
    }
}

function fetchStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    
    if(!localCoordinates)
       locationScreen.classList.add('active');

     else
     {
          const coordinates = JSON.parse(localCoordinates);
          fetchWeatherInfo(coordinates);
     }  
}

async function fetchWeatherInfo(data)
{
    
    if(typeof data == 'string')
    {
        console.log('string');
        var  url = `https://api.openweathermap.org/data/2.5/weather?q=${data}&APPID=${API}`;
    }
    else
    {
       console.log('object');
       const {lat,lon} = data;
       var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`;
    }

    locationScreen.classList.remove('active');
    loadingScreen.classList.add('active');
    
    try{
         
        const res = await fetch(`${url}`);
         
        if(!res.ok)
          throw new Error('some error');

        const data = await res.json();

        console.log(data);

        renderUI(data);
    }

    catch(e)
    {
        loadingScreen.classList.remove('active');
        weatherInfo.classList.remove('active');
        errorBox.classList.add('active');
    }
} 

function renderUI(data) {

    loadingScreen.classList.remove('active');
    weatherInfo.classList.add('active');
     
    const divContainer = document.querySelector('.headBox');

    const city = document.querySelector('[data-cityName]');
    city.innerHTML = `${data?.name}`;  
  
    const countryIcon = document.querySelector('[data-countryImage]');
    countryIcon.src = `https://flagcdn.com/32x24/${data?.sys?.country.toLowerCase()}.png`;

    const weatherType = divContainer.querySelector('[data-weatherDesc]');
    weatherType.innerHTML = `${data?.weather?.[0].main}`;

    const weatherImg = divContainer.querySelector('[data-weatherImage]');
    weatherImg.src = `https://openweathermap.org/img/wn/${data?.weather[0]?.icon}.png`;
   
    const temp = divContainer.querySelector('[data-temp]');
    temp.innerHTML = `${parseInt(data?.main?.temp - 273.15,10)}`+" °C";


    const windValue = document.querySelector('[data-windValue]');
    windValue.innerHTML = data?.wind?.speed + "m/s";

    const humidValue = document.querySelector('[data-humidityValue]');
    humidValue.innerHTML = data?.main?.humidity + "%";

    const cloudPer = document.querySelector('[data-cloudiness]');
    cloudPer.innerHTML = data?.clouds?.all + "%";
}

async function getCoords()
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
      } else {
        // errorbox.classList.add('active');
        // errorbox.innerHTML = "Geolocation feature do not exist";
      }  
}

function getPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

function showError(error) {

    const permission = document.querySelector('[data-updatePermission]');
     
    switch(error.code) {
      case error.PERMISSION_DENIED:
        permission.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        permission.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        permission.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        permission.innerHTML = "An unknown error occurred."
        break;
    }
  }

async function getData() {

    errorBox.classList.remove('active');
     
    var city = document.querySelector('.cityInp').value;
    if(city === "")
       return;

       fetchWeatherInfo(city);
 

    // loadingScreen.classList.add('active');  

    // try{ 
    //     const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API}`);

    //     if(!res.ok)
    //       throw new Error('Bad request maybe');

    //     var data = await res.json();
        
    //     console.log("data is => ", data);

    //     renderUI(data);

    // }
    // catch(e) 
    // {
    //     loadingScreen.classList.remove('active');
    //     console.log("Error occured" , e);
    // }
}


// const current = document.querySelector('.UserWeather');
// current.classList.add('active');

// async function getLocation()
// {
//     navigator.geolocation.getCurrentPosition(async(pos) => {
         
//           const lat = `${pos?.coords?.latitude}`;
//           const lon = `${pos?.coords.longitude}`;

//           let obj = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`);

//           obj = await obj.json();

//     });
// }

// function showCurrent(eve)
// {

//     const btn1 = document.querySelector('.btn1');
//     btn1.classList.add('clicked');

//     getLocation();

//     const btn2 = document.querySelector('.btn2');
//     btn2.classList.remove('clicked');

//      const current = document.querySelector('.UserWeather');
//      current.classList.add('active');

//      const city = document.querySelector('.searchWeather');
//      city.classList.remove('active');

//      const errorBox = document.querySelector('.error');
//     errorBox.classList.remove('active');
// }

// function showCity(eve)
// {

//     const btn1 = document.querySelector('.btn1');
//     btn1.classList.remove('clicked');


//     const btn2 = document.querySelector('.btn2');
//     btn2.classList.add('clicked');

//     const current = document.querySelector('.UserWeather');
//     current.classList.remove('active');

//     const city = document.querySelector('.searchWeather');
//     city.classList.add('active');

//     const errorBox = document.querySelector('.error');
//     errorBox.classList.remove('active');
// }


// var API = "f2e37ab2feff1e806bebc1d68258be97";

// console.log('before');




// //     navigator.geolocation.getCurrentPosition((pos) => {
// //       console.log(pos);
// //     }, showError);


// //   function showError(e)
// //   {
// //     console.log(e);
// //   }


