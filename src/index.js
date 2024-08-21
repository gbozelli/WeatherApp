import { createApi } from 'unsplash-js';


const apiKey = "bSpo2yv3qJI7R5pwxR2u";

let temperature = 'F';

let processedData;

let adress;

const background = document.querySelector('#background');

const submit = document.querySelector('#submit');

const changeTemp = document.querySelector('#changeTemp');

const searchBox = document.querySelector('#location');

const options = document.querySelector('.options').children;

async function getData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=NVMFQ3NAJSPXZF28XR7DRFV3U`, {mode: 'cors'})
  const data = await response.json();
  return data;
}

async function getImg (photoQuery){
  const unsplash = createApi({
    accessKey: 'R5Z6qx-F_KvpcHEPFi4dkTzdXR0Vv5LnK20iTbyUXBg',
  });

  const imgjson = await (await unsplash.photos.getRandom({ query: photoQuery })).response.urls.raw;
  console.log(imgjson);
  return imgjson;
};

function getCurrentCondition(data){
  const currentDay = {
    condition: data.conditions, 
    icon: data.icon, 
    temp: data.temp, 
    feelslike: data.feelslike, 
    humidity: data.humidity,
    datetime: data.datetime
  };
  return currentDay;
}

function getDaysCondition(data){
  let days = []
  for(let i = 0; i < 14; i++){
    days.push({
      temp: data[i].temp, 
      icon: data[i].icon,
      date:data[i].datetime
    });
  }
  return days;
}

function getHoursCondition(data){
  let hours = [];
  for(let i = 0; i < 24; i++){
    hours.push({
      temp:data[i].temp, 
      icon:data[i].icon, 
      date:data[i].datetime
    });
  }
  return hours;
}

function processData(data) {
  const currentConditions = getCurrentCondition(data.currentConditions);
  const hoursConditions = getHoursCondition(data.days[0].hours);
  const daysConditions = getDaysCondition(data.days);
  return {currentConditions, hoursConditions, daysConditions};
}

function tempScale(processedData){
  if(temperature === 'F'){
    processedData.currentConditions.temp = Math.trunc(9/5 * processedData.currentConditions.temp + 32);
    for(let i = 0; i < 24; i++){
      processedData.hoursConditions[i].temp = Math.trunc(9/5 * processedData.hoursConditions[i].temp + 32);
    }
    for(let i = 0; i < 14; i++){
      processedData.daysConditions[i].temp = Math.trunc(9/5 * processedData.daysConditions[i].temp + 32);
    }
  } else {
    processedData.currentConditions.temp = Math.trunc(5/9 * processedData.currentConditions.temp - 32*5/9);
    for(let i = 0; i < 24; i++){
      processedData.hoursConditions[i].temp = Math.trunc(5/9 * processedData.hoursConditions[i].temp - 32*5/9);
    }
    for(let i = 0; i < 14; i++){
      processedData.daysConditions[i].temp = Math.trunc(5/9 * processedData.daysConditions[i].temp - 32*5/9);
    }
  }
}

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  const location = document.querySelector('#location').value;
  const data = await getData(location);
  console.log(data);
  adress = data.adress;
  const unsplash = await getImg(location);
  const html = document.querySelector('html');
  html.style.backgroundImage = `url(${unsplash})`;
  getImg(location);
  processedData = processData(data);
  console.log(processedData);

  createDays(processedData.daysConditions);
  createCurrent(processedData.currentConditions);
  
});

changeTemp.addEventListener("click", () => {
    console.log(temperature);
    if(temperature === 'C'){
      changeTemp.textContent = temperature;
      temperature = 'F';
    } else {
      temperature = 'C';
      changeTemp.textContent = '°' + temperature;

    };
    tempScale(processedData);

    createDays(processedData.daysConditions);
    createCurrent(processedData.currentConditions);
  })

searchBox.addEventListener('keypress', async () => {
  console.log('joj');
  const input = document.querySelector('#location').value;
  const response = await fetch(`https://api.maptiler.com/geocoding/${input}.json?proximity=ip&autocomplete=false&fuzzyMatch=true&limit=3&key=bSpo2yv3qJI7R5pwxR2u`);
  const data = await response.json();
  console.log(data);
  const data1 = data.features[0].place_name_en;
  console.log(data1);
  const data2 = data.features[1].place_name_en;
  const data3 = data.features[2].place_name_en;
  searchOptions(data1, data2, data3);
})

//DOM

for(let i = 0; i < 3; i++){
  options[i].addEventListener('click', () => {
    searchBox.value = options[i].textContent;
    for(let i = 0; i < 3; i++){
      options[i].style.display = 'none';
    }
  });
}


function searchOptions(data1, data2, data3) {
  for(let i = 0; i < 3; i++){
    options[i].style.display = 'block';
  }
  options[0].textContent = data1;
  options[1].textContent = data2;
  options[2].textContent = data3;
}

let a;

function createCurrent(data){
  if(temperature == 'C'){a = '°'}else{a = ''}
  const temp = document.querySelector('.current > #temp');
  temp.textContent = 'Temp: ' + data.temp + a + temperature;
  const icon = document.querySelector('.current > #icon');
  icon.src = 'imgs/'+data.icon+'.png';
  const location = document.querySelector('.current > #location');
  location.textContent = searchBox.value;
  const feelslike = document.querySelector('.current > #feelslike');
  feelslike.textContent = 'Feels like: ' + data.feelslike + a + temperature;
  const humidity = document.querySelector('.current > #humidity');
  humidity.textContent = 'Humidity: ' + data.humidity + '%';

}

function createDays(data){
  if(temperature == 'C'){a = '°'}else{a = ''}
  const days = document.querySelector('.days');
  days.textContent = '';
  for(let i = 0; i < 5; i++){
    const hour = document.createElement('div');

    const time = document.createElement('div');
    time.setAttribute('id', 'time'+i);
    time.textContent = data[i].date;
    hour.appendChild(time);

    const icon = document.createElement('img');
    icon.src = 'imgs/'+data[i].icon+'.png';
    icon.setAttribute('id', 'icon'+i);
    hour.appendChild(icon);

    const temp = document.createElement('div');
    temp.textContent = data[i].temp + a + temperature;
    temp.setAttribute('id', 'temp'+i);
    hour.appendChild(temp);
    days.appendChild(hour);
  }
  
}

changeTemp.textContent = 'F';