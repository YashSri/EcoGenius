// Get the form elements
const form = document.querySelector('form');
const electricityInput = document.querySelector('#electricity');
const gasInput = document.querySelector('#gas');
const oilInput = document.querySelector('#oil');
const waterInput = document.querySelector('#water');
const wasteInput = document.querySelector('#waste');
const transportationInput = document.querySelector('#transportation');
const calculateButton = document.querySelector('#calculate');
const resultDiv = document.querySelector('#result');
const chartContainer = document.querySelector('#chart-container');
const carbonChart = document.querySelector('#carbonChart');
const comparisonResult = document.querySelector('#comparison-result');

// Standard carbon footprint values (in kg CO2)
const standardFootprint = {
  electricity: 100,
  gas: 200,
  oil: 150,
  water: 50,
  waste: 75,
  transportation: 300
};

function calculateElectricityCarbonFootprint(electricityConsumption) {
  return electricityConsumption * 0.62;
}

function calculateGasCarbonFootprint(gasConsumption) {
  return gasConsumption * 5.3;
}

function calculateOilCarbonFootprint(oilConsumption) {
  return oilConsumption * 10.2;
}

function calculateWaterCarbonFootprint(waterConsumption) {
  return waterConsumption * 0.24;
}

function calculateWasteCarbonFootprint(wasteGeneration) {
  return wasteGeneration * 0.82;
}

function calculateTransportationCarbonFootprint(transportationMiles) {
  return transportationMiles * 0.41;
}

// Define the main calculation function
function calculateCarbonFootprint(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const electricityConsumption = parseFloat(electricityInput.value) || 0;
  const gasConsumption = parseFloat(gasInput.value) || 0;
  const oilConsumption = parseFloat(oilInput.value) || 0;
  const waterConsumption = parseFloat(waterInput.value) || 0;
  const wasteGeneration = parseFloat(wasteInput.value) || 0;
  const transportationMiles = parseFloat(transportationInput.value) || 0;

  const electricityCarbonFootprint = calculateElectricityCarbonFootprint(electricityConsumption);
  const gasCarbonFootprint = calculateGasCarbonFootprint(gasConsumption);
  const oilCarbonFootprint = calculateOilCarbonFootprint(oilConsumption);
  const waterCarbonFootprint = calculateWaterCarbonFootprint(waterConsumption);
  const wasteCarbonFootprint = calculateWasteCarbonFootprint(wasteGeneration);
  const transportationCarbonFootprint = calculateTransportationCarbonFootprint(transportationMiles);

  const totalCarbonFootprint = electricityCarbonFootprint + gasCarbonFootprint + oilCarbonFootprint + waterCarbonFootprint + wasteCarbonFootprint + transportationCarbonFootprint;

  // Display the result as a chart
  displayCarbonFootprintChart({
    electricity: electricityCarbonFootprint,
    gas: gasCarbonFootprint,
    oil: oilCarbonFootprint,
    water: waterCarbonFootprint,
    waste: wasteCarbonFootprint,
    transportation: transportationCarbonFootprint,
  }, totalCarbonFootprint);

  // Compare with standard values
  compareWithStandards({
    electricity: electricityCarbonFootprint,
    gas: gasCarbonFootprint,
    oil: oilCarbonFootprint,
    water: waterCarbonFootprint,
    waste: wasteCarbonFootprint,
    transportation: transportationCarbonFootprint,
  });
}

function displayCarbonFootprintChart(data, total) {
  const ctx = carbonChart.getContext('2d');
  if (window.chart) window.chart.destroy();

  window.chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Electricity', 'Gas', 'Oil', 'Water', 'Waste', 'Transportation'],
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#67b151', '#4ba44e'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#67b151', '#4ba44e'],
      }]
    },
    options: {
      responsive: true,
      cutoutPercentage: 60, // Adjusted size of the donut chart
      legend: {
        position: 'bottom',
        labels: {
          fontSize: 14
        }
      },
      plugins: {
        datalabels: {
          color: '#fff',
          formatter: (value, ctx) => {
            let label = ctx.chart.data.labels[ctx.dataIndex];
            return `${label}: ${value.toFixed(2)} kg CO2`;
          }
        }
      },
      title: {
        display: true,
        text: `Total Carbon Footprint: ${total.toFixed(2)} kg CO2`,
        fontSize: 16
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });

  chartContainer.classList.remove('none');
}

function compareWithStandards(data) {
  let comparisonText = '';
  for (const [key, value] of Object.entries(data)) {
    if (value > standardFootprint[key]) {
      comparisonText += `<p>Your ${key} carbon footprint is ${value.toFixed(2)} kg CO2, which is higher than the standard (${standardFootprint[key]} kg CO2).</p>`;
    } else if (value < standardFootprint[key]) {
      comparisonText += `<p>Your ${key} carbon footprint is ${value.toFixed(2)} kg CO2, which is lower than the standard (${standardFootprint[key]} kg CO2).</p>`;
    } else {
      comparisonText += `<p>Your ${key} carbon footprint is exactly at the standard (${standardFootprint[key]} kg CO2).</p>`;
    }
  }
  comparisonResult.innerHTML = comparisonText;
  comparisonResult.classList.remove('none');
}

// Add event listener to the form submission event
form.addEventListener('submit', calculateCarbonFootprint);
