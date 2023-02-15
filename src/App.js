import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);


const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Covid-19 Daily Cases',
    },
  },
};


function App() {

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [data, setData] = useState({});

  const [chartData, setChartData] = useState(null);


  /* 
  * This code sets up an effect that fetches data from an API endpoint 
  * that provides global COVID-19 statistics. The effect runs once, 
  * when the component mounts, as indicated by the empty array as the 
  * second argument of useEffect().
  
  * Inside the effect, fetchData() is an async function that performs 
  * the actual data fetch using the fetch() function. The response from 
  * the API is then converted to a JSON object using response.json(). 
  * Finally, the data is set to state using the setData() function.
  
  * The effect sets up a one-time data fetch from the API endpoint and 
  * stores the data in the component's state.
  */

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://disease.sh/v3/covid-19/all');
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);



  /*
  * This code is using the useEffect hook to fetch a list 
  * of countries from an external API and store it in a state
  * variable countries using the setCountries function. 
  * The code is using an async function fetchCountries that 
  * uses await to wait for the API response before parsing it as JSON and 
  * passing it to the setCountries function. 
  * The useEffect hook is being used with an empty dependency array [], 
  * which means that the hook will only run once when the component is mounted. 
  * This ensures that the countries data is only fetched once when the 
  * component is first rendered.*/
  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch('https://disease.sh/v3/covid-19/countries');
      const data = await response.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);


  /* 
  * It fetches COVID-19 data from an external API using the fetch function. 
  * If the selected country is "worldwide", it fetches global COVID-19 data 
  * from the endpoint https://disease.sh/v3/covid-19/all and sets the fetched
  * data to the data state using the setData function. Otherwise, it fetches
  * COVID-19 data for the selected country from the 
  * endpoint https://disease.sh/v3/covid-19/countries/${selectedCountry} and 
  * sets the fetched data to the data state.
  * This hook runs whenever the selectedCountry value changes.
  */
  useEffect(() => {
    if (selectedCountry === 'worldwide') {
      fetch('https://disease.sh/v3/covid-19/all')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.log(error));
    } else {
      fetch(`https://disease.sh/v3/covid-19/countries/${selectedCountry}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.log(error));
    }
  }, [selectedCountry]);



  function handleCountryChange(event) {
    setSelectedCountry(event.target.value);
  }


  /*
  * This code defines a useEffect hook that fetches daily COVID-19 
  * data for a selected country and updates the chart data state.
  *
  * The hook starts by defining an asynchronous function called 
  * fetchDailyData that fetches the data from the COVID-19 API. 
  * The URL of the API endpoint is set based on the selected country. 
  * If the selected country is not "worldwide", then the URL is set to 
  * fetch data for that specific country. Otherwise, if the selected 
  * country is "worldwide", then the URL is set to fetch data for all countries.
  * 
  * After fetching the data, the function extracts the daily cases, 
  * deaths, and recoveries data for the selected country (if not worldwide) 
  * or for all countries (if worldwide). It then structures this data into 
  * a line chart data format using the Chart.js library. The line chart data 
  * is an object with two properties: labels and datasets. The labels property 
  * contains an array of dates, and the datasets property contains an array of 
  * objects that define the data for each line on the chart (e.g. daily cases, daily deaths, daily recoveries).
  * 
  * Finally, the setChartData function is used to update the chart data state with the newly created line chart data.
  * 
  * This useEffect hook is triggered whenever the selectedCountry state changes. 
  * This means that the chart data will be updated whenever the user selects 
  * a new country from the dropdown menu.
  */

  useEffect(() => {
    const fetchDailyData = async () => {
      let url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=all';

      if (selectedCountry !== 'worldwide') {
        url = `https://disease.sh/v3/covid-19/historical/${selectedCountry}?lastdays=all`;
        const response = await fetch(url);
        const data = await response.json();

        let labels = Object.keys(data.timeline.cases)
        const lineData = {
          labels,
          datasets: [
            {
              label: 'Daily Cases',
              data: Object.values(data.timeline.cases),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Daily Deaths',
              data: Object.values(data.timeline.deaths),
              borderColor: 'rgb(255, 199, 132)',
              backgroundColor: 'rgba(205, 99, 132, 0.5)',
            },
            {
              label: 'Daily Recovered',
              data: Object.values(data.timeline.recovered),
              borderColor: 'rgb(25, 199, 142)',
              backgroundColor: 'rgba(124, 59, 52, 0.5)',
            },
          ],
        };
        setChartData(lineData)
      } else {
        const response = await fetch(url);
        const data = await response.json();

        let labels = Object.keys(data.cases)
        const lineData = {
          labels,
          datasets: [
            {
              label: 'Daily Cases',
              data: Object.values(data.cases),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        };
        setChartData(lineData)
      }


    };
    fetchDailyData();
  }, [selectedCountry]);


  return (
    <div className="">
      {/* Title with Dropdown */}
      {/* 
        * The h1 element displays the title of the dashboard, 
        * which is "Covid-19 Dashboard for [selectedCountry]". 
        * If selectedCountry is equal to "worldwide", it will display 
        * "Covid-19 Dashboard for Worldwide".

        * The dropdown menu is a select element with a default option 
        * "Select a Country" and an option "Worldwide". The other options 
        * are generated dynamically from the countries array using the map method. 
        * Each option has a value of the country's name and displays the 
        * country's name as its text.

        * The onChange event handler is attached to the select element, 
        * which calls the handleCountryChange function when the user selects 
        * a different country.
       */}
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-12 d-lg-flex justify-content-between align-items-lg-center">
            <div>
              <h1>Covid-19 Dashboard for {selectedCountry === 'worldwide' ? 'Worldwide' : selectedCountry}</h1>
            </div>
            <div>
              <select className="form-select" onChange={handleCountryChange} aria-label="Default select example">
                <option selected>Select a Country</option>
                <option value="worldwide" selected>Worldwide</option>
                {countries.map(country => (
                  <option key={country.country} value={country.country}>{country.country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>


      {/* Card Details */}
      {/*
        * It uses the data state variable that is updated in 
        * response to the useEffect hook that fetches data from 
        * the COVID-19 API. The code displays the number of cases, 
        * deaths, and recovered cases in separate cards. The selectedCountry 
        * variable is used to determine whether the data should be for the 
        * selected country or worldwide.
       */}
      <div className="container mt-4">
        <div className="row gy-2">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Cases for {selectedCountry === 'worldwide' ? 'Worldwide' : selectedCountry}</h4>
                <h3>{data.cases}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Deaths for {selectedCountry === 'worldwide' ? 'Worldwide' : selectedCountry}</h4>
                <h3>{data.deaths}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Recovered for {selectedCountry === 'worldwide' ? 'Worldwide' : selectedCountry}</h4>
                <h3>{data.recovered}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart.js Graph */}
      {/*
       * This code is rendering a line chart using the Chart.js 
       * library, based on the chartData state value. If chartData 
       * is null, it displays an error message. If chartData is not 
       * null, it renders a Line component from Chart.js, passing the 
       * chartData as the data prop and the options as the options prop.
       *
      */}
      <div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-12">
              {chartData === null
                ? <div>Error in Data</div>
                : <Line options={options} data={chartData} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
