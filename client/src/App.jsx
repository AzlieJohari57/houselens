import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Prediction from "./components/Prediction";
import PredictionResult from "./components/PredictionResult";
import Forecasting from "./components/Forecasting";
import Pricing from "./components/Pricing";
import SuccessfulPayment from "./components/SuccessfulPayment";

import TestPrediction from "./components/TestPrediction";
import TestForecasting from "./components/TestForecasting";

import Chatbot from "./components/TestChatbot";
import Test from "./components/test";


import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/predictionresult" element={<PredictionResult />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/SuccessfulPayment" element={<SuccessfulPayment />} />

          <Route path="/TestPrediction" element={<TestPrediction />} />
          <Route path="/TestForecasting" element={<TestForecasting />} />

          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
