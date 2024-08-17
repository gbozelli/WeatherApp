import { createApi } from 'unsplash-js';


const apiKey = "bSpo2yv3qJI7R5pwxR2u";

let temp = 'F';

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
    humidity: data.humidity
  };
  return currentDay;
}

function getDaysCondition(data){
  let days = []
  for(let i = 0; i < 14; i++){
    days.push({
      temp: data[i].temp, 
      icon: data[i].icon
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
  if(temp === 'F'){
    processedData.currentConditions.temp = 9/5 * processedData.currentConditions.temp + 32;
    for(let i = 0; i < 24; i++){
      processedData.hoursConditions[i].temp = 9/5 * processedData.hoursConditions[i].temp + 32;
    }
    for(let i = 0; i < 14; i++){
      processedData.daysConditions[i].temp = 9/5 * processedData.daysConditions[i].temp + 32;
    }
  } else {
    temp = 'C';
    processedData.currentConditions.temp = 5/9 * processedData.currentConditions.temp - 32*5/9;
    for(let i = 0; i < 24; i++){
      processedData.hoursConditions[i].temp = 5/9 * processedData.hoursConditions[i].temp - 32*5/9;
    }
    for(let i = 0; i < 14; i++){
      processedData.daysConditions[i].temp = 5/9 * processedData.daysConditions[i].temp - 32*5/9;
    }
  }
}

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  const location = document.querySelector('#location').value;
  const data = await getData(location);
  const unsplash = await getImg(location);
  const html = document.querySelector('html');
  html.style.backgroundImage = `url(${unsplash})`;
  getImg(location);
  const processedData = processData(data);
  console.log(temp);
  if (temp === 'C'){
    tempScale(processedData);
  }
  console.log(processedData);
  changeTemp.addEventListener("click", () => {
    if(temp === 'C'){
      temp = 'F';
    } else {
      temp = 'C';
    };
    tempScale(processedData);
    console.log(temp);
    console.log(processedData);
  })
  createHours(processedData.hoursConditions);
  createDays(processedData.daysConditions);
  createCurrent(processedData.currentConditions);
});

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

function createCurrent(data){
  const temp = document.querySelector('.current > temp');
  temp.textContent = data.temp;
  const icon = document.querySelector('.current > icon');
  icon.src = data.icon;
  const location = document.querySelector('.current > location');
  temp.textContent = data.location;
  const feelslike = document.querySelector('.current > feelslike');
  feelslike.textContent = data.feelslike;
  const humidity = document.querySelector('.current > humidity');
  humidity.textContent = data.humidity;

}

function createHours(data){
  const today = document.querySelector('.today');
  for(let i = 0; i < 24; i++){
    const day = document.createElement('div');

    const hour = document.createElement('div');
    hour.setAttribute('id', 'hour'+i);
    hour.textContent = data[i].datetime;
    day.appendChild(hour);

    const icon = document.createElement('img');
    icon.src = data[i].icon;
    hour.setAttribute('id', 'icon'+i);
    day.appendChild(icon);

    const temp = document.createElement('div');
    temp.textContent = data[i].temp;
    hour.setAttribute('id', 'temp'+i);
    day.appendChild(temp);
    today.appendChild(day);
  }
  
}

function createDays(data){
  const days = document.querySelector('.days');
  for(let i = 0; i < 14; i++){
    const hour = document.createElement('div');

    const time = document.createElement('div');
    hour.setAttribute('id', 'time'+i);
    hour.textContent = data[i].datetime;
    time.appendChild(hour);

    const icon = document.createElement('img');
    icon.src = data[i].icon;
    hour.setAttribute('id', 'icon'+i);
    hour.appendChild(icon);

    const temp = document.createElement('div');
    temp.textContent = data[i].temp;
    hour.setAttribute('id', 'temp'+i);
    hour.appendChild(temp);
    days.appendChild(hour);
  }
  
}
