import express from "express";
import mysql from "mysql";
import cors from "cors";
import axios from "axios";
import session from "express-session";
import cookieParser from "cookie-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Stripe from "stripe";
const stripe = Stripe(
  "sk_test_51Pbya8RoC4Hvexv47rsi462KBkvMXwzNQyREjDLAGVXiwtHihRiEZiSFWqr6Tn9qYRojJvBT5gj1I27aWIaGtC9N00yBBQcKvi"
);
import { raw } from "express"; // Import the raw function from express

const app = express();

// Endpoint to handle Stripe webhook
//============================================================================================================================

const endpointSecret =
  "whsec_51d51f68d15ec9bae07f7550396b9121c39c8b05048ba11f85fb2f137bd310f7";

// Middleware for webhook
app.use("/webhook", express.raw({ type: "application/json" }));

app.post("/webhook", (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session completed:", session);

    handleCheckoutSessionCompleted(session);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send();
});

import mysql2 from "mysql2/promise"; // Using mysql2/promise for async/await
const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "houselens",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function handleCheckoutSessionCompleted(session) {
  console.log("Payment was successful!");
  console.log("Session metadata:", session.metadata);
  const userID = session.metadata.session_id;
  console.log("Session ID from metadata:", userID);

  if (!userID) {
    console.error("Session ID not found in session metadata.");
    return;
  }

  const sql =
    "UPDATE `user` SET `user_freemium` = 'Premium' WHERE `user_id` = ?";
  const values = [userID];

  let connection;

  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(sql, values);
    console.log("Payment recorded successfully, user upgraded to Premium");
  } catch (err) {
    console.error("Database error:", err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
//============================================================================================================================

app.use(express.json());
app.use(cookieParser());

// Configure session middleware
app.use(
  session({
    secret: "your-secret-key", // Add a secret key for session signing
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
    },
  })
);

// Define CORS configuration to allow requests from both Python script and frontend
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "houselens",
});

// Initialize Google Generative AI
const GOOGLE_GEN_AI_KEY = "AIzaSyDQBVzWS4OpIKHJ6f4IxENztwFCpoZU0YI";
const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);

// GET Request to fetch data from Python API
app.get("/fetch-data-from-python", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/get-data");
    console.log("Data received from Python API:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Python API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET session route
app.get("/session", (req, res) => {
  if (req.session.username) {
    return res.json({
      valid: true,
      username: req.session.user_id,
      freemium: req.session.freemium
    });
  } else {
    return res.json({ valid: false });
  }
});

// POST Request for user sign-in
app.post("/verifysignin", (req, res) => {
  const sql = "SELECT * FROM `user` WHERE user_username = ?";
  const subsql = "SELECT * FROM `user` WHERE user_username = ? AND user_password = ?";
  const values = [req.body.username, req.body.password];

  db.query(sql, [values[0]], (err, result) => {
    if (err) {
      return res.json({ success: false, message: "Database query error", error: err });
    }
    if (result.length > 0) {
      db.query(subsql, values, (err, result2) => {
        if (err) {
          return res.json({ success: false, message: "Database query error", error: err });
        }
        if (result2.length > 0) {
          const user = result2[0];
          if (user.user_password === req.body.password) {
            req.session.user_id = user.user_id;
            req.session.username = user.user_username;
            req.session.freemium = user.user_freemium;
            return res.json({
              success: true,
              message: "Login successful",
              username: user.user_username,
              freemium: user.user_freemium,
            });
          } else {
            return res.json({ success: false, message: "Incorrect password" });
          }
        } else {
          return res.json({ success: false, message: "Incorrect password" });
        }
      });
    } else {
      return res.json({ success: false, message: "User doesn't exist" });
    }
  });
});
// REGISTER
app.post("/register", async (req, res) => {
  const { fullname, email, username, password } = req.body;
  const freemium = "Free";

  try {
    // Prepare the SQL query
    const sql =
      "INSERT INTO `user` (`user_fullname`, `user_email`, `user_username`, `user_password`, `user_freemium`) VALUES (?, ?, ?, ?, ?)";
    const values = [fullname, email, username, password, freemium];

    // Execute the SQL query
    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Error hashing password" });
  }
});

// POST Request to send and process data to Python API
app.post("/send-and-process-data", async (req, res) => {
  try {
    const { roomNum, area } = req.body;
    const dataObject = { roomNum, area, timestamp: new Date() };
    const response = await axios.post(
      "http://localhost:5000/process-data",
      dataObject
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Python API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/houselist", (req, res) => {
  const { minPrice, maxPrice, Location } = req.body;
  console.log("Request Body:", req.body);

  let q = "SELECT * FROM houselist WHERE House_Price BETWEEN ? AND ?";
  const queryParams = [minPrice, maxPrice];

  // Add House_Location to the query if it's provided
  if (Location) {
    q += " AND House_Location = ?";
    queryParams.push(Location);
  }

  console.log("Constructed Query:", q);
  console.log("Query Parameters:", queryParams);

  db.query(q, queryParams, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

// PREDICTION MODEL
// ================================================================

app.post("/predict", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      Location,
      Rooms,
      Bathrooms,
      "Car Parks": CarParks,
      "Property Type": PropertyType,
      Furnishing,
      "Build Type": BuildType,
      Sqft,
    } = req.body;

    // Prepare the data to send to the Flask endpoint
    const data = {
      Location,
      Rooms: Rooms.map((room) => parseInt(room)),
      Bathrooms: Bathrooms.map((bathroom) => parseInt(bathroom)),
      "Car Parks": CarParks.map((carPark) => parseInt(carPark)),
      "Property Type": PropertyType,
      Furnishing,
      "Build Type": BuildType,
      Sqft: Sqft.map((sqft) => parseInt(sqft)),
    };

    // Send POST request to Flask endpoint
    const response = await axios.post("http://127.0.0.1:5000/predict", data);

    // Send the prediction result back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching the prediction.");
  }
});

// FORECASTING MODEL
// ================================================================

app.post("/forecast", async (req, res) => {
  try {
    const { mortgageInterest, vacancyRate, cpi, medianSalesPrice } = req.body;

    const data = {
      "Mortgage Interest": parseFloat(mortgageInterest),
      "Vacancy Rate": parseFloat(vacancyRate),
      CPI: parseFloat(cpi),
      "Median Sales Price": parseFloat(medianSalesPrice),
    };

    const response = await axios.post("http://127.0.0.1:5000/forecast", data);

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching the forecast.");
  }
});

// POST endpoint for Google Generative AI
app.post("/gemini", async (req, res) => {
  try {
    if (!genAI) {
      throw new Error("Generative AI module is not properly defined");
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const message = req.body.message;
    const result = await model.generateContent(message);
    const generatedText = result.response.candidates[0].content.parts[0].text;
    res.json({ message: generatedText });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid"); // clear the session cookie
    return res.json({ success: true, message: "Logout successful" });
  });
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    // Extract the sessionID from request body
    const { sessionID } = req.body;

    if (!sessionID) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Create the checkout session with Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1PisZzRoC4Hvexv4uzUiOZsW", // Replace with your actual price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/SuccessfulPayment",
      cancel_url: "http://localhost:5173/home",
      metadata: {
        session_id: sessionID, // Include session ID in metadata
      },


    });

    res.json({ id: stripeSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message); // Log error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8800, () => {
  console.log("Connected to backend on http://localhost:8800/");
});
