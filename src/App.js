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


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://disease.sh/v3/covid-19/all');
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch('https://disease.sh/v3/covid-19/countries');
      const data = await response.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);



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
