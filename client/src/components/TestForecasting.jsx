import React, { useState } from 'react';
import axios from 'axios';

const TestForecasting = () => {
  const [formData, setFormData] = useState({
    mortgageInterest: '',
    vacancyRate: '',
    cpi: '',
    medianSalesPrice: ''
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to Node.js endpoint
      const response = await axios.post('http://localhost:8800/forecast', {
        mortgageInterest: parseFloat(formData.mortgageInterest),
        vacancyRate: parseFloat(formData.vacancyRate),
        cpi: parseFloat(formData.cpi),
        medianSalesPrice: parseFloat(formData.medianSalesPrice)
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Forecasting Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mortgage Interest Rate:</label>
          <input
            type="number"
            name="mortgageInterest"
            value={formData.mortgageInterest}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Vacancy Rate:</label>
          <input
            type="number"
            name="vacancyRate"
            value={formData.vacancyRate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>CPI:</label>
          <input
            type="number"
            name="cpi"
            value={formData.cpi}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Median Sales Price:</label>
          <input
            type="number"
            name="medianSalesPrice"
            value={formData.medianSalesPrice}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {prediction && (
        <div>
          <h2>Prediction Result</h2>
          <p>Forecasted Median House Price: {prediction.forecast_median_house_price}</p>
        </div>
      )}
    </div>
  );
};

export default TestForecasting;
