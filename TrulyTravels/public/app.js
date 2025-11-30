// DOM elements
const homeSection = document.getElementById('home-section');
const resultsSection = document.getElementById('results-section');
const historySection = document.getElementById('history-section');
const pricingSection = document.getElementById('pricing-section');
const tripForm = document.getElementById('trip-form');
const costBreakdown = document.getElementById('cost-breakdown');
const tripHistory = document.getElementById('trip-history');
const saveTripBtn = document.getElementById('save-trip-btn');

// Navigation
document.getElementById('home-btn').addEventListener('click', showHome);
document.getElementById('history-btn').addEventListener('click', showHistory);
document.getElementById('pricing-btn').addEventListener('click', showPricing);
document.getElementById('get-started-btn').addEventListener('click', showPlanTrip);

function showHome() {
  hideAllSections();
  homeSection.classList.remove('hidden');
}

function showHistory() {
  hideAllSections();
  historySection.classList.remove('hidden');
  loadTripHistory();
}

function showPricing() {
  hideAllSections();
  pricingSection.classList.remove('hidden');
}

function showPlanTrip() {
  window.location.href = 'plan-trip.html';
}

function hideAllSections() {
  homeSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  historySection.classList.add('hidden');
  pricingSection.classList.add('hidden');
}

// Form submission
tripForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
    startDate: document.getElementById('start-date').value,
    endDate: document.getElementById('end-date').value,
    travelers: parseInt(document.getElementById('travelers').value),
    accommodation: document.getElementById('accommodation').value,
    transportation: document.getElementById('transportation').value
  };

  try {
    const response = await fetch('/api/estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const trip = await response.json();
    displayCostBreakdown(trip);
    showResults();
  } catch (error) {
    console.error('Error estimating trip:', error);
    alert('Error estimating trip. Please try again.');
  }
});

function displayCostBreakdown(trip) {
  costBreakdown.innerHTML = `
    <div class="breakdown-item">
      <span>Transportation:</span>
      <span>$${trip.breakdown.transportation}</span>
    </div>
    <div class="breakdown-item">
      <span>Accommodation:</span>
      <span>$${trip.breakdown.accommodation}</span>
    </div>
    <div class="breakdown-item">
      <span>Food:</span>
      <span>$${trip.breakdown.food}</span>
    </div>
    <div class="breakdown-item">
      <span>Activities:</span>
      <span>$${trip.breakdown.activities}</span>
    </div>
    <div class="breakdown-item total">
      <span>Total Cost:</span>
      <span>$${trip.totalCost}</span>
    </div>
  `;
}

function showResults() {
  hideAllSections();
  resultsSection.classList.remove('hidden');
}

saveTripBtn.addEventListener('click', () => {
  alert('Trip saved!');
  showHome();
});

async function loadTripHistory() {
  try {
    const response = await fetch('/api/trips');
    const trips = await response.json();

    tripHistory.innerHTML = '';
    trips.forEach(trip => {
      const tripElement = document.createElement('div');
      tripElement.className = 'trip-item';
      tripElement.innerHTML = `
        <h3>${trip.origin} to ${trip.destination}</h3>
        <p>Dates: ${trip.startDate} to ${trip.endDate}</p>
        <p>Travelers: ${trip.travelers}</p>
        <p>Total Cost: $${trip.totalCost}</p>
      `;
      tripHistory.appendChild(tripElement);
    });
  } catch (error) {
    console.error('Error loading trip history:', error);
  }
}

// Initialize
showHome();
