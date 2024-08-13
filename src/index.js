let temp = 'F';

async function getData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=NVMFQ3NAJSPXZF28XR7DRFV3U`, {mode: 'cors'})
  const data = await response.json();

  return data;
}

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

const submit = document.querySelector('#submit');

const changeTemp = document.querySelector('#changeTemp');

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  const location = document.querySelector('#location').value;
  const data = await getData(location);
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

});

