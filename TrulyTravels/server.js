const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for trips
let trips = [];

// API endpoint for trip estimation
app.post('/api/estimate', (req, res) => {
  const { origin, destination, startDate, endDate, travelers, accommodation, transportation } = req.body;

  // Simple cost calculation (mock data)
  const baseCosts = {
    flight: 500,
    hotel: 100,
    food: 50,
    activities: 30
  };

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalCost = (baseCosts.flight + baseCosts.hotel * days + baseCosts.food * days + baseCosts.activities * days) * travelers;

  const breakdown = {
    transportation: baseCosts.flight * travelers,
    accommodation: baseCosts.hotel * days * travelers,
    food: baseCosts.food * days * travelers,
    activities: baseCosts.activities * days * travelers
  };

  const trip = {
    id: Date.now(),
    origin,
    destination,
    startDate,
    endDate,
    travelers,
    accommodation,
    transportation,
    totalCost,
    breakdown,
    createdAt: new Date()
  };

  trips.push(trip);

  res.json(trip);
});

// API endpoint to get trip history
app.get('/api/trips', (req, res) => {
  res.json(trips);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
