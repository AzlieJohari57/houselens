import React, { useState } from "react";
import axios from "axios";

const TestPrediction = () => {
  const [formData, setFormData] = useState({
    Location: "",
    Rooms: "",
    Bathrooms: "",
    'Car Parks': "",
    'Property Type': "",
    Furnishing: "",
    'Build Type': "",
    Sqft: "",
  });

  const [predictedPrice, setPredictedPrice] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data for submission
    const formattedData = {
      Location: [formData.Location],
      Rooms: [parseInt(formData.Rooms)],
      Bathrooms: [parseInt(formData.Bathrooms)],
      'Car Parks': [parseInt(formData['Car Parks'])],
      'Property Type': [formData['Property Type']],
      Furnishing: [formData.Furnishing],
      'Build Type': [formData['Build Type']],
      Sqft: [parseInt(formData.Sqft)],
    };

    axios
      .post("http://localhost:8800/predict", formattedData)
      .then((response) => setPredictedPrice(response.data.predicted_price))
      .catch((error) => console.error("Error predicting house price:", error));
  };

  return (
    <div>
      <h1>House Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </div>
        <div>
          <label>Rooms</label>
          <input
            type="number"
            name="Rooms"
            value={formData.Rooms}
            onChange={handleChange}
            placeholder="Enter number of rooms"
          />
        </div>
        <div>
          <label>Bathrooms</label>
          <input
            type="number"
            name="Bathrooms"
            value={formData.Bathrooms}
            onChange={handleChange}
            placeholder="Enter number of bathrooms"
          />
        </div>
        <div>
          <label>Car Parks</label>
          <input
            type="number"
            name="Car Parks"
            value={formData['Car Parks']}
            onChange={handleChange}
            placeholder="Enter number of car parks"
          />
        </div>
        <div>
          <label>Property Type</label>
          <select
            name="Property Type"
            value={formData['Property Type']}
            onChange={handleChange}
          >
            <option value="">Select property type</option>
            <option value="Serviced Residence">Serviced Residence</option>
            <option value="Apartment">Apartment</option>
            <option value="Condominium">Condominium</option>
            {/* Add other options as needed */}
          </select>
        </div>
        <div>
          <label>Furnishing</label>
          <select
            name="Furnishing"
            value={formData.Furnishing}
            onChange={handleChange}
          >
            <option value="">Select furnishing</option>
            <option value="Partly Furnished">Partly Furnished</option>
            <option value="Fully Furnished">Fully Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            {/* Add other options as needed */}
          </select>
        </div>
        <div>
          <label>Build Type</label>
          <input
            type="text"
            name="Build Type"
            value={formData['Build Type']}
            onChange={handleChange}
            placeholder="Enter build type"
          />
        </div>
        <div>
          <label>Sqft</label>
          <input
            type="number"
            name="Sqft"
            value={formData.Sqft}
            onChange={handleChange}
            placeholder="Enter square footage"
          />
        </div>
        <button type="submit">Predict Price</button>
      </form>
      {predictedPrice !== null && (
        <div>
          <h2>Predicted Price: {predictedPrice}</h2>
        </div>
      )}
    </div>
  );
};

export default TestPrediction;
